import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../common/constants/AppConstants';
import { BrandsArrayType } from '../../types/BrandType';
import { PriceLogicType } from '../../types/PriceLogicTypes';

type JSON = Record<string, any> | undefined;

export const baseApiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: async (headers, { getState }) => {
      const accessToken = await AsyncStorage.getItem('access-token');

      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }

      headers.set('accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['reservation'],
  endpoints: (builder) => ({
    requestBrands: builder.query<BrandsArrayType, JSON>({
      query: () => ({
        url: '/price/getbrandsdata',
        method: 'GET',
      }),
    }),
    requestPriceLogicData: builder.query<Array<PriceLogicType>, JSON>({
      query: () => ({
        url: `/price/getpricelogicdata/`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useRequestBrandsQuery,
  useRequestPriceLogicDataQuery,
} = baseApiSlice;
