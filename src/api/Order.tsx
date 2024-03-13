import { basePostAPICall, getAPICall, postAPICall } from './BaseAPI';

export const getOrdersData = (cb=(jR, s, e)=>{}) => {
  getAPICall('order/getordersdata/', cb);
}