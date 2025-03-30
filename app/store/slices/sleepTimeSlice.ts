import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SleepTime } from '../../types/types';

interface SleepTimeState {
  sleepTime: SleepTime;
}

const initialState: SleepTimeState = {
  sleepTime: {
    start: '22:00',
    end: '06:00'
  }
};

const sleepTimeSlice = createSlice({
  name: 'sleepTime',
  initialState,
  reducers: {
    setSleepTime: (state, action: PayloadAction<SleepTime>) => {
      state.sleepTime = action.payload;
    },
  },
});

export const { setSleepTime } = sleepTimeSlice.actions;
export default sleepTimeSlice.reducer;