import React from 'react';
import {
  ActivityIndicator,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ErrorMessage } from '../text/ErrorMessage';
import { Label } from '../text/Label';

type FormTextInputProps = TextInputProps & {
  label?: string;
  error?: string;
  loading?: boolean;
  containerStyle?: object;
};

export const FormTextInput = React.forwardRef<TextInput, FormTextInputProps>(
  (
    { label, error, loading = false, containerStyle, style, ...textInputProps },
    ref
  ) => {
    const { theme } = useUnistyles();
    const hasError = Boolean(error);

    return (
      <View
        testID="FormTextInput-wrapper"
        style={[styles.wrapper, containerStyle]}
      >
        {label && <Label testID="FormTextInput-label">{label}</Label>}
        <View testID="FormTextInput-container" style={styles.container}>
          <TextInput
            testID="FormTextInput-input"
            ref={ref}
            style={[
              styles.input,
              hasError && styles.inputError,
              loading && styles.inputWithIndicator,
              style,
            ]}
            placeholderTextColor={theme.colors.inputPlaceholder}
            {...textInputProps}
          />
          {loading && (
            <ActivityIndicator
              testID="FormTextInput-loading-indicator"
              style={styles.validationIndicator}
              size="small"
              color={theme.colors.primary}
            />
          )}
        </View>
        <ErrorMessage testID="FormTextInput-error" message={error} />
      </View>
    );
  }
);

FormTextInput.displayName = 'FormTextInput';

const styles = StyleSheet.create((theme) => ({
  wrapper: {
    marginBottom: theme.spacing.sm,
  },
  container: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    backgroundColor: theme.colors.inputBackground,
    color: theme.colors.inputText,
  },
  inputError: {
    borderColor: theme.colors.inputBorderError,
  },
  inputWithIndicator: {
    paddingRight: 40,
  },
  validationIndicator: {
    position: 'absolute',
    right: theme.spacing.md,
    top: theme.spacing.md,
  },
}));
