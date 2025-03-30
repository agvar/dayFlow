import { configureStore } from '@reduxjs/toolkit';
import activitiesReducer from './slices/activitiesSlice';
import dateReducer from './slices/dateSlice';
import sleepTimeReducer from './slices/sleepTimeSlice';

export const store = configureStore({
  reducer: {
    activities: activitiesReducer,
    date: dateReducer,
    sleepTime: sleepTimeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;