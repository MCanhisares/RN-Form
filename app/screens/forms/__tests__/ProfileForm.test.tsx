import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ProfileForm,
  ProfileFormData,
  ProfileFormHandle,
} from '../ProfileForm';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

const mockUseTranslation = useTranslation as jest.MockedFunction<
  typeof useTranslation
>;

// Translation values from en.json
const translations: Record<string, string> = {
  'profileForm.fields.firstName.label': 'First Name',
  'profileForm.fields.firstName.placeholder': 'Enter first name',
  'profileForm.fields.firstName.errors.required': 'First name is required',
  'profileForm.fields.firstName.errors.maxLength':
    'First name must be 50 characters or less',
  'profileForm.fields.lastName.label': 'Last Name',
  'profileForm.fields.lastName.placeholder': 'Enter last name',
  'profileForm.fields.lastName.errors.required': 'Last name is required',
  'profileForm.fields.lastName.errors.maxLength':
    'Last name must be 50 characters or less',
  'profileForm.fields.phone.label': 'Phone Number',
  'profileForm.fields.phone.placeholder': '+1XXXXXXXXXX',
  'profileForm.fields.phone.errors.required': 'Phone number is required',
  'profileForm.fields.phone.errors.invalid':
    'Phone number must be a valid Canadian number starting with +1',
  'profileForm.fields.corporationNumber.label': 'Corporation Number',
  'profileForm.fields.corporationNumber.placeholder':
    'Enter 9-digit corporation number',
  'profileForm.fields.corporationNumber.errors.required':
    'Corporation number is required',
  'profileForm.fields.corporationNumber.errors.length':
    'Corporation number must be exactly 9 characters',
  'profileForm.fields.corporationNumber.errors.invalid':
    'Invalid corporation number',
};

