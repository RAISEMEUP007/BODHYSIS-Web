import { getAPICall, postAPICall } from './BaseAPI';

export const getHeaderData = (callback) => {
  getAPICall('price/getheaderdata', callback);
}

export const getTableData = (callback) => {
  getAPICall('price/gettabledata', callback);
}

export const setFree = (group, isFree, callback) => {
  const payload = { group, isFree, };
  postAPICall('price/setfree', payload, callback);
}

export const setPriceData = (groupId, pointId, value, callback) => {
  const payload = {
    groupId,
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