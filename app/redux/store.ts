import { configureStore } from '@reduxjs/toolkit';
import { corporateApi } from './corporate/apiSlice';
import { profileApi } from './profile/apiSlice';

export const store = configureStore({
  reducer: {},
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      profileApi.middleware,
      corporateApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
