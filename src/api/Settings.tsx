import { basePostAPICall, getAPICall, postAPICall } from './BaseAPI';

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

export const getDocumentsData = (callback) => {
  getAPICall('settings/getdocumentsdata', callback);
}

export const createDocument = (payload, callback) => {
  basePostAPICall('settings/createdocument', {}, payload, callback);
};

export const updateDocument = (payload, callback) => {
  basePostAPICall('settings/updatedocument', {}, payload, callback);
};

export const deleteDocument = (id, callback) => {
  const payload = { id };
  postAPICall('settings/deletedocument', payload, callback);
}

export const getReservationTypesData = (callback) => {
  getAPICall('settings/getreservationtypesdata', callback);
}

export const createReservationType = (payload, callback) => {
  basePostAPICall('settings/createreservationtype', {}, payload, callback);
};

export const updateReservationType = (payload, callback) => {
  basePostAPICall('settings/updatereservationtype', {}, payload, callback);
};

export const deleteReservationType = (id, callback) => {
  const payload = { id };
  postAPICall('settings/deletereservationtype', payload, callback);
}

export const getTrucksData = (callback) => {
  getAPICall('settings/gettrucksdata/', callback);
}

export const updateTruck = (payload, callback) => {
  console.log(payload);
  postAPICall('settings/updatetruck', payload, callback);
};

export const createTruck = (payload, callback) => {
  postAPICall('settings/createtruck', payload, callback);
};

export const deleteTruck = (id, callback) => {
  const payload = { id };
  postAPICall('settings/deletetruck', payload, callback);
}

export const getTimezonesData = (callback) => {
  getAPICall('settings/gettimezonesdata/', callback);
}

export const updateTimezone = (payload, callback) => {
  postAPICall('settings/updatetimezone', payload, callback);
};

export const createTimezone = (payload, callback) => {
  postAPICall('settings/createtimezone', payload, callback);
};

export const deleteTimezone = (id, callback) => {
  const payload = { id };
  postAPICall('settings/deletetimezone', payload, callback);
}

export const getCurrenciesData = (callback) => {
  getAPICall('settings/getcurrenciesdata/', callback);
}

export const updateCurrency = (payload, callback) => {
  postAPICall('settings/updatecurrency', payload, callback);
};

export const createCurrency = (payload, callback) => {
  postAPICall('settings/createcurrency', payload, callback);
};

export const deleteCurrency = (id, callback) => {
  const payload = { id };
  postAPICall('settings/deletecurrency', payload, callback);
}

export const getDateformatsData = (callback) => {
  getAPICall('settings/getdateformatsdata/', callback);
}

export const updateDateformat = (payload, callback) => {
  postAPICall('settings/updatedateformat', payload, callback);
};

export const createDateformat = (payload, callback) => {
  postAPICall('settings/createdateformat', payload, callback);
};

export const deleteDateformat = (id, callback) => {
  const payload = { id };
  postAPICall('settings/deletedateformat', payload, callback);
}

export const getTimeformatsData = (callback) => {
  getAPICall('settings/gettimeformatsdata/', callback);
}

export const updateTimeformat = (payload, callback) => {
  postAPICall('settings/updatetimeformat', payload, callback);
};

export const createTimeformat = (payload, callback) => {
  postAPICall('settings/createtimeformat', payload, callback);
};

export const deleteTimeformat = (id, callback) => {
  const payload = { id };
  postAPICall('settings/deletetimeformat', payload, callback);
}

export const getStoreDetail = (callback) => {
  getAPICall('settings/getstoredetail/', callback);
}

export const updateStoreDetail = (payload, callback) => {
  basePostAPICall('settings/updatestoredetail', {}, payload, callback);
};