import { StyleSheet } from 'react-native-unistyles';

const lightTheme = {
  colors: {
    // Primary colors
    primary: '#007AFF',
    primaryDark: '#0051D5',
    primaryLight: '#5AC8FA',

    // Secondary colors
    secondary: '#1ff4ff',
    secondaryDark: '#1ff4ff',
    secondaryLight: '#1ff4ff',

    // Background colors
    background: '#FFFFFF',
    backgroundSecondary: '#F5F5F5',

    // Text colors
    text: '#000000',
    textSecondary: '#666666',
    textTertiary: '#999999',
    textInverse: '#FFFFFF',

    // Border colors
    border: '#CCCCCC',
    borderLight: '#E5E5E5',
    borderDark: '#999999',

    // Status colors
    error: '#FF0000',
    errorLight: '#FFE5E5',
    success: '#34C759',
    warning: '#FF9500',
    info: '#007AFF',

    // Button colors
    buttonPrimary: '#007AFF',
    buttonPrimaryText: '#FFFFFF',
    buttonSecondary: 'transparent',
    buttonSecondaryText: '#007AFF',
    buttonDisabled: '#CCCCCC',
    buttonDisabledText: '#999999',

    // Input colors
    inputBackground: '#FFFFFF',
    inputBorder: '#CCCCCC',
    inputBorderError: '#FF0000',
    inputText: '#000000',
    inputPlaceholder: '#999999',

    // Component specific
    label: '#000000',
    errorText: '#FF0000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  gap: (v: number) => v * 8,
};

const darkTheme = {
  colors: {
    // Primary colors
    primary: '#5AC8FA',
    primaryDark: '#007AFF',
    primaryLight: '#64D2FF',

    // Secondary colors
    secondary: '#1ff4ff',
    secondaryDark: '#1ff4ff',
    secondaryLight: '#1ff4ff',

    // Background colors
    background: '#000000',
    backgroundSecondary: '#1C1C1E',

    // Text colors
    text: '#FFFFFF',
    textSecondary: '#999999',
    textTertiary: '#666666',
    textInverse: '#000000',

    // Border colors
    border: '#38383A',
    borderLight: '#2C2C2E',
    borderDark: '#48484A',

    // Status colors
    error: '#FF453A',
    errorLight: '#3A1F1F',
    success: '#30D158',
    warning: '#FF9F0A',
    info: '#5AC8FA',

    // Button colors
    buttonPrimary: '#5AC8FA',
    buttonPrimaryText: '#000000',
    buttonSecondary: 'transparent',
    buttonSecondaryText: '#5AC8FA',
    buttonDisabled: '#38383A',
    buttonDisabledText: '#666666',

    // Input colors
    inputBackground: '#1C1C1E',
    inputBorder: '#38383A',
    inputBorderError: '#FF453A',
    inputText: '#FFFFFF',
    inputPlaceholder: '#666666',

    // Component specific
    label: '#FFFFFF',
    errorText: '#FF453A',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  gap: (v: number) => v * 8,
};

const appThemes = {
  light: lightTheme,
  dark: darkTheme,
};

type AppThemes = typeof appThemes;

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
  themes: appThemes,
  settings: {
    initialTheme: 'light',
  },
});
