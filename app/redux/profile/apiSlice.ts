import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ProfileInput, ProfileResponse } from './types'


export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://fe-hometask-api.qa.vault.tryvault.com/' }),
  endpoints: (build) => ({
    postProfile: build.mutation<ProfileResponse, ProfileInput>({
      query: (profile) => ({
        url: 'profile-details',
        method: 'POST',
        body: profile,
      }),
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { usePostProfileMutation } = profileApi