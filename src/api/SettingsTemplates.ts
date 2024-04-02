import { getAPICall, postAPICall, putAPICall } from './BaseAPI';

export const getTemplatesDataByType = (type, cb = (jR, s, e) => {}) => {
  getAPICall('settings/templates/' + type, cb);
};

export const createTemplate = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('settings/templates/', payload, cb);
};

export const editTemplate = (payload, cb=(jR, s, e)=>{}) => {
  putAPICall('settings/templates/', payload, cb);
};