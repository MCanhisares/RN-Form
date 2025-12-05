import React from 'react';
import { Text, TextProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type LabelProps = TextProps & {
  children: React.ReactNode;
};

export const Label: React.FC<LabelProps> = ({ children, style, ...props }) => {
  return (
    <Text testID="Label-text" style={[styles.label, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create((theme) => ({
  label: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.label,
    marginBottom: theme.spacing.sm,
  },
}));
