import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../common/constants/AppConstants';
import { ProductCategoriesArrayType } from '../../types/ProductCategoryType';
import { BrandsArrayType } from '../../types/BrandType';
import { ProductResponseType, ProductRquestType } from '../../types/ProductTypes';
import { CustomersResponseType } from '../../types/CustomerTypes';
import { LocationsResponseType } from '../../types/LocationType';
import { SeasonsArrayType } from '../../types/SeasonTypes';
import { PriceTableArrayType } from '../../types/PriceTableTypes';

type JSON = Record<string, any> | undefined;

export const baseApiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, _) => {
      headers.set('accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['reservation'],
  endpoints: (builder) => ({
    requestReservationTypes: builder.query<JSON, JSON>({
      query: () => ({
        url: '/settings/getreservationtypesdata',
        method: 'GET',
      }),
    }),
    requestSeasons: builder.query<SeasonsArrayType, JSON>({
      query: () => ({
        url: '/price/getseasonsdata',
        method: 'GET',
      }),
    }),
    requestProductCategories: builder.query<ProductCategoriesArrayType, JSON>({
      query: () => ({
        url: '/product/getproductcategoriesdata',
        method: 'GET',
      }),
    }),
    requestPriceTables: builder.query<PriceTableArrayType, JSON>({
      query: () => ({
        url: '/price/getpricetablesdata',
        method: 'GET',
      }),
    }),
    requestBrands: builder.query<BrandsArrayType, JSON>({
      query: () => ({
        url: '/price/getbrandsdata',
        method: 'GET',
      }),
    }),
    requestCustomers: builder.query<CustomersResponseType, JSON>({
      query: () => ({
        url: '/customer/getcustomersdata/',
        method: 'GET',
      }),
    }),
    requestLocations: builder.query<LocationsResponseType, JSON>({
      query: () => ({
        url: '/settings/getlocationsdata/',
        method: 'GET',
      }),
    }),
    requestProducts: builder.mutation<ProductResponseType, ProductRquestType>({
      query: () => ({
        url: '/product/getproductsdata/',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useRequestReservationTypesQuery,
  useRequestProductCategoriesQuery,
  useRequestBrandsQuery,
  useRequestProductsMutation,
  useRequestCustomersQuery,
  useRequestLocationsQuery,
  useRequestSeasonsQuery,
  useRequestPriceTablesQuery,
} = baseApiSlice;
