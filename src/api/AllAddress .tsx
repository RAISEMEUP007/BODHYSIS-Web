import { basePostAPICall, getAPICall, postAPICall } from './BaseAPI';

export const getAddressesData = async (payload, cb = (jR, s, e)=>{}) => {
  return await postAPICall('alladdresses/getaddressesdata/', payload,  cb);
}


export const searchAddress = async (str:any, storeId:number, cb = (jR, s, e)=>{}) => {
  const encodedStr = encodeURIComponent(str);
  return await getAPICall('address/search/'+encodedStr+'/'+storeId, cb);
}


export const getForecastingData = async (payload, cb = (jR, s, e)=>{}) => {
  return await postAPICall('forecasting/getsummary/', payload, cb);
}

export const getOrderPotentialData = async (payload, cb = (jR, s, e)=>{}) => {
  return await postAPICall('marketing/orderpotential/', payload, cb);
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