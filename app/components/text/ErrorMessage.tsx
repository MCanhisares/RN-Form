import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

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
    <Text style={[styles.errorText, style]} {...props}>
      {message}
    </Text>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: '#FF0000',
    fontSize: 14,
    marginTop: 4,
  },
});
