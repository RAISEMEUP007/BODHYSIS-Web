import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../common/constants/AppConstants';
import { ProductCategoriesArrayType } from '../../types/ProductCategoryType';
import { BrandsArrayType } from '../../types/BrandType';
import { ProductResponseType, ProductRequestType } from '../../types/ProductTypes';
import { CustomersResponseType } from '../../types/CustomerTypes';
import { LocationsResponseType } from '../../types/LocationType';
import { SeasonsArrayType } from '../../types/SeasonTypes';
import {
  PriceTableType,
  PriceTablesDataRequestType,
  PriceTableDataResponseType,
  PriceTableHeaderDataResponseType,
  PriceTableHeaderDataViewModel,
} from '../../types/PriceTableTypes';
import { PriceLogicType } from '../../types/PriceLogicTypes';
import { PriceGroupArrayType } from '../../types/PriceGroupType';
import {
  CreateReservationRequestType,
  ReservationsListResponseType,
} from '../../types/ReservationTypes';

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
    requestPriceTables: builder.query<Array<PriceTableType>, JSON>({
      query: () => ({
        url: '/price/getpricetablesdata',
        method: 'GET',
      }),
    }),
    requestPriceGroups: builder.query<PriceGroupArrayType, JSON>({
      query: () => ({
        url: '/price/getpricegroupsdata',
        method: 'GET',
      }),
    }),
    requestBrands: builder.query<BrandsArrayType, JSON>({
      query: () => ({
        url: '/price/getbrandsdata',
        method: 'GET',
      }),
    }),
    requestProductQuantitiesByLine: builder.query<Record<number, number>, JSON>({
      query: () => ({
        url: '/product/getquantitiesbyline',
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
    requestPriceTableHeaderData: builder.query<
      Array<PriceTableHeaderDataViewModel>,
      PriceTablesDataRequestType
    >({
      query: ({ table_id }) => ({
        url: `/price/getheaderdata/${table_id}`,
        method: 'GET',
      }),
      transformResponse: (
        response: PriceTableHeaderDataResponseType
      ): Array<PriceTableHeaderDataViewModel> => {
        return response.map((item, index) => {
          return {
            ...item,
            index,
          };
        });
      },
    }),
    requestPriceTableData: builder.query<PriceTableDataResponseType, PriceTablesDataRequestType>({
      query: ({ table_id }) => ({
        url: `/price/gettabledata/${table_id}`,
        method: 'GET',
      }),
    }),
    requestPriceLogicData: builder.query<Array<PriceLogicType>, JSON>({
      query: () => ({
        url: `/price/getpricelogicdata/`,
        method: 'GET',
      }),
    }),
    requestProducts: builder.query<ProductResponseType, ProductRequestType>({
      query: ({ category_id, family_id, line_id }) => ({
        url: '/product/getproductsdata/',
        method: 'POST',
        body: { category_id, family_id, line_id },
      }),
    }),
    requestReservationsList: builder.query<ReservationsListResponseType, any>({
      query: () => ({
        url: '/reservations/getreservationslist/',
        method: 'GET',
      }),
    }),
    requestReservationDetails: builder.query<
      ReservationsDetailsResponseType,
      { reservation_id: number }
    >({
      query: ({ reservation_id }) => ({
        url: `/reservations/getreservationDetails/${reservation_id}`,
        method: 'GET',
      }),
    }),
    requestCreateReservation: builder.mutation<JSON, CreateReservationRequestType>({
      query: ({
        products,
        start_time,
        end_time,
        promo_code,
        start_location_id,
        end_location_id,
        customer_id,
        brand_id,
      }) => ({
        url: 'reservations/createreservation/',
        method: 'POST',
        body: {
          products,
          start_date: start_time,
          end_date: end_time,
          promo_code,
          start_location_id,
          end_location_id,
          customer_id,
          brand_id,
        },
      }),
    }),
  }),
});

export const {
  useRequestReservationTypesQuery,
  useRequestProductCategoriesQuery,
  useRequestBrandsQuery,
  useRequestProductsQuery,
  useRequestCustomersQuery,
  useRequestLocationsQuery,
  useRequestSeasonsQuery,
  useRequestPriceTablesQuery,
  useRequestProductQuantitiesByLineQuery,
  useRequestPriceGroupsQuery,
  useRequestPriceLogicDataQuery,
  useRequestPriceTableDataQuery,
  useRequestPriceTableHeaderDataQuery,
  useRequestCreateReservationMutation,
  useRequestReservationsListQuery,
} = baseApiSlice;
