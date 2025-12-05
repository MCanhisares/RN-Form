import React from 'react';
import { Text, TextProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type ErrorMessageProps = TextProps & {
  message?: string;
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  style,
  ...props
}) => {
  if (!message) {
    return null;
  }

  return (
    <Text
      testID="ErrorMessage-text"
      style={[styles.errorText, style]}
      {...props}
    >
      {message}
    </Text>
  );
};

const styles = StyleSheet.create((theme) => ({
  errorText: {
    color: theme.colors.errorText,
    fontSize: theme.fontSize.sm,
    marginTop: theme.spacing.xs,
  },
}));
