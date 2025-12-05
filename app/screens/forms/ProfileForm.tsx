import { ControlledFormTextInput } from '@components/formInputs/ControlledFormTextInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLazyValidateCorporateNumberQuery } from '@redux/corporate/apiSlice';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { z } from 'zod';

const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be 50 characters or less'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be 50 characters or less'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(
      /^\+1\d{10}$/,
      'Phone number must be a valid Canadian number starting with +1'
    ),
  corporationNumber: z
    .string()
    .min(1, 'Corporation number is required')
    .length(9, 'Corporation number must be exactly 9 characters'),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export type ProfileFormHandle = {
  submit: () => void;
};

type ProfileFormProps = {
  onSubmit: (data: ProfileFormData) => Promise<void>;
  isValidatingCorp?: boolean;
};

export const ProfileForm = forwardRef<ProfileFormHandle, ProfileFormProps>(
  ({ onSubmit, isValidatingCorp = false }, ref) => {
    const [validateCorporationNumber] = useLazyValidateCorporateNumberQuery();
    const [corporationNumberError, setCorporationNumberError] =
      useState<string>('');

    const {
      control,
      handleSubmit,
      formState: { errors, touchedFields },
      trigger,
      watch,
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

    // Validate corporation number on blur
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
        const result = await validateCorporationNumber(value).unwrap();
        if (!result.valid) {
          setCorporationNumberError(
            result.message || 'Invalid corporation number'
          );
        } else {
          setCorporationNumberError('');
        }
      } catch {
        setCorporationNumberError('Invalid corporation number');
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
      // Validate all fields
      const isValid = await trigger();
      if (!isValid) {
        return;
      }

      // Validate corporation number one more time before submission
      if (data.corporationNumber.length === 9) {
        try {
          const result = await validateCorporationNumber(
            data.corporationNumber
          ).unwrap();

          if (!result.valid) {
            setCorporationNumberError(
              result.message || 'Invalid corporation number'
            );
            return;
          }
        } catch {
          setCorporationNumberError('Invalid corporation number');
          return;
        }
      }

      await onSubmit(data);
    };

    useImperativeHandle(ref, () => ({
      submit: () => {
        handleSubmit(handleFormSubmit)();
      },
    }));

    return (
      <View style={styles.form}>
        <ControlledFormTextInput
          control={control}
          name="firstName"
          label="First Name"
          placeholder="Enter first name"
          maxLength={50}
          trigger={trigger}
          errors={errors}
          touchedFields={touchedFields}
        />

        <ControlledFormTextInput
          control={control}
          name="lastName"
          label="Last Name"
          placeholder="Enter last name"
          maxLength={50}
          trigger={trigger}
          errors={errors}
          touchedFields={touchedFields}
        />

        <ControlledFormTextInput
          control={control}
          name="phone"
          label="Phone Number"
          placeholder="+1XXXXXXXXXX"
          keyboardType="phone-pad"
          maxLength={12}
          transformOnChange={formatPhoneNumber}
          trigger={trigger}
          errors={errors}
          touchedFields={touchedFields}
        />

        <ControlledFormTextInput
          control={control}
          name="corporationNumber"
          label="Corporation Number"
          placeholder="Enter 9-digit corporation number"
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
          loading={isValidatingCorp}
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
