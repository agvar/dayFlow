import * as SQLite from 'expo-sqlite';
import { ActivityType, DailyActivitiesRecord, SleepTime } from '../types/types';

const db = SQLite.openDatabaseAsync('dailyActivities.db');

export const initDatabase = async () => {
  try {
    console.log('Opening database connection...');
    const database = await db;
    console.log('Database connection opened successfully');
    
    console.log('Creating database tables...');
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS days (
        day_id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL UNIQUE
      );
      CREATE TABLE IF NOT EXISTS  sleep_times(
        sleep_id INTEGER PRIMARY KEY AUTOINCREMENT,
        day_id INTEGER NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        FOREIGN KEY (day_id) REFERENCES days(day_id)
      );
      CREATE TABLE IF NOT EXISTS activities (
        activity_id INTEGER PRIMARY KEY AUTOINCREMENT,
        day_id INTEGER NOT NULL,
        hour INTEGER NOT NULL,
        activity TEXT NOT NULL,
        FOREIGN KEY (day_id) REFERENCES days(day_id)
      );
    `);
    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
};

export const saveDailyActivities = async (date: string, activities: { hour: string; activity: ActivityType }[], sleepTime: SleepTime) => {
  try {
    const database = await db;
    await database.execAsync('BEGIN TRANSACTION');

    // Insert or get day_id
    const dayResult = await database.runAsync(
      'INSERT OR REPLACE INTO days (date) VALUES (?) RETURNING day_id',
      [date]
    );
    const dayId = dayResult.lastInsertRowId;

    // Insert sleep time with day_id
    await database.runAsync(
      'INSERT OR REPLACE INTO sleep_times (day_id, start_time, end_time) VALUES (?, ?, ?)',
      [dayId, sleepTime.start, sleepTime.end]
    );

    // Delete existing activities for the day_id
    await database.runAsync('DELETE FROM activities WHERE day_id = ?', [dayId]);

    // Insert new activities with day_id
    for (const activity of activities) {
      if (activity.activity) {
        await database.runAsync(
          'INSERT INTO activities (day_id, hour, activity) VALUES (?, ?, ?)',
          [dayId, parseInt(activity.hour), activity.activity]
        );
      }
    }

    await database.execAsync('COMMIT');
  } catch (error) {
    const database = await db;
    await database.execAsync('ROLLBACK');
    console.error('Error saving daily activities:', error);
    throw error;
  }
};

export const loadDailyActivities = async (): Promise<DailyActivitiesRecord> => {
  try {
    const database = await db;
    const result: DailyActivitiesRecord = {};

    // Get all days
    const dayRows = await database.getAllAsync<{day_id: number; date: string}>(
      'SELECT day_id, date FROM days'
    );

    for (const dayRow of dayRows) {
      // Initialize default data for this date
      result[dayRow.date] = {
        sleepTime: { start: '22:00', end: '06:00' },
        activities: Array.from({length: 24}, () => ({ hour: '', activity: '' as ActivityType }))
      };

      // Load sleep time using day_id
      const sleepTimeRows = await database.getAllAsync<{start_time: string; end_time: string}>(
        'SELECT start_time, end_time FROM sleep_times WHERE day_id = ?',
        [dayRow.day_id]
      );

      if (sleepTimeRows.length > 0) {
        result[dayRow.date].sleepTime = {
          start: sleepTimeRows[0].start_time,
          end: sleepTimeRows[0].end_time
        };
      }

      // Load activities using day_id
      const activityRows = await database.getAllAsync<{hour: number; activity: ActivityType}>(
        'SELECT hour, activity FROM activities WHERE day_id = ?',
        [dayRow.day_id]
      );

      activityRows.forEach(row => {
        result[dayRow.date].activities[row.hour] = {
          hour: row.hour.toString().padStart(2, '0') + ':00',
          activity: row.activity
        };
      });
    }

    return result;
  } catch (error) {
    console.error('Error loading daily activities:', error);
    throw error;
  }
};