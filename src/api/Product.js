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