import * as SQLite from 'expo-sqlite';
import { ActivityItem, DailyActivitiesRecord } from '../types/types';

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
      CREATE TABLE IF NOT EXISTS activities (
        activity_id INTEGER PRIMARY KEY AUTOINCREMENT,
        day_id INTEGER NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        activity TEXT NOT NULL,
        category TEXT NOT NULL,
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

export const saveDailyActivities = async (date: string, activities: ActivityItem[]) => {
  try {
    const database = await db;
    await database.execAsync('BEGIN TRANSACTION');

    // Insert or get day_id
    const dayResult = await database.runAsync(
      'INSERT OR REPLACE INTO days (date) VALUES (?) RETURNING day_id',
      [date]
    );
    const dayId = dayResult.lastInsertRowId;

    // Delete existing activities for the day_id
    await database.runAsync('DELETE FROM activities WHERE day_id = ?', [dayId]);

    // Insert new activities with day_id
    for (const activity of activities) {
      await database.runAsync(
        'INSERT INTO activities (day_id, start_time, end_time, activity, category) VALUES (?, ?, ?, ?, ?)',
        [dayId, activity.startTime, activity.endTime, activity.activity, activity.category]
      );
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
      result[dayRow.date] = [];

      // Load activities using day_id
      const activityRows = await database.getAllAsync<{start_time: string; end_time: string; activity: string; category: string}>(
        'SELECT start_time, end_time, activity, category FROM activities WHERE day_id = ?',
        [dayRow.day_id]
      );

      result[dayRow.date] = activityRows.map(row => ({
        startTime: row.start_time,
        endTime: row.end_time,
        activity: row.activity,
        category: row.category
      }));
    }

    return result;
  } catch (error) {
    console.error('Error loading daily activities:', error);
    throw error;
  }
};