import { LanguageToggle } from '@components/languageToggle/LanguageToggle';
import { ThemeToggle } from '@components/themeToggle/ThemeToggle';
import { Stack } from 'expo-router';
import { useUnistyles } from 'react-native-unistyles';
import './i18n/config';

export default function RootLayout() {
  const { theme } = useUnistyles();

  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{
          headerLeft: () => <LanguageToggle />,
          headerRight: () => <ThemeToggle />,
          headerTitle: 'Onboarding',
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text,
        }}
      />
    </Stack>
  );
}
