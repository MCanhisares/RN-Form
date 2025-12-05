import React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

type ButtonProps = TouchableOpacityProps & {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
};

export const Button: React.FC<ButtonProps> = ({
  title,
  loading = false,
  variant = 'primary',
  disabled,
  style,
  ...props
}) => {
  const { theme } = useUnistyles();
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      testID="Button"
      style={[
        styles.button,
        variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
        isDisabled && styles.buttonDisabled,
        style,
      ]}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'primary'
              ? theme.colors.buttonPrimaryText
              : theme.colors.buttonSecondaryText
          }
          testID="ActivityIndicator"
        />
      ) : (
        <Text
          style={[
            styles.buttonText,
            variant === 'primary'
              ? styles.primaryButtonText
              : styles.secondaryButtonText,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create((theme) => ({
  button: {
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primaryButton: {
    backgroundColor: theme.colors.buttonPrimary,
  },
  secondaryButton: {
    backgroundColor: theme.colors.buttonSecondary,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
  primaryButtonText: {
    color: theme.colors.buttonPrimaryText,
  },
  secondaryButtonText: {
    color: theme.colors.buttonSecondaryText,
  },
}));
