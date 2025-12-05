import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { Profile } from '../Profile';
import { useProfile } from '../hooks/useProfile';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

// Mock the useProfile hook - must be mocked before Profile component is imported
const mockValidateCorporationNumberQuery = jest.fn();
const mockPostProfileMutation = jest.fn();

jest.mock('../hooks/useProfile', () => ({
  useProfile: jest.fn(() => ({
    validateCorporationNumberQuery: mockValidateCorporationNumberQuery,
    isLoadingValidation: false,
    postProfileMutation: mockPostProfileMutation,
    isLoadingPostProfile: false,
  })),
}));

// Import after mocks are set up
const mockUseTranslation = useTranslation as jest.MockedFunction<
  typeof useTranslation
>;
const mockUseProfile = useProfile as jest.MockedFunction<typeof useProfile>;

// Mock Alert
jest.spyOn(Alert, 'alert');

// Translation values from en.json
const translations: Record<string, string> = {
  'profile.title': 'Onboarding Form',
  'profile.submitButton': 'Submit →',
  'profile.alerts.success.title': 'Success',
  'profile.alerts.success.message': 'Profile submitted successfully!',
  'profile.alerts.error.title': 'Error',
  'profile.alerts.error.message': 'Failed to submit profile. Please try again.',
  'profileForm.fields.firstName.placeholder': 'Enter first name',
  'profileForm.fields.lastName.placeholder': 'Enter last name',
  'profileForm.fields.phone.placeholder': '+1XXXXXXXXXX',
  'profileForm.fields.corporationNumber.placeholder':
    'Enter 9-digit corporation number',
};

describe('Profile', () => {
  const defaultMockUseProfile = {
    validateCorporationNumberQuery: mockValidateCorporationNumberQuery,
    isLoadingValidation: false,
    postProfileMutation: mockPostProfileMutation,
    isLoadingPostProfile: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset and configure the useProfile mock
    mockUseProfile.mockReturnValue(defaultMockUseProfile);

    // Reset and configure the query/mutation mocks
    mockValidateCorporationNumberQuery.mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({ valid: true, message: '' }),
    });
    mockPostProfileMutation.mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({}),
    });

    // Reset and configure the i18n mock
    mockUseTranslation.mockReturnValue({
      t: ((key: string) => translations[key] || key) as any,
      i18n: {} as any,
      ready: true,
    } as ReturnType<typeof useTranslation>);
  });

  describe('Rendering', () => {
    it('renders the Profile screen with title', () => {
      render(<Profile />);

      expect(screen.getByText(translations['profile.title'])).toBeTruthy();
    });

    it('renders the ProfileForm component', () => {
      render(<Profile />);

      expect(screen.getByTestId('ProfileForm')).toBeTruthy();
    });

    it('renders all form fields', () => {
      render(<Profile />);

      expect(screen.getByTestId('ProfileForm-firstName')).toBeTruthy();
      expect(screen.getByTestId('ProfileForm-lastName')).toBeTruthy();
      expect(screen.getByTestId('ProfileForm-phone')).toBeTruthy();
      expect(screen.getByTestId('ProfileForm-corporationNumber')).toBeTruthy();
    });

    it('renders the Submit button', () => {
      render(<Profile />);

      expect(screen.getByTestId('Button')).toBeTruthy();
    });
  });

  describe('Loading States', () => {
    it('disables submit button when isLoadingPostProfile is true', () => {
      mockUseProfile.mockReturnValue({
        ...defaultMockUseProfile,
        isLoadingPostProfile: true,
      });

      render(<Profile />);

      const submitButton = screen.getByTestId('Button');
      expect(submitButton).toBeDisabled();
    });

    it('disables submit button when isLoadingValidation is true', () => {
      mockUseProfile.mockReturnValue({
        ...defaultMockUseProfile,
        isLoadingValidation: true,
      });

      render(<Profile />);

      const submitButton = screen.getByTestId('Button');
      expect(submitButton).toBeDisabled();
    });

    it('shows loading state on submit button when isLoadingPostProfile is true', () => {
      mockUseProfile.mockReturnValue({
        ...defaultMockUseProfile,
        isLoadingPostProfile: true,
      });

      render(<Profile />);

      const submitButton = screen.getByTestId('Button');
      // Button should be disabled when loading
      expect(submitButton).toBeDisabled();
      // Should show loading indicator
      expect(screen.getByTestId('ActivityIndicator')).toBeTruthy();
    });
  });

  describe('Integration with useProfile Hook', () => {
    it('calls useProfile hook on mount', () => {
      render(<Profile />);

      expect(mockUseProfile).toHaveBeenCalledTimes(1);
    });

    it('uses values from useProfile hook', () => {
      const customMock = {
        validateCorporationNumberQuery: jest.fn(),
        isLoadingValidation: true,
        postProfileMutation: jest.fn(),
        isLoadingPostProfile: true,
      };
      mockUseProfile.mockReturnValue(customMock);

      render(<Profile />);

      expect(mockUseProfile).toHaveBeenCalled();
      const submitButton = screen.getByTestId('Button');
      expect(submitButton).toBeDisabled();
    });
  });
});
