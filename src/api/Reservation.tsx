import { basePostAPICall, getAPICall, postAPICall } from './BaseAPI';

export const verifyQauntity = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('reservation/verifyquantity', payload, cb);
};

export const createReservation = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('reservations/createreservation', payload, cb);
};

export const getReservationsData = (searchOptions, cb=(jR, s, e)=>{}) => {
  postAPICall('reservations/getreservationsdata/',searchOptions, cb);
}

export const getReservationDetail = async (id, cb=(jR, s, e)=>{}) => {
  return await getAPICall('reservations/getreservationdetails/' + id, cb);
}

export const updateReservation = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('reservations/updatereservation', payload, cb);
};

export const updateReservationItem = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('reservations/updatereservationitem', payload, cb);
};

export const deleteReservationItem = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('reservation/removereservationitem', payload, cb);
};

export const createTransaction = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('reservation/createtransaction', payload, cb);
};

export const  getTransactionsData = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('reservation/gettransactionsdata/', payload, cb);
}

export const scanBarcode = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('reservation/scanbarcode/', payload, cb);
}

export const checkedInBarcode = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('reservation/checkedinbarcode/', payload, cb);
}

export const getAvaliableSheet = async (payload, cb = (jR, s, e)=>{}) => {
  return await postAPICall('reservations/getavailablesheet/', payload, cb);
}