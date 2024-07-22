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

export const updateAddress = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('alladdresses/updateaddress', payload, cb);
};

export const createAddress = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('alladdresses/createaddress', payload, cb);
};

export const deleteAddress = (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  postAPICall('alladdresses/deleteaddress', payload, cb);
}

export const getStreets = async (cb = (jR, s, e)=>{}) => {
  return await getAPICall('alladdresses/getstreets/', cb);
}

export const getPlantations = async (cb = (jR, s, e)=>{}) => {
  return await getAPICall('alladdresses/getplantations/', cb);
}
export const getPropertyNames = async (cb = (jR, s, e)=>{}) => {
  return await getAPICall('alladdresses/getpropertynames/', cb);
}

export const getPlantationsData = async (cb = (jR, s, e)=>{}) => {
  return await getAPICall('alladdresses/getplantationsdata/',  cb);
}

export const createPlantation = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('alladdresses/createplantation', payload, cb);
};

export const updatePlantation = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('alladdresses/updateplantation', payload, cb);
};

export const deletePlantation = (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  postAPICall('alladdresses/deleteplantation', payload, cb);
}

export const getStreetsData = async (cb = (jR, s, e)=>{}) => {
  return await getAPICall('alladdresses/getstreetsdata/',  cb);
}

export const createStreet = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('alladdresses/createstreet', payload, cb);
};

export const updateStreet = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('alladdresses/updatestreet', payload, cb);
};

export const deleteStreet = (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  postAPICall('alladdresses/deletestreet', payload, cb);
}