import { basePostAPICall, getAPICall, postAPICall } from './BaseAPI';

export const verifyQauntity = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('reservation/verifyquantity', payload, cb);
};

export const createReservation = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('reservations/createreservation', payload, cb);
};

export const getReservationsData = (cb=(jR, s, e)=>{}) => {
  getAPICall('reservations/getreservationsdata/', cb);
}

export const getReservationDetail = async (id, cb=(jR, s, e)=>{}) => {
  return await getAPICall('reservations/getreservationdetails/' + id, cb);
}

export const updateReservation = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('reservations/updatereservation', payload, cb);
};

export const deleteReservationItem = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('reservation/removereservationitem', payload, cb);
};

export const createTransaction = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('reservation/createtransaction', payload, cb);
};

export const  getTransactionsData= (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('reservation/gettransactionsdata/', payload, cb);
}