import { basePostAPICall, getAPICall, postAPICall } from './BaseAPI';

export const createReservation = (payload, callback) => {
  postAPICall('reservations/createreservation', payload, callback);
};

export const getReservationsData = (callback) => {
  getAPICall('reservations/getreservationsdata/', callback);
}

export const getReservationDetail = (id, callback) => {
  getAPICall('reservations/getreservationdetails/' + id, callback);
}

export const updateReservation = (payload, callback) => {
  postAPICall('reservations/updatereservation', payload, callback);
};