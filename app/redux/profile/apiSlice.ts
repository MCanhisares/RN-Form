import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ProfileInput, ProfileResponse } from './types';

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://fe-hometask-api.qa.vault.tryvault.com/',
    validateStatus: (response) => response.status === 200,
  }),
  endpoints: (build) => ({
    postProfile: build.mutation<ProfileResponse, ProfileInput>({
      query: (profile) => ({
        url: 'profile-details',
        method: 'POST',
        body: profile,
        responseHandler: async (response) => {
          // For 200 status, don't parse as JSON - just return empty object
          if (response.status === 200) {
            return {};
          }
          // For non-200, try to parse JSON error message
          const text = await response.text();
          try {
            return JSON.parse(text);
          } catch {
            return { message: 'Failed to submit profile. Please try again.' };
          }
        },
      }),
      transformResponse: (): ProfileResponse => {
        return {} as ProfileResponse;
      },
      transformErrorResponse: (response) => {
        if (
          response &&
          response.data &&
          typeof response.data === 'object' &&
          'message' in response.data
        ) {
          return response.data;
        }
        return { message: 'Failed to submit profile. Please try again.' };
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { usePostProfileMutation } = profileApi;
