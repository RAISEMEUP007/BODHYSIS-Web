import { basePostAPICall, getAPICall, postAPICall } from './BaseAPI';

export const getManufacturesData = async (cb=(jR, s, e)=>{}) => {
  return await getAPICall('settings/getmanufacturesdata/', cb);
}

export const updateManufacture = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('settings/updatemanufacture', payload, cb);
};

export const createManufacture = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('settings/createmanufacture', payload, cb);
};

export const deleteManufacture = async (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  return await postAPICall('settings/deletemanufacture', payload, cb);
}

export const getTagsData = async (cb=(jR, s, e)=>{}) => {
  return await getAPICall('settings/gettagsdata/', cb);
}

export const updateTag = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('settings/updatetag', payload, cb);
};

export const createTag = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('settings/createtag', payload, cb);
};

export const deleteTag = async (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  return await postAPICall('settings/deletetag', payload, cb);
}

export const getLocationsData = async (cb = (jR, s, e)=>{}) => {
  return await getAPICall('settings/getlocationsdata/', cb);
}

export const updateLocation = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('settings/updatelocation', payload, cb);
};

export const createLocation = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('settings/createlocation', payload, cb);
};

export const deleteLocation = async (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  return await postAPICall('settings/deletelocation', payload, cb);
}

export const getCountriesData = async (cb=(jR, s, e)=>{}) => {
  return await getAPICall('settings/getcountriesdata/', cb);
}

export const updateCountry = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('settings/updatecountry', payload, cb);
};

export const createCountry = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('settings/createcountry', payload, cb);
};

export const deleteCountry = async (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  return await postAPICall('settings/deletecountry', payload, cb);
}

export const getLanguagesData = async (cb=(jR, s, e)=>{}) => {
  return await getAPICall('settings/getlanguagesdata/', cb);
}

export const updateLanguage = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('settings/updatelanguage', payload, cb);
};

export const createLanguage = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('settings/createlanguage', payload, cb);
};

export const deleteLanguage = async (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  return await postAPICall('settings/deletelanguage', payload, cb);
}

export const getDocumentsData = async (cb=(jR, s, e)=>{}) => {
  return await getAPICall('settings/getdocumentsdata', cb);
}

export const createDocument = async (payload, cb=(jR, s, e)=>{}) => {
  return await basePostAPICall('settings/createdocument', {}, payload, cb);
};

export const updateDocument = async (payload, cb=(jR, s, e)=>{}) => {
  return await basePostAPICall('settings/updatedocument', {}, payload, cb);
};

export const deleteDocument = async (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  return await postAPICall('settings/deletedocument', payload, cb);
}

export const getReservationTypesData = async (cb=(jR, s, e)=>{}) => {
  return await getAPICall('settings/getreservationtypesdata', cb);
}

export const createReservationType = async (payload, cb=(jR, s, e)=>{}) => {
  return await basePostAPICall('settings/createreservationtype', {}, payload, cb);
};

export const updateReservationType = async (payload, cb=(jR, s, e)=>{}) => {
  return await basePostAPICall('settings/updatereservationtype', {}, payload, cb);
};

export const deleteReservationType = async (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  return await postAPICall('settings/deletereservationtype', payload, cb);
}

export const getTrucksData = async (cb=(jR, s, e)=>{}) => {
  return await getAPICall('settings/gettrucksdata/', cb);
}

export const updateTruck = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('settings/updatetruck', payload, cb);
};

export const createTruck = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('settings/createtruck', payload, cb);
};

export const deleteTruck = async (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  return await postAPICall('settings/deletetruck', payload, cb);
}

export const getTimezonesData = async (cb=(jR, s, e)=>{}) => {
  return await getAPICall('settings/gettimezonesdata/', cb);
}

export const updateTimezone = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('settings/updatetimezone', payload, cb);
};

export const createTimezone = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('settings/createtimezone', payload, cb);
};

export const deleteTimezone = async (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  return await postAPICall('settings/deletetimezone', payload, cb);
}

export const getCurrenciesData = async (cb=(jR, s, e)=>{}) => {
  return await getAPICall('settings/getcurrenciesdata/', cb);
}

export const updateCurrency = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('settings/updatecurrency', payload, cb);
};

