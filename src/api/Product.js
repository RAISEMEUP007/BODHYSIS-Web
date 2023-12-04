import { getAPICall, postAPICall, basePostAPICall } from './BaseAPI';

export const getProductCategoriesData = (callback) => {
  getAPICall('product/getproductcategoriesdata', callback);
}

export const createProductCategory = (payload, callback) => {
  basePostAPICall('product/createproductcategory', {}, payload, callback);
};

export const saveProductCategoryCell = (id, column, value, callback) => {
  const payload = {id, column, value};
  postAPICall('product/saveproductcategory', payload, callback);
}

export const deleteProductCategory = (id, callback) => {
  const payload = { id };
  postAPICall('product/deleteproductcategory', payload, callback);
}