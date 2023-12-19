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

export const getDeliveryAddressesData = (customerId, callback) => {
  console.log(customerId);
  postAPICall('customer/getdeliveryaddressesdata/', {customer_id: customerId}, callback);
}

export const updateDeliveryAddress = (payload, callback) => {
  console.log(payload);
  postAPICall('customer/updatedeliverydddress', payload, callback);
};

export const createDeliveryAddress = (payload, callback) => {
  postAPICall('customer/createdeliverydddress', payload, callback);
};

export const deleteDeliveryAddress = (id, callback) => {
  const payload = { id };
  postAPICall('customer/deletedeliverydddress', payload, callback);
}

export const deleteDeliveryAddressByCId = (customerId, callback) => {
  const payload = { customerId };
  postAPICall('customer/deletedeliveryaddressbycid', payload, callback);
}