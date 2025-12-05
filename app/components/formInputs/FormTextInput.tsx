import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
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
            placeholderTextColor="#999999"
            {...textInputProps}
          />
          {loading && (
            <ActivityIndicator
              testID="FormTextInput-loading-indicator"
              style={styles.validationIndicator}
              size="small"
              color="#007AFF"
            />
          )}
        </View>
        <ErrorMessage testID="FormTextInput-error" message={error} />
      </View>
    );
  }
);

FormTextInput.displayName = 'FormTextInput';

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 8,
  },
  container: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#000000',
  },
  inputError: {
    borderColor: '#FF0000',
  },
  inputWithIndicator: {
    paddingRight: 40,
  },
  validationIndicator: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
});
