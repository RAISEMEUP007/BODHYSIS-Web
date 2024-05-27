import { basePostAPICall, getAPICall, postAPICall } from './BaseAPI';

export const getPaymentsList = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('stripe/listpaymentmethods/', payload, cb);
}

export const refundStripe = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('stripe/refund/', payload, cb);
}

export const getCustomerIdById = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('stripe/getcustomeridbyid/', payload, cb);
}