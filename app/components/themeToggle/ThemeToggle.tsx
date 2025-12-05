import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import {
  StyleSheet,
  UnistylesRuntime,
  useUnistyles,
} from 'react-native-unistyles';

export const ThemeToggle = () => {
  const { rt } = useUnistyles();
  const currentTheme = rt.themeName || 'light';
  const isDark = currentTheme === 'dark';

  const handleToggle = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    UnistylesRuntime.setTheme(nextTheme);
  };

  const emoji = isDark ? '🌑' : '🔆';

  return (
    <TouchableOpacity
      onPress={handleToggle}
      style={styles.container}
      activeOpacity={0.6}
      testID="ThemeToggle"
    >
      <Text style={styles.emoji}>{emoji}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create(() => ({
  container: {
    minWidth: 44,
    minHeight: 44,
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 20,
    lineHeight: 24,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
}));
