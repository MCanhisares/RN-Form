import { ControlledFormTextInput } from '@components/formInputs/ControlledFormTextInput';
import { zodResolver } from '@hookform/resolvers/zod';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { z } from 'zod';

const createProfileSchema = (t: (key: string) => string) =>
  z.object({
    firstName: z
      .string()
      .min(1, t('profileForm.fields.firstName.errors.required'))
      .max(50, t('profileForm.fields.firstName.errors.maxLength')),
    lastName: z
      .string()
      .min(1, t('profileForm.fields.lastName.errors.required'))
      .max(50, t('profileForm.fields.lastName.errors.maxLength')),
    phone: z
      .string()
      .min(1, t('profileForm.fields.phone.errors.required'))
      .regex(/^\+1\d{10}$/, t('profileForm.fields.phone.errors.invalid')),
    corporationNumber: z
      .string()
      .min(1, t('profileForm.fields.corporationNumber.errors.required'))
      .length(9, t('profileForm.fields.corporationNumber.errors.length')),
  });

export type ProfileFormData = {
  firstName: string;
  lastName: string;
  phone: string;
  corporationNumber: string;
};

export type ProfileFormHandle = {
  submit: () => void;
  reset: () => void;
};

export type ProfileFormProps = {
  onSubmit: (data: ProfileFormData) => Promise<void>;
  validateCorporationNumber: (
    corporationNumber: string
  ) => Promise<{ valid: boolean; message: string }>;
  isLoadingValidation?: boolean;
  onValidationChange?: (isValid: boolean) => void;
};

export const ProfileForm = forwardRef<ProfileFormHandle, ProfileFormProps>(
  (
    {
      onSubmit,
      validateCorporationNumber,
      isLoadingValidation = false,
      onValidationChange,
    },
    ref
  ) => {
    const { t } = useTranslation();
    const [corporationNumberError, setCorporationNumberError] =
      useState<string>('');

    const profileSchema = createProfileSchema(t);

    const {
      control,
      handleSubmit,
      formState: { errors, touchedFields, isValid },
      trigger,
      watch,
      reset,
    } = useForm<ProfileFormData>({
      resolver: zodResolver(profileSchema),
      mode: 'onBlur',
      defaultValues: {
        firstName: '',
        lastName: '',
        phone: '',
        corporationNumber: '',
      },
    });

    const corporationNumber = watch('corporationNumber');

    useEffect(() => {
      if (onValidationChange) {
        const isFormValid = isValid && !corporationNumberError;
        onValidationChange(isFormValid);
      }
    }, [isValid, corporationNumberError, onValidationChange]);

    const handleCorporationNumberBlur = async () => {
      const value = corporationNumber?.trim();
      if (!value) {
        setCorporationNumberError('');
        return;
      }

      if (value.length !== 9) {
        setCorporationNumberError('');
        return;
      }

      try {
        const result = await validateCorporationNumber(value);
        if (!result.valid) {
          setCorporationNumberError(
            result.message ||
              t('profileForm.fields.corporationNumber.errors.invalid')
          );
        } else {
          setCorporationNumberError('');
        }
      } catch {
        setCorporationNumberError(
          t('profileForm.fields.corporationNumber.errors.invalid')
        );
      }
    };

    const formatPhoneNumber = (text: string): string => {
      // Remove all non-digit characters except +
      let cleaned = text.replace(/[^\d+]/g, '');

      // Ensure it starts with +1
      if (!cleaned.startsWith('+')) {
        if (cleaned.startsWith('1')) {
          cleaned = '+' + cleaned;
        } else {
          cleaned = '+1' + cleaned;
        }
      } else if (!cleaned.startsWith('+1')) {
        if (cleaned === '+') {
          return '+1';
        }
        cleaned = '+1' + cleaned.substring(1);
      }

      // Limit to +1 + 10 digits
      if (cleaned.length > 12) {
        cleaned = cleaned.substring(0, 12);
      }

      return cleaned;
    };

    const handleFormSubmit = async (data: ProfileFormData) => {
      const areFieldsValid = await trigger();
      if (!areFieldsValid) {
        return;
      }

      // Validate corporation number one more time before submission
      if (data.corporationNumber.length === 9) {
        try {
          const result = await validateCorporationNumber(
            data.corporationNumber
          );

          if (!result.valid) {
            setCorporationNumberError(
              result.message ||
                t('profileForm.fields.corporationNumber.errors.invalid')
            );
            return;
          }
        } catch {
          setCorporationNumberError(
            t('profileForm.fields.corporationNumber.errors.invalid')
          );
          return;
        }
      }

      await onSubmit(data);
    };

    useImperativeHandle(ref, () => ({
      submit: () => {
        handleSubmit(handleFormSubmit)();
      },
      reset: () => {
        reset({
          firstName: '',
          lastName: '',
          phone: '',
          corporationNumber: '',
        });
        setCorporationNumberError('');
      },
    }));

    return (
      <View style={styles.form} testID="ProfileForm">
        <ControlledFormTextInput
          control={control}
          name="firstName"
          label={t('profileForm.fields.firstName.label')}
          placeholder={t('profileForm.fields.firstName.placeholder')}
          maxLength={50}
          trigger={trigger}
          errors={errors}
          touchedFields={touchedFields}
          testID="ProfileForm-firstName"
        />

        <ControlledFormTextInput
          control={control}
          name="lastName"
          label={t('profileForm.fields.lastName.label')}
          placeholder={t('profileForm.fields.lastName.placeholder')}
          maxLength={50}
          trigger={trigger}
          errors={errors}
          touchedFields={touchedFields}
          testID="ProfileForm-lastName"
        />

        <ControlledFormTextInput
          control={control}
          name="phone"
          label={t('profileForm.fields.phone.label')}
          placeholder={t('profileForm.fields.phone.placeholder')}
          keyboardType="phone-pad"
          maxLength={12}
          transformOnChange={formatPhoneNumber}
          trigger={trigger}
          errors={errors}
          touchedFields={touchedFields}
          testID="ProfileForm-phone"
        />

        <ControlledFormTextInput
          control={control}
          name="corporationNumber"
          label={t('profileForm.fields.corporationNumber.label')}
          placeholder={t('profileForm.fields.corporationNumber.placeholder')}
          keyboardType="number-pad"
          maxLength={9}
          transformOnChange={(text) => {
            const cleaned = text.replace(/[^\d]/g, '');
            return cleaned.length <= 9 ? cleaned : cleaned.substring(0, 9);
          }}
          onChangeCustom={() => {
            setCorporationNumberError('');
          }}
          onBlurCustom={handleCorporationNumberBlur}
          trigger={trigger}
          errors={errors}
          touchedFields={touchedFields}
          customError={
            (touchedFields.corporationNumber && errors.corporationNumber
              ? errors.corporationNumber.message
              : undefined) || corporationNumberError
          }
          loading={isLoadingValidation}
          testID="ProfileForm-corporationNumber"
        />
      </View>
    );
  }
);

ProfileForm.displayName = 'ProfileForm';

const styles = StyleSheet.create({
  form: {
    gap: 24,
  },
});
