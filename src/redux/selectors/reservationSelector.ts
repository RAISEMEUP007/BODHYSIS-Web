import { createSelector } from '@reduxjs/toolkit';
import { rootSelector } from './rootSelector';

export const getReservationInfoSelector = createSelector(
  rootSelector,
  (state) => state.reservation
);
