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