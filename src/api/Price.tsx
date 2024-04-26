import { getAPICall, postAPICall } from './BaseAPI';

export const getHeaderData = (tableId, cb=(jR, s, e)=>{}) => {
  getAPICall('price/getheaderdata/' + tableId, cb);
}

export const getPriceGroupActiveDataByTableId = (tableId, cb=(jR, s, e)=>{}) => {
  if(!tableId) tableId = 0;
  getAPICall('price/getpricegroupactivedatabytableid/' + tableId, cb);
}

export const getTableData = (tableId, cb=(jR, s, e)=>{}) => {
  if(!tableId) tableId = 0;
  getAPICall('price/gettabledata/' + tableId, cb);
}

export const setFree = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('price/setfree', payload, cb);
}

export const setPriceData = (groupId, tableId, pointId, value, cb=(jR, s, e)=>{}) => {
  const payload = {
    groupId,
    tableId,
    pointId,
    value: value ? value : "",
  };
  postAPICall('price/setpricedata', payload, cb);
}

export const setExtraDay = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('price/setextraday', payload, cb);
}

export const getPriceGroupsData = async (cb = (jR, s, e)=>{}) => {
  return await getAPICall('price/getpricegroupsdata', cb);
}

export const setActiveGroup = (paylod, cb=(jR, s, e)=>{}) => {
  postAPICall('price/setactivegroup', paylod, cb);
}

export const getPriceGroupValue = async (paylod, cb=()=>{}) => {
  return await postAPICall('price/getpricegroupvalue', paylod, cb);
}

export const getPriceDataByGroup = async (paylod, cb=()=>{}) => {
  return await postAPICall('price/getpricedatabygroup', paylod, cb);
}

export const createGroup = (group, cb=(jR, s, e)=>{}) => {
  const payload = { group };
  postAPICall('price/creategroup', payload, cb);
}

export const updateGroup = (oldName, newName, cb=(jR, s, e)=>{}) => {
  const payload = { oldName, newName, };
  postAPICall('price/updategroup', payload, cb);
}

export const createPricePoint = (duration, durationType, tableId, cb=(jR, s, e)=>{}) => {
  const payload = { duration, durationType, tableId };
  postAPICall('price/addpricepoint', payload, cb);
}

export const deleteGroup = (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  postAPICall('price/deletegroup', payload, cb);
}

export const deletePricePoint = (pointId, cb=(jR, s, e)=>{}) => {
  const payload = { pointId };
  postAPICall('price/deletepricepoint', payload, cb);
}

export const getSeasonsData = (cb=(jR, s, e)=>{}) => {
  getAPICall('price/getseasonsdata', cb);
}

export const saveSeasonCell = (id, column, value, cb=(jR, s, e)=>{}) => {
  const payload = {id, column, value};
  postAPICall('price/saveseasoncell', payload, cb);
}

export const deleteSeason = (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  postAPICall('price/deleteseason', payload, cb);
}

export const getBrandsData = (cb=(jR, s, e)=>{}) => {
  getAPICall('price/getbrandsdata', cb);
}

export const getBrandDetail = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('price/getbranddetail', payload, cb);
}

export const saveBrandCell = (id, column, value, cb=(jR, s, e)=>{}) => {
  const payload = {id, column, value};
  postAPICall('price/savebrandcell', payload, cb);
}

export const deleteBrand = (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  postAPICall('price/deletebrand', payload, cb);
}

export const getPriceTablesData = (cb=(jR, s, e)=>{}) => {
  getAPICall('price/getpricetablesdata', cb);
}

export const savePriceTableCell = (id, column, value, cb=(jR, s, e)=>{}) => {
  const payload = {id, column, value};
  postAPICall('price/savepricetablecell', payload, cb);
}

export const clonePriceTableCell = (sourceId, tblName, cb=(jR, s, e)=>{}) => {
  const payload = {sourceId, tblName};
  postAPICall('price/clonepricetablecell', payload, cb);
}

export const deletePriceTable = (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  postAPICall('price/deletepricetable', payload, cb);
}

export const getPriceLogicData = (cb=(jR, s, e)=>{}) => {
  getAPICall('price/getpricelogicdata', cb);
}

export const createPriceLogic = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('price/createpricelogic', payload, cb);
}

export const deletePriceLogic = (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  postAPICall('price/deletepricelogic', payload, cb);
}