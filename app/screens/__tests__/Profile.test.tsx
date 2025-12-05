import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
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

  describe('Form Submission', () => {
    it('submits form successfully and shows success alert', async () => {
      const mockUnwrap = jest.fn().mockResolvedValue({});
      mockPostProfileMutation.mockReturnValue({
        unwrap: mockUnwrap,
      });

      render(<Profile />);

      // Fill in the form
      const firstNameInput = screen.getByTestId('ProfileForm-firstName');
      const lastNameInput = screen.getByTestId('ProfileForm-lastName');
      const phoneInput = screen.getByTestId('ProfileForm-phone');
      const corporationInput = screen.getByTestId(
        'ProfileForm-corporationNumber'
      );

      fireEvent.changeText(firstNameInput, 'John');
      fireEvent.changeText(lastNameInput, 'Doe');
      fireEvent.changeText(phoneInput, '+11234567890');
      fireEvent.changeText(corporationInput, '123456789');

      // Wait for form state to update
      await waitFor(() => {
        expect(firstNameInput.props.value).toBe('John');
      });

      // Trigger blur on corporation number to validate it
      fireEvent(corporationInput, 'blur');

      // Wait for validation to complete
      await waitFor(
        () => {
          expect(mockValidateCorporationNumberQuery).toHaveBeenCalled();
        },
        { timeout: 3000 }
      );

      // Submit the form
      const submitButton = screen.getByTestId('Button');
      await act(async () => {
        fireEvent.press(submitButton);
      });

      // Wait for the form submission to complete
      await waitFor(
        () => {
          expect(mockUnwrap).toHaveBeenCalled();
        },
        { timeout: 3000 }
      );

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          translations['profile.alerts.success.title'],
          translations['profile.alerts.success.message']
        );
      });
    });

    it('handles API error with custom message', async () => {
      const mockUnwrap = jest.fn().mockRejectedValue({
        data: { message: 'Custom error message' },
        status: 400,
      });
      mockPostProfileMutation.mockReturnValue({
        unwrap: mockUnwrap,
      });

      render(<Profile />);

      // Fill in the form
      const firstNameInput = screen.getByTestId('ProfileForm-firstName');
      const lastNameInput = screen.getByTestId('ProfileForm-lastName');
      const phoneInput = screen.getByTestId('ProfileForm-phone');
      const corporationInput = screen.getByTestId(
        'ProfileForm-corporationNumber'
      );

      fireEvent.changeText(firstNameInput, 'John');
      fireEvent.changeText(lastNameInput, 'Doe');
      fireEvent.changeText(phoneInput, '+11234567890');
      fireEvent.changeText(corporationInput, '123456789');

      await waitFor(() => {
        expect(firstNameInput.props.value).toBe('John');
      });

      fireEvent(corporationInput, 'blur');

      await waitFor(
        () => {
          expect(mockValidateCorporationNumberQuery).toHaveBeenCalled();
        },
        { timeout: 3000 }
      );

      const submitButton = screen.getByTestId('Button');
      await act(async () => {
        fireEvent.press(submitButton);
      });

      await waitFor(
        () => {
          expect(Alert.alert).toHaveBeenCalledWith(
            translations['profile.alerts.error.title'],
            'Custom error message'
          );
        },
        { timeout: 3000 }
      );
    });

    it('handles API error without message', async () => {
      const mockUnwrap = jest.fn().mockRejectedValue({
        status: 500,
      });
      mockPostProfileMutation.mockReturnValue({
        unwrap: mockUnwrap,
      });

      render(<Profile />);

      // Fill in the form
      const firstNameInput = screen.getByTestId('ProfileForm-firstName');
      const lastNameInput = screen.getByTestId('ProfileForm-lastName');
      const phoneInput = screen.getByTestId('ProfileForm-phone');
      const corporationInput = screen.getByTestId(
        'ProfileForm-corporationNumber'
      );

      fireEvent.changeText(firstNameInput, 'John');
      fireEvent.changeText(lastNameInput, 'Doe');
      fireEvent.changeText(phoneInput, '+11234567890');
      fireEvent.changeText(corporationInput, '123456789');

      await waitFor(() => {
        expect(firstNameInput.props.value).toBe('John');
      });

      fireEvent(corporationInput, 'blur');

      await waitFor(
        () => {
          expect(mockValidateCorporationNumberQuery).toHaveBeenCalled();
        },
        { timeout: 3000 }
      );

      const submitButton = screen.getByTestId('Button');
      await act(async () => {
        fireEvent.press(submitButton);
      });

      await waitFor(
        () => {
          expect(Alert.alert).toHaveBeenCalledWith(
            translations['profile.alerts.error.title'],
            translations['profile.alerts.error.message']
          );
        },
        { timeout: 3000 }
      );
    });

    it('handles API error with unexpected format', async () => {
      const mockUnwrap = jest
        .fn()
        .mockRejectedValue(new Error('Network error'));
      mockPostProfileMutation.mockReturnValue({
        unwrap: mockUnwrap,
      });

      render(<Profile />);

      // Fill in the form
      const firstNameInput = screen.getByTestId('ProfileForm-firstName');
      const lastNameInput = screen.getByTestId('ProfileForm-lastName');
      const phoneInput = screen.getByTestId('ProfileForm-phone');
      const corporationInput = screen.getByTestId(
        'ProfileForm-corporationNumber'
      );

      fireEvent.changeText(firstNameInput, 'John');
      fireEvent.changeText(lastNameInput, 'Doe');
      fireEvent.changeText(phoneInput, '+11234567890');
      fireEvent.changeText(corporationInput, '123456789');

      await waitFor(() => {
        expect(firstNameInput.props.value).toBe('John');
      });

      fireEvent(corporationInput, 'blur');

      await waitFor(
        () => {
          expect(mockValidateCorporationNumberQuery).toHaveBeenCalled();
        },
        { timeout: 3000 }
      );

      const submitButton = screen.getByTestId('Button');
      await act(async () => {
        fireEvent.press(submitButton);
      });

      await waitFor(
        () => {
          expect(Alert.alert).toHaveBeenCalledWith(
            translations['profile.alerts.error.title'],
            translations['profile.alerts.error.message']
          );
        },
        { timeout: 3000 }
      );
    });
  });

  describe('Corporation Number Validation', () => {
    it('validates corporation number when form is submitted', async () => {
      const mockUnwrap = jest.fn().mockResolvedValue({
        valid: true,
        message: 'Valid corporation number',
      });
      mockValidateCorporationNumberQuery.mockReturnValue({
        unwrap: mockUnwrap,
      });

      render(<Profile />);

      // Fill in the form
      const firstNameInput = screen.getByTestId('ProfileForm-firstName');
      const lastNameInput = screen.getByTestId('ProfileForm-lastName');
      const phoneInput = screen.getByTestId('ProfileForm-phone');
      const corporationInput = screen.getByTestId(
        'ProfileForm-corporationNumber'
      );

      fireEvent.changeText(firstNameInput, 'John');
      fireEvent.changeText(lastNameInput, 'Doe');
      fireEvent.changeText(phoneInput, '+11234567890');
      fireEvent.changeText(corporationInput, '123456789');

      await waitFor(() => {
        expect(corporationInput.props.value).toBe('123456789');
      });

      const submitButton = screen.getByTestId('Button');
      await act(async () => {
        fireEvent.press(submitButton);
      });

      await waitFor(
        () => {
          expect(mockUnwrap).toHaveBeenCalled();
        },
        { timeout: 3000 }
      );
    });

    it('handles validation with empty message', async () => {
      const mockUnwrap = jest.fn().mockResolvedValue({
        valid: true,
        message: '',
      });
      mockValidateCorporationNumberQuery.mockReturnValue({
        unwrap: mockUnwrap,
      });

      render(<Profile />);

      const firstNameInput = screen.getByTestId('ProfileForm-firstName');
      const lastNameInput = screen.getByTestId('ProfileForm-lastName');
      const phoneInput = screen.getByTestId('ProfileForm-phone');
      const corporationInput = screen.getByTestId(
        'ProfileForm-corporationNumber'
      );

      fireEvent.changeText(firstNameInput, 'John');
      fireEvent.changeText(lastNameInput, 'Doe');
      fireEvent.changeText(phoneInput, '+11234567890');
      fireEvent.changeText(corporationInput, '123456789');

      await waitFor(() => {
        expect(corporationInput.props.value).toBe('123456789');
      });

      const submitButton = screen.getByTestId('Button');
      await act(async () => {
        fireEvent.press(submitButton);
      });

      await waitFor(
        () => {
          expect(mockUnwrap).toHaveBeenCalled();
        },
        { timeout: 3000 }
      );
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

    it('disables submit button when both loading states are true', () => {
      mockUseProfile.mockReturnValue({
        ...defaultMockUseProfile,
        isLoadingPostProfile: true,
        isLoadingValidation: true,
      });

      render(<Profile />);

      const submitButton = screen.getByTestId('Button');
      expect(submitButton).toBeDisabled();
    });

    it('enables submit button when both loading states are false', () => {
      mockUseProfile.mockReturnValue({
        ...defaultMockUseProfile,
        isLoadingPostProfile: false,
        isLoadingValidation: false,
      });

      render(<Profile />);

      const submitButton = screen.getByTestId('Button');
      expect(submitButton).not.toBeDisabled();
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

  describe('Button Interaction', () => {
    it('calls formRef.current.submit when submit button is pressed', async () => {
      const mockUnwrap = jest.fn().mockResolvedValue({});
      mockPostProfileMutation.mockReturnValue({
        unwrap: mockUnwrap,
      });

      render(<Profile />);

      // Fill in the form
      const firstNameInput = screen.getByTestId('ProfileForm-firstName');
      const lastNameInput = screen.getByTestId('ProfileForm-lastName');
      const phoneInput = screen.getByTestId('ProfileForm-phone');
      const corporationInput = screen.getByTestId(
        'ProfileForm-corporationNumber'
      );

      fireEvent.changeText(firstNameInput, 'John');
      fireEvent.changeText(lastNameInput, 'Doe');
      fireEvent.changeText(phoneInput, '+11234567890');
      fireEvent.changeText(corporationInput, '123456789');

      await waitFor(() => {
        expect(firstNameInput.props.value).toBe('John');
      });

      fireEvent(corporationInput, 'blur');

      await waitFor(
        () => {
          expect(mockValidateCorporationNumberQuery).toHaveBeenCalled();
        },
        { timeout: 3000 }
      );

      const submitButton = screen.getByText(
        translations['profile.submitButton']
      );
      await act(async () => {
        fireEvent.press(submitButton);
      });

      // Verify the form was submitted
      await waitFor(
        () => {
          expect(mockUnwrap).toHaveBeenCalled();
        },
        { timeout: 3000 }
      );
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
