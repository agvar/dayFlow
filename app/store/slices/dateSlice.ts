import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface DateState {
  selectedDate: string;
}

const initialState: DateState = {
  selectedDate: new Date().toISOString().split('T')[0],
};

const dateSlice = createSlice({
  name: 'date',
  initialState,
  reducers: {
    setSelectedDate: (state, action: PayloadAction<Date>) => {
      state.selectedDate = action.payload.toISOString().split('T')[0];
    },
  },
});

export const { setSelectedDate } = dateSlice.actions;

export const selectDate = (state: RootState) => state.date.selectedDate;
export const selectFormattedDate = createSelector(
  [selectDate],
  (date) => new Date(date)
);

export default dateSlice.reducer;