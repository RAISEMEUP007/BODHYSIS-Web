import { basePostAPICall, getAPICall, postAPICall } from './BaseAPI';

export const getManufacturesData = (cb=(jR, s, e)=>{}) => {
  getAPICall('settings/getmanufacturesdata/', cb);
}

export const updateManufacture = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('settings/updatemanufacture', payload, cb);
};

export const createManufacture = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('settings/createmanufacture', payload, cb);
};

export const deleteManufacture = (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  postAPICall('settings/deletemanufacture', payload, cb);
}

export const getTagsData = (cb=(jR, s, e)=>{}) => {
  getAPICall('settings/gettagsdata/', cb);
}

export const updateTag = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('settings/updatetag', payload, cb);
};

export const createTag = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('settings/createtag', payload, cb);
};

export const deleteTag = (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  postAPICall('settings/deletetag', payload, cb);
}

export const getLocationsData = async (cb = (jR, s, e)=>{}) => {
  return await getAPICall('settings/getlocationsdata/', cb);
}

export const updateLocation = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('settings/updatelocation', payload, cb);
};

export const createLocation = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('settings/createlocation', payload, cb);
};

export const deleteLocation = (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  postAPICall('settings/deletelocation', payload, cb);
}

export const getCountriesData = (cb=(jR, s, e)=>{}) => {
  getAPICall('settings/getcountriesdata/', cb);
}

export const updateCountry = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('settings/updatecountry', payload, cb);
};

export const createCountry = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('settings/createcountry', payload, cb);
};

export const deleteCountry = (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  postAPICall('settings/deletecountry', payload, cb);
}

export const getLanguagesData = (cb=(jR, s, e)=>{}) => {
  getAPICall('settings/getlanguagesdata/', cb);
}

export const updateLanguage = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('settings/updatelanguage', payload, cb);
};

export const createLanguage = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('settings/createlanguage', payload, cb);
};

export const deleteLanguage = (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  postAPICall('settings/deletelanguage', payload, cb);
}

export const getDocumentsData = (cb=(jR, s, e)=>{}) => {
  getAPICall('settings/getdocumentsdata', cb);
}

export const createDocument = (payload, cb=(jR, s, e)=>{}) => {
  basePostAPICall('settings/createdocument', {}, payload, cb);
};

export const updateDocument = (payload, cb=(jR, s, e)=>{}) => {
  basePostAPICall('settings/updatedocument', {}, payload, cb);
};

export const deleteDocument = (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  postAPICall('settings/deletedocument', payload, cb);
}

export const getReservationTypesData = (cb=(jR, s, e)=>{}) => {
  getAPICall('settings/getreservationtypesdata', cb);
}

export const createReservationType = (payload, cb=(jR, s, e)=>{}) => {
  basePostAPICall('settings/createreservationtype', {}, payload, cb);
};

export const updateReservationType = (payload, cb=(jR, s, e)=>{}) => {
  basePostAPICall('settings/updatereservationtype', {}, payload, cb);
};

export const deleteReservationType = (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  postAPICall('settings/deletereservationtype', payload, cb);
}

export const getTrucksData = (cb=(jR, s, e)=>{}) => {
  getAPICall('settings/gettrucksdata/', cb);
}

export const updateTruck = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('settings/updatetruck', payload, cb);
};

export const createTruck = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('settings/createtruck', payload, cb);
};

export const deleteTruck = (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  postAPICall('settings/deletetruck', payload, cb);
}

export const getTimezonesData = (cb=(jR, s, e)=>{}) => {
  getAPICall('settings/gettimezonesdata/', cb);
}

export const updateTimezone = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('settings/updatetimezone', payload, cb);
};

export const createTimezone = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('settings/createtimezone', payload, cb);
};

export const deleteTimezone = (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  postAPICall('settings/deletetimezone', payload, cb);
}

export const getCurrenciesData = (cb=(jR, s, e)=>{}) => {
  getAPICall('settings/getcurrenciesdata/', cb);
}

