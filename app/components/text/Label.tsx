import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

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

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
});
