import { getAPICall, postAPICall } from './BaseAPI';

export const getOrdersData = (callback) => {
  getAPICall('order/getordersdata/', callback);
}

export const updateOrder = (payload, callback) => {
  postAPICall('order/updateorder', payload, callback);
};

export const createOrder = (payload, callback) => {
  postAPICall('order/createorder', payload, callback);
};

export const deleteOrder = (id, callback) => {
  const payload = { id };
  postAPICall('order/deleteorder', payload, callback);
}