export const createCurrency = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('settings/createcurrency', payload, cb);
};

export const deleteCurrency = async (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  return await postAPICall('settings/deletecurrency', payload, cb);
}

export const getDateformatsData = async (cb=(jR, s, e)=>{}) => {
  return await getAPICall('settings/getdateformatsdata/', cb);
}

export const updateDateformat = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('settings/updatedateformat', payload, cb);
};

export const createDateformat = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('settings/createdateformat', payload, cb);
};

export const deleteDateformat = async (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  return await postAPICall('settings/deletedateformat', payload, cb);
}

export const getTimeformatsData = async (cb=(jR, s, e)=>{}) => {
  return await getAPICall('settings/gettimeformatsdata/', cb);
}

export const updateTimeformat = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('settings/updatetimeformat', payload, cb);
};

export const createTimeformat = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('settings/createtimeformat', payload, cb);
};

export const deleteTimeformat = async (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  return await postAPICall('settings/deletetimeformat', payload, cb);
}

export const getStoreDetail = async (brandId, cb=(jR, s, e)=>{}) => {
  return await getAPICall('settings/getstoredetail/' + brandId, cb);
}

export const updateStoreDetail = async (payload, cb=(jR, s, e)=>{}) => {
  return await basePostAPICall('settings/updatestoredetail', {}, payload, cb);
};

export const getDiscountCodesData = async (cb=(jR, s, e)=>{}) => {
  return await getAPICall('settings/getdiscountcodesdata/', cb);
}

export const updateDiscountCode = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('settings/updatediscountcode', payload, cb);
};

export const createDiscountCode = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('settings/creatediscountcode', payload, cb);
};

export const quickAddDiscountCode = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('settings/quickadddiscountcode', payload, cb);
};

export const deleteDiscountCode = async (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  return await postAPICall('settings/deletediscountcode', payload, cb);
}

export const getExclusionsData = async (DiscountCodeId, cb=(jR, s, e)=>{}) => {
  return await postAPICall('settings/getexclusionsdata/', {discountcode_id: DiscountCodeId}, cb);
}

export const updateExclusion = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('settings/updateexclusion', payload, cb);
};

export const createExclusion = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('settings/createexclusion', payload, cb);
};

export const deleteExclusion = async (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  return await postAPICall('settings/deleteexclusion', payload, cb);
}

export const deleteExclusionByDCId = async (DiscountCodeId, cb=(jR, s, e)=>{}) => {
  const payload = { DiscountCodeId };
  return await postAPICall('settings/deleteexclusionbydcid', payload, cb);
}

export const getTaxcodesData = async (cb=(jR, s, e)=>{}) => {
  return await getAPICall('settings/gettaxcodesdata/', cb);
}

export const updateTaxcode = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('settings/updatetaxcode', payload, cb);
};

export const createTaxcode = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('settings/createtaxcode', payload, cb);
};

export const deleteTaxcode = async (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  return await postAPICall('settings/deletetaxcode', payload, cb);
}

export const getColorcombinationsData = async (cb=(jR, s, e)=>{}) => {
  return await getAPICall('settings/getcolorcombinationsdata/', cb);
}

export const updateColorcombination = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('settings/updatecolorcombination', payload, cb);
};

export const createColorcombination = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('settings/createcolorcombination', payload, cb);
};

export const deleteColorcombination = async (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  return await postAPICall('settings/deletecolorcombination', payload, cb);
}

export const getExtrasData = async (cb=(jR, s, e)=>{}) => {
  return await getAPICall('settings/getextrasdata', cb);
}

export const createExtra = async (payload, cb=(jR, s, e)=>{}) => {
  return await basePostAPICall('settings/createextra', {}, payload, cb);
};

export const updateExtra = async (payload, cb=(jR, s, e)=>{}) => {
  return await basePostAPICall('settings/updateextra', {}, payload, cb);
};

export const deleteExtra = async (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  return await postAPICall('settings/deleteextra', payload, cb);
}

export const getProductCompatibilitiesData = async (cb=(jR, s, e)=>{}) => {
  return await getAPICall('settings/getproductcompatibilitiesdata', cb);
}

export const updateCompatibility = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('settings/updatecompatibility', payload, cb);
}