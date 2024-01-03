import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../common/constants/AppConstants';

//interface State {}

type JSON = Record<string, any>;

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
  }),
});

export const { useRequestReservationTypesQuery } = baseApiSlice;
