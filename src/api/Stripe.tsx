import { basePostAPICall, getAPICall, postAPICall } from './BaseAPI';

export const getPaymentsList = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('stripe/listpaymentmethods/', payload, cb);
}