import { LanguageToggle } from '@components/languageToggle/LanguageToggle';
import { Stack } from 'expo-router';
import './i18n/config';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerLeft: () => <LanguageToggle />,
          headerStyle: {
            backgroundColor: 'transparent',
          },
        }}
      />
    </Stack>
  );
}
