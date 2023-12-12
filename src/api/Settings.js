import { getAPICall, postAPICall } from './BaseAPI';

export const getManufacturesData = (callback) => {
  getAPICall('settings/getmanufacturesdata/', callback);
}

export const updateManufacture = (payload, callback) => {
  console.log(payload);
  postAPICall('settings/updatemanufacture', payload, callback);
};

export const createManufacture = (payload, callback) => {
  postAPICall('settings/createmanufacture', payload, callback);
};

export const deleteManufacture = (id, callback) => {
  const payload = { id };
  postAPICall('settings/deletemanufacture', payload, callback);
}

export const getTagsData = (callback) => {
  getAPICall('settings/gettagsdata/', callback);
}

export const updateTag = (payload, callback) => {
  console.log(payload);
  postAPICall('settings/updatetag', payload, callback);
};

export const createTag = (payload, callback) => {
  postAPICall('settings/createtag', payload, callback);
};

export const deleteTag = (id, callback) => {
  const payload = { id };
  postAPICall('settings/deletetag', payload, callback);
}

export const getLocationsData = (callback) => {
  getAPICall('settings/getlocationsdata/', callback);
}

export const updateLocation = (payload, callback) => {
  postAPICall('settings/updatelocation', payload, callback);
};

export const createLocation = (payload, callback) => {
  postAPICall('settings/createlocation', payload, callback);
};

export const deleteLocation = (id, callback) => {
  const payload = { id };
  postAPICall('settings/deletelocation', payload, callback);
}