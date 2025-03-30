import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
export default dateSlice.reducer;