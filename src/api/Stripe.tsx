import { basePostAPICall, getAPICall, postAPICall } from './BaseAPI';

export const getPaymentsList = (payload, callback) => {
  postAPICall('stripe/listpaymentmethods/', payload, callback);
}