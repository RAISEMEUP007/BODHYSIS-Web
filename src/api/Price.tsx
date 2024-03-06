import { getAPICall, postAPICall } from './BaseAPI';

export const getHeaderData = (tableId, callback) => {
  getAPICall('price/getheaderdata/' + tableId, callback);
}

export const getPriceGroupActiveDataByTableId = (tableId, callback) => {
  if(!tableId) tableId = 0;
  getAPICall('price/getpricegroupactivedatabytableid/' + tableId, callback);
}

export const getTableData = (tableId, callback) => {
  if(!tableId) tableId = 0;
  getAPICall('price/gettabledata/' + tableId, callback);
}

export const setFree = (payload, callback) => {
  postAPICall('price/setfree', payload, callback);
}

export const setPriceData = (groupId, tableId, pointId, value, callback) => {
  const payload = {
    groupId,
    tableId,
    pointId,
    value: value ? value : "",
  };
  postAPICall('price/setpricedata', payload, callback);
}

export const setExtraDay = (payload, callback) => {
  postAPICall('price/setextraday', payload, callback);
}

export const getPriceGroupsData = async (callback) => {
  return await getAPICall('price/getpricegroupsdata', callback);
}

export const setActiveGroup = (paylod, callback) => {
  postAPICall('price/setactivegroup', paylod, callback);
}

export const getPriceGroupValue = async (paylod, callback=()=>{}) => {
  return await postAPICall('price/getpricegroupvalue', paylod, callback);
}

export const getPriceDataByGroup = async (paylod, callback=()=>{}) => {
  return await postAPICall('price/getpricedatabygroup', paylod, callback);
}

export const createGroup = (group, callback) => {
  const payload = { group };
  postAPICall('price/creategroup', payload, callback);
}

export const updateGroup = (oldName, newName, callback) => {
  const payload = { oldName, newName, };
  postAPICall('price/updategroup', payload, callback);
}

export const createPricePoint = (duration, durationType, tableId, callback) => {
  const payload = { duration, durationType, tableId };
  postAPICall('price/addpricepoint', payload, callback);
}

export const deleteGroup = (id, callback) => {
  const payload = { id };
  postAPICall('price/deletegroup', payload, callback);
}

export const deletePricePoint = (pointId, callback) => {
  const payload = { pointId };
  postAPICall('price/deletepricepoint', payload, callback);
}

export const getSeasonsData = (callback) => {
  getAPICall('price/getseasonsdata', callback);
}

export const saveSeasonCell = (id, column, value, callback) => {
  const payload = {id, column, value};
  postAPICall('price/saveseasoncell', payload, callback);
}

export const deleteSeason = (id, callback) => {
  const payload = { id };
  postAPICall('price/deleteseason', payload, callback);
}

export const getBrandsData = (callback) => {
  getAPICall('price/getbrandsdata', callback);
}

export const saveBrandCell = (id, column, value, callback) => {
  const payload = {id, column, value};
  postAPICall('price/savebrandcell', payload, callback);
}

export const deleteBrand = (id, callback) => {
  const payload = { id };
  postAPICall('price/deletebrand', payload, callback);
}

export const getPriceTablesData = (callback) => {
  getAPICall('price/getpricetablesdata', callback);
}

export const savePriceTableCell = (id, column, value, callback) => {
  const payload = {id, column, value};
  postAPICall('price/savepricetablecell', payload, callback);
}

export const clonePriceTableCell = (sourceId, tblName, callback) => {
  const payload = {sourceId, tblName};
  postAPICall('price/clonepricetablecell', payload, callback);
}

export const deletePriceTable = (id, callback) => {
  const payload = { id };
  postAPICall('price/deletepricetable', payload, callback);
}

export const getPriceLogicData = (callback) => {
  getAPICall('price/getpricelogicdata', callback);
}

export const createPriceLogic = (payload, callback) => {
  postAPICall('price/createpricelogic', payload, callback);
}

export const deletePriceLogic = (id, callback) => {
  const payload = { id };
  postAPICall('price/deletepricelogic', payload, callback);
}