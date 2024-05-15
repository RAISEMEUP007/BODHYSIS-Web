import { getAPICall, postAPICall, basePostAPICall } from './BaseAPI';

export const getProductCategoriesData = async (cb=(jR, s, e)=>{}) => {
  return await getAPICall('product/getproductcategoriesdata', cb);
}

export const createProductCategory = (payload, cb=(jR, s, e)=>{}) => {
  basePostAPICall('product/createproductcategory', {}, payload, cb);
};

export const updateProductCategory = (payload, cb=(jR, s, e)=>{}) => {
  basePostAPICall('product/updateproductcategory', {}, payload, cb);
};

export const saveProductCategoryCell = (id, column, value, cb=(jR, s, e)=>{}) => {
  const payload = {id, column, value};
  postAPICall('product/saveproductcategory', payload, cb);
}

export const deleteProductCategory = (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  postAPICall('product/deleteproductcategory', payload, cb);
}

export const getProductFamiliesData = async (categoryId, cb=(jR, s, e)=>{}) => {
  if(!categoryId) categoryId = 0;
  return await getAPICall('product/getproductfamiliesdata/'+categoryId, cb);
}

export const getProductFamiliesDataByDisplayName = async (categoryId, cb=(jR, s, e)=>{}) => {
  if(!categoryId) categoryId = 0;
  return await getAPICall('product/getproductfamiliesdatabydiplayname/'+categoryId, cb);
}

export const createProductFamily = (payload, cb=(jR, s, e)=>{}) => {
  basePostAPICall('product/createproductfamily', {}, payload, cb);
};

export const updateProductFamily = (payload, cb=(jR, s, e)=>{}) => {
  basePostAPICall('product/updateproductfamily', {}, payload, cb);
};

export const deleteProductFamily = (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  postAPICall('product/deleteproductfamily', payload, cb);
}

export const getProductLinesData = async (familyId, cb=(jR, s, e)=>{}) => {
  return await getAPICall('product/getproductlinesdata/'+familyId, cb);
}

export const updateProductLine = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('product/updateproductline', payload, cb);
};

export const createProductLine = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('product/createproductline', payload, cb);
};

export const deleteProductLine = (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  postAPICall('product/deleteproductline', payload, cb);
}

export const getProductsData = (CFLOpiton, cb=(jR, s, e)=>{}) => {
  postAPICall('product/getproductsdata/', CFLOpiton, cb);
}

export const updateProduct = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('product/updateproduct', payload, cb);
};

export const createProduct = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('product/createproduct', payload, cb);
};

export const deleteProduct = (id, cb=(jR, s, e)=>{}) => {
  const payload = { id };
  postAPICall('product/deleteproduct', payload, cb);
}

export const QuickAddProduct = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('product/quickaddproduct', payload, cb);
};

export const getQuantitiesByLine = (cb=(jR, s, e)=>{}) => {
  getAPICall('product/getquantitiesbyline', cb);
}

export const getQuantitiesByFamily = (cb=(jR, s, e)=>{}) => {
  getAPICall('product/getquantitiesbyfamily', cb);
}

export const getQuantitiesByCategory = (cb=(jR, s, e)=>{}) => {
  getAPICall('product/getquantitiesbycategory', cb);
}

export const updateBulkLocation = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('product/updatebulklocation', payload, cb);
};

export const updateBulkStatus = (payload, cb=(jR, s, e)=>{}) => {
  postAPICall('product/updatebulkstatus', payload, cb);
};

export const getDisplayGroupOrder = async (cb=(jR, s, e)=>{}) => {
  return await getAPICall('product/getdisplaygrouporder', cb);
}

export const updateOrderIndex = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('product/updateorderindex', payload, cb);
}

export const getProductDetailByBarcode = async (payload, cb=(jR, s, e)=>{}) => {
  return await postAPICall('product/getproductdetailbybarcode/', payload, cb);
}