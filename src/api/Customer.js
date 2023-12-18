import { getAPICall, postAPICall } from './BaseAPI';

export const getCustomersData = (callback) => {
  getAPICall('customer/getcustomersdata/', callback);
}

export const updateCustomer = (payload, callback) => {
  postAPICall('customer/updatecustomer', payload, callback);
};

export const createCustomer = (payload, callback) => {
  postAPICall('customer/createcustomer', payload, callback);
};

export const deleteCustomer = (id, callback) => {
  const payload = { id };
  postAPICall('customer/deletecustomer', payload, callback);
}

export const getDeliveryAddressesData = (callback) => {
  getAPICall('customer/getdeliverydddressesdata/', callback);
}

export const updateDeliveryAddress = (payload, callback) => {
  postAPICall('customer/updatedeliverydddress', payload, callback);
};

export const createDeliveryAddress = (payload, callback) => {
  postAPICall('customer/createdeliverydddress', payload, callback);
};

export const deleteDeliveryAddress = (id, callback) => {
  const payload = { id };
  postAPICall('customer/deletedeliverydddress', payload, callback);
}