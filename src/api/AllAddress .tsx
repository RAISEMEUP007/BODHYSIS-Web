import { basePostAPICall, getAPICall, postAPICall } from './BaseAPI';

export const getAddressesData = async (cb = (jR, s, e)=>{}) => {
  return await getAPICall('alladdresses/getaddressesdata/', cb);
}

export const updateAddress = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('alladdresses/updateaddress', payload, cb);
};

export const createAddress = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('alladdresses/createaddress', payload, cb);
};

export const deleteAddress = (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  postAPICall('alladdresses/deleteaddress', payload, cb);
}