export const updateCurrency = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('settings/updatecurrency', payload, cb);
};

export const createCurrency = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('settings/createcurrency', payload, cb);
};

export const deleteCurrency = (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  postAPICall('settings/deletecurrency', payload, cb);
}

export const getDateformatsData = (cb=(jR, s, e)=>{}) => {
  getAPICall('settings/getdateformatsdata/', cb);
}

export const updateDateformat = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('settings/updatedateformat', payload, cb);
};

export const createDateformat = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('settings/createdateformat', payload, cb);
};

export const deleteDateformat = (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  postAPICall('settings/deletedateformat', payload, cb);
}

export const getTimeformatsData = (cb=(jR, s, e)=>{}) => {
  getAPICall('settings/gettimeformatsdata/', cb);
}

export const updateTimeformat = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('settings/updatetimeformat', payload, cb);
};

export const createTimeformat = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('settings/createtimeformat', payload, cb);
};

export const deleteTimeformat = (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  postAPICall('settings/deletetimeformat', payload, cb);
}

export const getStoreDetail = async (brandId, cb=(jR, s, e)=>{}) => {
  return await getAPICall('settings/getstoredetail/' + brandId, cb);
}

export const updateStoreDetail = (payload, cb=(jR, s, e)=>{}) => {
  basePostAPICall('settings/updatestoredetail', {}, payload, cb);
};

export const getDiscountCodesData = (cb=(jR, s, e)=>{}) => {
  getAPICall('settings/getdiscountcodesdata/', cb);
}

export const updateDiscountCode = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('settings/updatediscountcode', payload, cb);
};

export const createDiscountCode = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('settings/creatediscountcode', payload, cb);
};

export const quickAddDiscountCode = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('settings/quickadddiscountcode', payload, cb);
};

export const deleteDiscountCode = (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  postAPICall('settings/deletediscountcode', payload, cb);
}

export const getExclusionsData = (DiscountCodeId, cb=(jR, s, e)=>{}) => {
  postAPICall('settings/getexclusionsdata/', {discountcode_id: DiscountCodeId}, cb);
}

export const updateExclusion = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('settings/updateexclusion', payload, cb);
};

export const createExclusion = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('settings/createexclusion', payload, cb);
};

export const deleteExclusion = (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  postAPICall('settings/deleteexclusion', payload, cb);
}

export const deleteExclusionByDCId = (DiscountCodeId, cb=(jR, s, e)=>{}) => {
  const payload = { DiscountCodeId };
  postAPICall('settings/deleteexclusionbydcid', payload, cb);
}

export const getTaxcodesData = (cb=(jR, s, e)=>{}) => {
  getAPICall('settings/gettaxcodesdata/', cb);
}

export const updateTaxcode = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('settings/updatetaxcode', payload, cb);
};

export const createTaxcode = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('settings/createtaxcode', payload, cb);
};

export const deleteTaxcode = (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  postAPICall('settings/deletetaxcode', payload, cb);
}

export const getColorcombinationsData = async (cb=(jR, s, e)=>{}) => {
  return await getAPICall('settings/getcolorcombinationsdata/', cb);
}

export const updateColorcombination = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('settings/updatecolorcombination', payload, cb);
};

export const createColorcombination = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('settings/createcolorcombination', payload, cb);
};

export const deleteColorcombination = (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  postAPICall('settings/deletecolorcombination', payload, cb);
}

export const getExtrasData = (cb=(jR, s, e)=>{}) => {
  getAPICall('settings/getextrasdata', cb);
}

export const createExtra = (payload, cb=(jR, s, e)=>{}) => {
  basePostAPICall('settings/createextra', {}, payload, cb);
};

export const updateExtra = (payload, cb=(jR, s, e)=>{}) => {
  basePostAPICall('settings/updateextra', {}, payload, cb);
};

export const deleteExtra = (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  postAPICall('settings/deleteextra', payload, cb);
}