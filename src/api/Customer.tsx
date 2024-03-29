import { getAPICall, postAPICall } from './BaseAPI';

export const getCustomersData = (cb=(jR, s, e)=>{}) => {
  getAPICall('customer/getcustomersdata/', cb);
}

export const updateCustomer = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('customer/updatecustomer', payload, cb);
};

export const createCustomer = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('customer/createcustomer', payload, cb);
};

export const deleteCustomer = (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  postAPICall('customer/deletecustomer', payload, cb);
}

export const getDeliveryAddressesData = (customerId, cb=(jR, s, e)=>{}) => {
  postAPICall('customer/getdeliveryaddressesdata/', {customer_id: customerId}, cb);
}

export const updateDeliveryAddress = (payload, cb=(jR, s, e)=>{}) => {
  console.log(payload);
  postAPICall('customer/updatedeliverydddress', payload, cb);
};

export const createDeliveryAddress = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('customer/createdeliverydddress', payload, cb);
};

export const deleteDeliveryAddress = (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  postAPICall('customer/deletedeliverydddress', payload, cb);
}

export const deleteDeliveryAddressByCId = (customerId, cb=(jR, s, e)=>{}) => {
  const payload = { customerId };
  postAPICall('customer/deletedeliveryaddressbycid', payload, cb);
}