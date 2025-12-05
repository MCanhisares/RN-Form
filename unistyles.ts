import { StyleSheet } from 'react-native-unistyles';

const lightTheme = {
  colors: {
    primary: '#ff1ff4',
    secondary: '#1ff4ff',
    // any nesting, spreading, arrays, etc.
  },
  // functions, external imports, etc.
  gap: (v: number) => v * 8,
};

const darkTheme = {
  colors: {
    primary: '#aa12ff',
    secondary: 'pink',
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
    adaptiveThemes: true,
  },
});
