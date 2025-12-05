import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CorporateResponse } from './types';

export const corporateApi = createApi({
  reducerPath: 'corporateApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://fe-hometask-api.qa.vault.tryvault.com/',
  }),
  endpoints: (build) => ({
    validateCorporateNumber: build.query<CorporateResponse, string>({
      query: (corporationNumber) => `corporation-number/${corporationNumber}`,
    }),
  }),
});

export const {
  useValidateCorporateNumberQuery,
  useLazyValidateCorporateNumberQuery,
} = corporateApi;
