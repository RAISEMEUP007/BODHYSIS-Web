import { getAPICall, postAPICall } from './BaseAPI';

export const getHeaderData = (callback) => {
  getAPICall('price/getheaderdata', callback);
}

export const getTableData = (seasonId, callback) => {
  getAPICall('price/gettabledata/' + seasonId, callback);
}

export const getSeasonsData = (callback) => {
  getAPICall('price/getseasonsdata', callback);
}

export const setFree = (group, isFree, callback) => {
  const payload = { group, isFree, };
  postAPICall('price/setfree', payload, callback);
}

export const setPriceData = (groupId, seasonId, pointId, value, callback) => {
  const payload = {
    groupId,
    seasonId,
    pointId,
    value: value ? value : "",
  };
  postAPICall('price/setpricedata', payload, callback);
}

export const setExtraDay = (group, extraDay, callback) => {
  const payload = { group, extraDay, };
  postAPICall('price/setextraday', payload, callback);
}

export const createGroup = (group, callback) => {
  const payload = { group };
  postAPICall('price/creategroup', payload, callback);
}

export const updateGroup = (oldName, newName, callback) => {
  const payload = { oldName, newName };
  postAPICall('price/updategroup', payload, callback);
}

export const createPricePoint = (duration, durationType, callback) => {
  const payload = { duration, durationType };
  postAPICall('price/addpricepoint', payload, callback);
}

export const deleteGroup = (group, callback) => {
  const payload = { group };
  postAPICall('price/deletegroup', payload, callback);
}

export const deletePricePoint = (pointId, callback) => {
  const payload = { pointId };
  postAPICall('price/deletepricepoint', payload, callback);
}