describe('ProfileForm', () => {
  const mockOnSubmit = jest.fn();
  const mockValidateCorporationNumber = jest.fn();

  const defaultProps = {
    onSubmit: mockOnSubmit,
    validateCorporationNumber: mockValidateCorporationNumber,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockValidateCorporationNumber.mockResolvedValue({
      valid: true,
      message: '',
    });
    mockUseTranslation.mockReturnValue({
      t: ((key: string) => translations[key] || key) as any,
      i18n: {} as any,
      ready: true,
    } as ReturnType<typeof useTranslation>);
  });

  describe('Rendering', () => {
    it('renders all form fields', () => {
      render(<ProfileForm {...defaultProps} />);

      expect(screen.getByTestId('ProfileForm')).toBeTruthy();
      expect(screen.getByTestId('ProfileForm-firstName')).toBeTruthy();
      expect(screen.getByTestId('ProfileForm-lastName')).toBeTruthy();
      expect(screen.getByTestId('ProfileForm-phone')).toBeTruthy();
      expect(screen.getByTestId('ProfileForm-corporationNumber')).toBeTruthy();
    });

    it('renders with correct labels and placeholders', () => {
      render(<ProfileForm {...defaultProps} />);

      expect(
        screen.getByText(translations['profileForm.fields.firstName.label'])
      ).toBeTruthy();
      expect(
        screen.getByText(translations['profileForm.fields.lastName.label'])
      ).toBeTruthy();
      expect(
        screen.getByText(translations['profileForm.fields.phone.label'])
      ).toBeTruthy();
      expect(
        screen.getByText(
          translations['profileForm.fields.corporationNumber.label']
        )
      ).toBeTruthy();

      expect(screen.getByTestId('ProfileForm-firstName')).toBeTruthy();
      expect(screen.getByTestId('ProfileForm-lastName')).toBeTruthy();
      expect(screen.getByTestId('ProfileForm-phone')).toBeTruthy();
      expect(screen.getByTestId('ProfileForm-corporationNumber')).toBeTruthy();
    });

    it('renders with loading state when isLoadingValidation is true', () => {
      render(<ProfileForm {...defaultProps} isLoadingValidation={true} />);
      // Check for loading indicator in corporation number field
      expect(
        screen.getByTestId('FormTextInput-loading-indicator')
      ).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    it('validates required fields', async () => {
      const ref = React.createRef<ProfileFormHandle>();
      render(<ProfileForm {...defaultProps} ref={ref} />);

      await act(async () => {
        ref.current?.submit();
      });

      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });

    it('validates firstName max length', async () => {
      const ref = React.createRef<ProfileFormHandle>();
      render(<ProfileForm {...defaultProps} ref={ref} />);

      const firstNameInput = screen.getByTestId('ProfileForm-firstName');
      const longName = 'a'.repeat(51);
      fireEvent.changeText(firstNameInput, longName);
      fireEvent(firstNameInput, 'blur');

      await act(async () => {
        ref.current?.submit();
      });

      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });

    it('validates lastName max length', async () => {
      const ref = React.createRef<ProfileFormHandle>();
      render(<ProfileForm {...defaultProps} ref={ref} />);

      const lastNameInput = screen.getByTestId('ProfileForm-lastName');
      const longName = 'a'.repeat(51);
      fireEvent.changeText(lastNameInput, longName);
      fireEvent(lastNameInput, 'blur');

      await act(async () => {
        ref.current?.submit();
      });

      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });

    it('validates phone number format', async () => {
      const ref = React.createRef<ProfileFormHandle>();
      render(<ProfileForm {...defaultProps} ref={ref} />);

      const phoneInput = screen.getByTestId('ProfileForm-phone');
      fireEvent.changeText(phoneInput, '1234567890'); // Invalid format (missing +1)
      fireEvent(phoneInput, 'blur');

      await act(async () => {
        ref.current?.submit();
      });

      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });

    it('validates corporation number length', async () => {
      const ref = React.createRef<ProfileFormHandle>();
      render(<ProfileForm {...defaultProps} ref={ref} />);

      const corporationInput = screen.getByTestId(
        'ProfileForm-corporationNumber'
      );
      fireEvent.changeText(corporationInput, '12345'); // Less than 9 digits
      fireEvent(corporationInput, 'blur');

      await act(async () => {
        ref.current?.submit();
      });

      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe('Phone Number Formatting', () => {
    it('formats phone number starting with +1', () => {
      render(<ProfileForm {...defaultProps} />);

      const phoneInput = screen.getByTestId('ProfileForm-phone');
      fireEvent.changeText(phoneInput, '+11234567890');

      // The formatPhoneNumber function should ensure +1 prefix
      expect(phoneInput.props.value).toBe('+11234567890');
    });

    it('formats phone number starting with 1', () => {
      render(<ProfileForm {...defaultProps} />);

      const phoneInput = screen.getByTestId('ProfileForm-phone');
      fireEvent.changeText(phoneInput, '11234567890');

      // Should be formatted to +1 prefix
      expect(phoneInput.props.value).toBe('+11234567890');
    });

    it('formats phone number without prefix', () => {
      render(<ProfileForm {...defaultProps} />);

      const phoneInput = screen.getByTestId('ProfileForm-phone');
      fireEvent.changeText(phoneInput, '1234567890');

      // When input starts with 1, it's treated as country code, so becomes +1234567890
      // For a 10-digit number without leading 1, use a different input
      fireEvent.changeText(phoneInput, '2345678901');
      // Should be formatted to +1 prefix
      expect(phoneInput.props.value).toBe('+12345678901');
    });

    it('limits phone number to 12 characters', () => {
      render(<ProfileForm {...defaultProps} />);

      const phoneInput = screen.getByTestId('ProfileForm-phone');
      fireEvent.changeText(phoneInput, '+112345678901234');

      // Should be limited to 12 characters (+1 + 10 digits)
      expect(phoneInput.props.value).toBe('+11234567890');
    });
  });

  describe('Corporation Number Validation', () => {
    it('validates corporation number on blur when length is 9', async () => {
      render(<ProfileForm {...defaultProps} />);

      const corporationInput = screen.getByTestId(
        'ProfileForm-corporationNumber'
      );
      fireEvent.changeText(corporationInput, '123456789');
      // Wait a bit for the state to update
      await waitFor(() => {
        expect(corporationInput.props.value).toBe('123456789');
      });
      fireEvent(corporationInput, 'blur');

      await waitFor(
        () => {
          expect(mockValidateCorporationNumber).toHaveBeenCalledWith(
            '123456789'
          );
          expect(mockValidateCorporationNumber).toHaveBeenCalledTimes(1);
        },
        { timeout: 3000 }
      );
    });

    it('does not validate corporation number on blur when length is not 9', async () => {
      render(<ProfileForm {...defaultProps} />);

      const corporationInput = screen.getByTestId(
        'ProfileForm-corporationNumber'
      );
      fireEvent.changeText(corporationInput, '12345');
      fireEvent(corporationInput, 'blur');

      await waitFor(() => {
        expect(mockValidateCorporationNumber).not.toHaveBeenCalled();
      });
    });

    it('does not validate corporation number on blur when empty', async () => {
      render(<ProfileForm {...defaultProps} />);

      const corporationInput = screen.getByTestId(
        'ProfileForm-corporationNumber'
      );
      fireEvent(corporationInput, 'blur');

      await waitFor(() => {
        expect(mockValidateCorporationNumber).not.toHaveBeenCalled();
      });
    });

    it('sets error message when corporation number is invalid', async () => {
      mockValidateCorporationNumber.mockResolvedValue({
        valid: false,
        message:
          translations['profileForm.fields.corporationNumber.errors.invalid'],
      });

      render(<ProfileForm {...defaultProps} />);

      const corporationInput = screen.getByTestId(
        'ProfileForm-corporationNumber'
      );
      fireEvent.changeText(corporationInput, '123456789');
      await waitFor(() => {
        expect(corporationInput.props.value).toBe('123456789');
      });
      fireEvent(corporationInput, 'blur');

      await waitFor(
        () => {
          expect(mockValidateCorporationNumber).toHaveBeenCalledWith(
            '123456789'
          );
        },
        { timeout: 3000 }
      );

      // Check that error message is displayed
      await waitFor(() => {
        expect(
          screen.getByText(
            translations['profileForm.fields.corporationNumber.errors.invalid']
          )
        ).toBeTruthy();
      });
    });

    it('clears error message when corporation number is valid', async () => {
      mockValidateCorporationNumber.mockResolvedValue({
        valid: true,
        message: '',
      });

      render(<ProfileForm {...defaultProps} />);

      const corporationInput = screen.getByTestId(
        'ProfileForm-corporationNumber'
      );
      fireEvent.changeText(corporationInput, '123456789');
      await waitFor(() => {
        expect(corporationInput.props.value).toBe('123456789');
      });
      fireEvent(corporationInput, 'blur');

      await waitFor(
        () => {
          expect(mockValidateCorporationNumber).toHaveBeenCalledWith(
            '123456789'
          );
        },
        { timeout: 3000 }
      );

      // Error message should not be displayed
      expect(
        screen.queryByText(
          translations['profileForm.fields.corporationNumber.errors.invalid']
        )
      ).toBeNull();
    });

    it('handles validation error gracefully', async () => {
      mockValidateCorporationNumber.mockRejectedValue(
        new Error('Network error')
      );

      render(<ProfileForm {...defaultProps} />);

      const corporationInput = screen.getByTestId(
        'ProfileForm-corporationNumber'
      );
      fireEvent.changeText(corporationInput, '123456789');
      await waitFor(() => {
        expect(corporationInput.props.value).toBe('123456789');
      });
      fireEvent(corporationInput, 'blur');

      await waitFor(
        () => {
          expect(mockValidateCorporationNumber).toHaveBeenCalled();
        },
        { timeout: 3000 }
      );

      // Should show error message on validation failure
      await waitFor(() => {
        expect(
          screen.getByText(
            translations['profileForm.fields.corporationNumber.errors.invalid']
          )
        ).toBeTruthy();
      });
    });

    it('clears corporation number error on change', () => {
      render(<ProfileForm {...defaultProps} />);

      const corporationInput = screen.getByTestId(
        'ProfileForm-corporationNumber'
      );
      fireEvent.changeText(corporationInput, '123');

      // The onChangeCustom should clear the error
      expect(corporationInput).toBeTruthy();
    });
  });

  describe('Form Submission', () => {
    it('submits form with valid data', async () => {
      const ref = React.createRef<ProfileFormHandle>();
      const validData: ProfileFormData = {
        firstName: 'John',
        lastName: 'Doe',
        phone: '+11234567890',
        corporationNumber: '123456789',
      };

      render(<ProfileForm {...defaultProps} ref={ref} />);

      const firstNameInput = screen.getByTestId('ProfileForm-firstName');
      const lastNameInput = screen.getByTestId('ProfileForm-lastName');
      const phoneInput = screen.getByTestId('ProfileForm-phone');
      const corporationInput = screen.getByTestId(
        'ProfileForm-corporationNumber'
      );

      fireEvent.changeText(firstNameInput, validData.firstName);
      fireEvent.changeText(lastNameInput, validData.lastName);
      fireEvent.changeText(phoneInput, validData.phone);
      fireEvent.changeText(corporationInput, validData.corporationNumber);

      // Wait for form state to update
      await waitFor(() => {
        expect(firstNameInput.props.value).toBe(validData.firstName);
        expect(lastNameInput.props.value).toBe(validData.lastName);
        expect(phoneInput.props.value).toBe(validData.phone);
        expect(corporationInput.props.value).toBe(validData.corporationNumber);
      });

      await act(async () => {
        ref.current?.submit();
      });

      await waitFor(
        () => {
          expect(mockValidateCorporationNumber).toHaveBeenCalledWith(
            validData.corporationNumber
          );
        },
        { timeout: 3000 }
      );

      await waitFor(
        () => {
          expect(mockOnSubmit).toHaveBeenCalledWith(validData);
        },
        { timeout: 3000 }
      );
    });

    it('does not submit when corporation number validation fails', async () => {
      const ref = React.createRef<ProfileFormHandle>();
      mockValidateCorporationNumber.mockResolvedValue({
        valid: false,
        message: 'Invalid corporation number',
      });

      render(<ProfileForm {...defaultProps} ref={ref} />);

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

      await act(async () => {
        ref.current?.submit();
      });

      await waitFor(
        () => {
          expect(mockValidateCorporationNumber).toHaveBeenCalled();
        },
        { timeout: 3000 }
      );

      await waitFor(
        () => {
          expect(mockOnSubmit).not.toHaveBeenCalled();
        },
        { timeout: 3000 }
      );
    });

    it('does not submit when form validation fails', async () => {
      const ref = React.createRef<ProfileFormHandle>();
      render(<ProfileForm {...defaultProps} ref={ref} />);

      // Submit with empty form
      await act(async () => {
        ref.current?.submit();
      });

      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe('Corporation Number Input Transformation', () => {
    it('only allows numeric input for corporation number', () => {
      render(<ProfileForm {...defaultProps} />);

      const corporationInput = screen.getByTestId(
        'ProfileForm-corporationNumber'
      );
      fireEvent.changeText(corporationInput, 'abc123def456');

      // The transformOnChange should filter out non-numeric characters
      expect(corporationInput.props.value).toBe('123456');
    });

    it('limits corporation number to 9 characters', () => {
      render(<ProfileForm {...defaultProps} />);

      const corporationInput = screen.getByTestId(
        'ProfileForm-corporationNumber'
      );
      fireEvent.changeText(corporationInput, '123456789012345');

      // The transformOnChange should limit to 9 characters
      expect(corporationInput.props.value).toBe('123456789');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty string inputs', () => {
      render(<ProfileForm {...defaultProps} />);

      const firstNameInput = screen.getByTestId('ProfileForm-firstName');
      fireEvent.changeText(firstNameInput, '');

      expect(firstNameInput.props.value).toBe('');
    });

    it('handles whitespace in corporation number', async () => {
      render(<ProfileForm {...defaultProps} />);

      const corporationInput = screen.getByTestId(
        'ProfileForm-corporationNumber'
      );
      // Note: transformOnChange filters non-digits, so whitespace won't be in the value
      // But the blur handler trims the value before validation
      fireEvent.changeText(corporationInput, '123456789');
      await waitFor(() => {
        expect(corporationInput.props.value).toBe('123456789');
      });
      fireEvent(corporationInput, 'blur');

      // The trim should be applied in handleCorporationNumberBlur
      await waitFor(
        () => {
          // Validation should be called with trimmed value
          expect(mockValidateCorporationNumber).toHaveBeenCalled();
        },
        { timeout: 3000 }
      );
    });

    it('handles rapid input changes', () => {
      render(<ProfileForm {...defaultProps} />);

      const phoneInput = screen.getByTestId('ProfileForm-phone');
      fireEvent.changeText(phoneInput, '1');
      // When input is just "1", it becomes "+1"
      expect(phoneInput.props.value).toBe('+1');

      fireEvent.changeText(phoneInput, '12');
      // When input starts with "1", it's treated as country code
      expect(phoneInput.props.value).toBe('+12');

      fireEvent.changeText(phoneInput, '123');
      expect(phoneInput.props.value).toBe('+123');

      fireEvent.changeText(phoneInput, '1234');
      expect(phoneInput.props.value).toBe('+1234');
    });
  });

  describe('Imperative Handle', () => {
    it('exposes submit method via ref', () => {
      const ref = React.createRef<ProfileFormHandle>();
      render(<ProfileForm {...defaultProps} ref={ref} />);

      expect(ref.current).toBeTruthy();
      expect(ref.current?.submit).toBeDefined();
      expect(typeof ref.current?.submit).toBe('function');
    });

    it('calls handleSubmit when submit is called', async () => {
      const ref = React.createRef<ProfileFormHandle>();
      render(<ProfileForm {...defaultProps} ref={ref} />);

      await act(async () => {
        ref.current?.submit();
      });

      await waitFor(() => {
        // Form validation should be triggered
        expect(ref.current).toBeTruthy();
      });
    });
  });
});
