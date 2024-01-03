import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import dayjs, { Dayjs } from 'dayjs';

export interface ReservationState {
  startDate: string | null;
  endDate: string | null;
  reservationDuration: string | null;
  billableDays: number;
  startDayjs: Dayjs | null;
  endDayjs: Dayjs | null;
  durationDays: number;
  durationHours: number;
  formattedDuration: string;
}

const initialState: ReservationState = {
  startDate: null,
  endDate: null,
  startDayjs: null,
  endDayjs: null,
  reservationDuration: null,
  billableDays: 1,
  durationDays: 0,
  durationHours: 0,
  formattedDuration: '',
};

export const reservationSlice = createSlice({
  name: 'reservation',
  initialState,
  reducers: {
    updateReservation: (
      state,
      action: PayloadAction<{
        startDate: string;
        endDate: string;
      }>
    ) => {
      const { startDate, endDate } = action.payload;
      state.startDate = startDate;
      state.endDate = endDate;

      const startDayjs = dayjs(startDate);
      const endDayjs = dayjs(endDate);

      state.startDayjs = startDayjs;
      state.endDayjs = endDayjs;

      const durationDays = endDayjs.diff(startDayjs, 'days');
      const durationHours = endDayjs.diff(startDayjs, 'hours');

      state.durationDays = durationDays;
      state.durationHours = durationHours;

      state.formattedDuration =
        durationDays > 0 ? `${durationDays} days` : `${durationHours} hours`;

      if (durationDays > 1) {
        state.durationDays = Math.ceil(durationDays);
        state.billableDays = Math.ceil(durationDays);
      }
    },
  },
});

export const { updateReservation } = reservationSlice.actions;

export default reservationSlice.reducer;
