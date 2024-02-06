import { basePostAPICall, getAPICall, postAPICall } from './BaseAPI';

export const createReservation = (payload, callback) => {
  postAPICall('reservations/createreservation', payload, callback);
};