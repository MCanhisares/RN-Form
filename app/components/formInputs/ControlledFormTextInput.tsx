import React from 'react';
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  UseFormTrigger,
} from 'react-hook-form';
import { FormTextInput } from './FormTextInput';

type ControlledFormTextInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  trigger?: UseFormTrigger<T>;
  errors?: Record<string, { message?: string }>;
  touchedFields?: Record<string, boolean>;
  onBlurCustom?: () => void;
  transformOnChange?: (text: string) => string;
  onChangeCustom?: (text: string) => void;
  customError?: string;
} & Omit<
  React.ComponentPropsWithoutRef<typeof FormTextInput>,
  'value' | 'onChangeText' | 'onBlur' | 'error'
>;

export const ControlledFormTextInput = <T extends FieldValues>({
  control,
  name,
  trigger,
  errors,
  touchedFields,
  onBlurCustom,
  transformOnChange,
  onChangeCustom,
  customError,
  ...formTextInputProps
}: ControlledFormTextInputProps<T>) => {
  const fieldError = errors?.[name as string];
  const isTouched = touchedFields?.[name as string];
  const validationError =
    isTouched && fieldError ? fieldError.message : undefined;
  const errorMessage = customError || validationError;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <FormTextInput
          {...formTextInputProps}
          value={value}
          onChangeText={(text) => {
            const transformedText = transformOnChange
              ? transformOnChange(text)
              : text;
            onChange(transformedText);
            if (onChangeCustom) {
              onChangeCustom(transformedText);
            }
          }}
          onBlur={() => {
            onBlur();
            if (trigger) {
              trigger(name);
            }
            if (onBlurCustom) {
              onBlurCustom();
            }
          }}
          error={errorMessage}
        />
      )}
    />
  );
};
