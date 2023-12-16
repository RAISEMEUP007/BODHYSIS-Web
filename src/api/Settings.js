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

export const getCountriesData = (callback) => {
  getAPICall('settings/getcountriesdata/', callback);
}

export const updateCountry = (payload, callback) => {
  postAPICall('settings/updatecountry', payload, callback);
};

export const createCountry = (payload, callback) => {
  postAPICall('settings/createcountry', payload, callback);
};

export const deleteCountry = (id, callback) => {
  const payload = { id };
  postAPICall('settings/deletecountry', payload, callback);
}

export const getLanguagesData = (callback) => {
  getAPICall('settings/getlanguagesdata/', callback);
}

export const updateLanguage = (payload, callback) => {
  postAPICall('settings/updatelanguage', payload, callback);
};

export const createLanguage = (payload, callback) => {
  postAPICall('settings/createlanguage', payload, callback);
};

export const deleteLanguage = (id, callback) => {
  const payload = { id };
  postAPICall('settings/deletelanguage', payload, callback);
}