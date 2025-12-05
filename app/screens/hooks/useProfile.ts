import { useLazyValidateCorporateNumberQuery } from '@redux/corporate/apiSlice';
import { usePostProfileMutation } from '@redux/profile/apiSlice';

export const useProfile = () => {
  const [validateCorporationNumberQuery, { isLoading: isLoadingValidation }] =
    useLazyValidateCorporateNumberQuery();
  const [postProfileMutation, { isLoading: isLoadingPostProfile }] =
    usePostProfileMutation();

  return {
    validateCorporationNumberQuery,
    isLoadingValidation,
    postProfileMutation,
    isLoadingPostProfile,
  };
};
