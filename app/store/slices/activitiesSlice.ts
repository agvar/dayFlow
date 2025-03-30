import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { DailyActivitiesRecord, SleepTime } from '../../types/types';
import { initDatabase, loadDailyActivities, saveDailyActivities } from '../../utils/database';

interface ActivitiesState {
  dailyActivities: DailyActivitiesRecord;
  isLoading: boolean;
  error: string | null;
}

const initialState: ActivitiesState = {
  dailyActivities: {},
  isLoading: false,
  error: null,
};

export const initializeDatabase = createAsyncThunk(
  'activities/initializeDatabase',
  async () => {
    await initDatabase();
    const savedActivities = await loadDailyActivities();
    return savedActivities;
  }
);

export const saveActivities = createAsyncThunk(
  'activities/saveActivities',
  async ({ day, activities, sleepTime }: { day: string; activities: any[]; sleepTime: SleepTime }) => {
    await saveDailyActivities(day, activities, sleepTime);
    return { day, activities, sleepTime };
  }
);

const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    updateDailyActivities: (state, action) => {
      const { day, activities, sleepTime } = action.payload;
      state.dailyActivities[day] = {
        activities,
        sleepTime,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeDatabase.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeDatabase.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dailyActivities = action.payload;
      })
      .addCase(initializeDatabase.rejected, (state, action) => {
        state.isLoading = false;
        state.error = 'Failed to initialize database. Please restart the app.';
      })
      .addCase(saveActivities.rejected, (state) => {
        state.error = 'Failed to save activities. Please try again.';
      });
  },
});

export const { updateDailyActivities } = activitiesSlice.actions;
export default activitiesSlice.reducer;