import { getAPICall, postAPICall, basePostAPICall } from './BaseAPI';

export const getProductCategoriesData = (callback) => {
  getAPICall('product/getproductcategoriesdata', callback);
}

export const createProductCategory = (payload, callback) => {
  basePostAPICall('product/createproductcategory', {}, payload, callback);
};

export const updateProductCategory = (payload, callback) => {
  basePostAPICall('product/updateproductcategory', {}, payload, callback);
};

export const saveProductCategoryCell = (id, column, value, callback) => {
  const payload = {id, column, value};
  postAPICall('product/saveproductcategory', payload, callback);
}

export const deleteProductCategory = (id, callback) => {
  const payload = { id };
  postAPICall('product/deleteproductcategory', payload, callback);
}

export const getProductFamiliesData = (categoryId, callback) => {
  if(!categoryId) categoryId = 0;
  getAPICall('product/getproductfamiliesdata/'+categoryId, callback);
}

export const createProductFamily = (payload, callback) => {
  basePostAPICall('product/createproductfamily', {}, payload, callback);
};

export const updateProductFamily = (payload, callback) => {
  basePostAPICall('product/updateproductfamily', {}, payload, callback);
};

export const deleteProductFamily = (id, callback) => {
  const payload = { id };
  postAPICall('product/deleteproductfamily', payload, callback);
}

export const getProductLinesData = (familyId, callback) => {
  getAPICall('product/getproductlinesdata/'+familyId, callback);
}

export const updateProductLine = (payload, callback) => {
  postAPICall('product/updateproductline', payload, callback);
};

export const createProductLine = (payload, callback) => {
  postAPICall('product/createproductline', payload, callback);
};

export const deleteProductLine = (id, callback) => {
  const payload = { id };
  postAPICall('product/deleteproductline', payload, callback);
}

export const getProductsData = (CFLOpiton, callback) => {
  postAPICall('product/getproductsdata/', CFLOpiton, callback);
}

export const updateProduct = (payload, callback) => {
  postAPICall('product/updateproduct', payload, callback);
};

export const createProduct = (payload, callback) => {
  postAPICall('product/createproduct', payload, callback);
};

export const deleteProduct = (id, callback) => {
  const payload = { id };
  postAPICall('product/deleteproduct', payload, callback);
}

export const QuickAddProduct = (payload, callback) => {
  postAPICall('product/quickaddproduct', payload, callback);
};

export const getQuantitiesByLine = (callback) => {
  getAPICall('product/getquantitiesbyline', callback);
}

export const getQuantitiesByFamily = (callback) => {
  getAPICall('product/getquantitiesbyfamily', callback);
}

export const getQuantitiesByCategory = (callback) => {
  getAPICall('product/getquantitiesbycategory', callback);
}