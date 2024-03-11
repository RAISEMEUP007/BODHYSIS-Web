import { basePostAPICall, getAPICall, postAPICall } from './BaseAPI';

export const getOrdersData = (callback) => {
  getAPICall('order/getordersdata/', callback);
}