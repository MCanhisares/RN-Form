# React Native Form App

[![CI](https://github.com/MCanhisares/RN-Form/actions/workflows/node.js.yml/badge.svg)](https://github.com/MCanhisares/RN-Form/actions/workflows/node.js.yml)

A modern React Native application built with Expo, featuring form management, validation, and state management capabilities. This project demonstrates best practices for building scalable mobile applications with TypeScript, Redux Toolkit, and React Hook Form.

## Features

- 📱 **Cross-platform**: Runs on iOS, Android, and Web
- 📝 **Form Management**: Profile form with comprehensive validation using React Hook Form and Zod
- 🔄 **State Management**: Redux Toolkit for efficient state management
- ✅ **Type Safety**: Full TypeScript support with strict mode enabled
- 🧪 **Testing**: Comprehensive test coverage with Jest and React Native Testing Library
- 🎨 **Modern UI**: Custom form components with error handling and validation
- 🌍 **Internationalization**: Multi-language support (English, French) with i18next
- 🎨 **Theme System**: Light and dark mode support with react-native-unistyles
- 🔍 **Code Quality**: ESLint, Prettier, and Husky for code quality enforcement
- 🚀 **CI/CD**: Automated testing across multiple Node.js versions
- ⌨️ **Keyboard Handling**: Keyboard-aware scroll view for better form UX
- 📐 **Safe Areas**: Proper safe area handling for all devices

## Tech Stack

- **Framework**: [Expo](https://expo.dev) ~54.0.26
- **Runtime**: React Native 0.81.5 with React 19.1.0
- **Language**: TypeScript 5.9.2
- **State Management**: Redux Toolkit 2.11.0
- **Form Handling**: React Hook Form 7.68.0 with Zod 4.1.13
- **Navigation**: Expo Router 6.0.16
- **Styling**: react-native-unistyles 3.0.19 (theme-aware styling)
- **Internationalization**: i18next 25.7.1 with react-i18next 16.3.5
- **Testing**: Jest 29.7.0 with React Native Testing Library
- **Code Quality**: ESLint, Prettier, Husky, lint-staged

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: 18.x, 20.x, or 22.x (recommended)
- **npm**: Latest version
- **Expo CLI**: Will be installed as a dev dependency
- **iOS Development** (macOS only): Xcode and iOS Simulator
- **Android Development**: Android Studio and Android Emulator

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:MCanhisares/RN-Form.git
   cd RN-Form
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

## Usage

### Development

Start the Expo development server:

```bash
npm start
```

This will open the Expo DevTools in your browser. You can then:

- Press `i` to open in iOS Simulator
- Press `a` to open in Android Emulator
- Press `w` to open in web browser
- Scan the QR code with Expo Go app on your device

### Platform-Specific Commands

```bash
# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start the Expo development server |
| `npm run ios` | Run the app on iOS simulator |
| `npm run android` | Run the app on Android emulator |
| `npm run web` | Run the app in web browser |
| `npm test` | Run the test suite |
| `npm run lint` | Run ESLint to check code quality |
| `npm run typescript` | Type-check the codebase without emitting files |

## Testing

The project uses Jest with React Native Testing Library for comprehensive testing. Run tests with:

```bash
npm test
```

Tests are automatically run on every commit (via Husky) and in CI/CD pipelines. The test suite includes:

- Component unit tests
- Form validation tests
- Integration tests for screens
- Redux store tests

## Project Structure

```
my-app/
├── app/                      # Main application code
│   ├── components/           # Reusable UI components
│   │   ├── button/          # Button component
│   │   ├── formInputs/      # Form input components
│   │   ├── languageToggle/  # Language toggle component
│   │   ├── themeToggle/     # Theme toggle component
│   │   └── text/            # Text components (Label, ErrorMessage)
│   ├── i18n/                # Internationalization
│   │   ├── locales/         # Translation files (en.json, fr.json)
│   │   └── config.ts        # i18next configuration
│   ├── redux/               # Redux store configuration
│   │   ├── corporate/       # Corporate-related state
│   │   ├── profile/         # Profile-related state
│   │   ├── hooks.ts         # Typed Redux hooks
│   │   └── store.ts         # Store configuration
│   ├── screens/             # Screen components
│   │   ├── forms/           # Form components
│   │   ├── hooks/           # Custom hooks
│   │   ├── BaseScreen.tsx   # Base screen wrapper with safe areas
│   │   └── Profile.tsx      # Profile screen
│   ├── _layout.tsx          # Root layout with navigation
│   └── index.tsx            # Entry point
├── assets/                   # Static assets (images, etc.)
├── .github/                  # GitHub configuration
│   └── workflows/           # CI/CD workflows
├── .husky/                   # Git hooks
├── unistyles.ts             # Unistyles theme configuration
└── package.json             # Dependencies and scripts
```

## Code Quality

This project enforces code quality through:

- **ESLint**: Linting rules configured for Expo and React Native
- **Prettier**: Automatic code formatting
- **Husky**: Git hooks for pre-commit checks
- **lint-staged**: Runs linter and formatter on staged files before commit

All TypeScript and TSX files are automatically formatted and linted before commits.

## TypeScript Path Aliases

The project uses path aliases for cleaner imports:

- `@components/*` → `./app/components/*`
- `@redux/*` → `./app/redux/*`
- `@screens/*` → `./app/screens/*`
- `@utils/*` → `./app/utils/*`

Example usage:

```typescript
import { Button } from '@components/button/Button';
import { useAppDispatch } from '@redux/hooks';
```

## Internationalization (i18n)

The app supports multiple languages using `i18next` and `react-i18next`. Currently supported languages:

- **English (en)** - Default language
- **French (fr)**

### Language Toggle

The `LanguageToggle` component allows users to switch between available languages. It displays a flag emoji representing the current language and cycles through available locales when tapped.

**Location**: `app/components/languageToggle/LanguageToggle.tsx`

**Usage**: The language toggle is integrated into the navigation header in `app/_layout.tsx`.

### Adding New Languages

1. Add translation files in `app/i18n/locales/` (e.g., `es.json` for Spanish)
2. Update `app/i18n/config.ts` to include the new language resource
3. Add the locale to `AVAILABLE_LOCALES` in `LanguageToggle.tsx`
4. Add the country code mapping in `LOCALE_TO_COUNTRY_CODE`

Example:

```typescript
// app/i18n/config.ts
import es from './locales/es.json';

resources: {
  // ... existing languages
  es: {
    translation: es,
  },
}
```

## Theming with Unistyles

The app uses `react-native-unistyles` for theme-aware styling with support for light and dark modes.

### Theme Configuration

Themes are defined in `unistyles.ts` with comprehensive design tokens:

- **Colors**: Primary, secondary, background, text, borders, status colors, etc.
- **Spacing**: Consistent spacing scale (xs, sm, md, lg, xl, xxl)
- **Border Radius**: Standardized border radius values
- **Typography**: Font sizes and weights
- **Gap Function**: Utility function for consistent gaps

### Theme Toggle

The `ThemeToggle` component allows users to switch between light and dark themes. It displays an emoji (🌑 for dark, 🔆 for light) and toggles the theme when tapped.

**Location**: `app/components/themeToggle/ThemeToggle.tsx`

**Usage**: The theme toggle is integrated into the navigation header in `app/_layout.tsx`.

### Using Unistyles in Components

```typescript
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

const MyComponent = () => {
  const { theme, rt } = useUnistyles();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello</Text>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  text: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
}));
```

### Accessing Theme Runtime

```typescript
import { useUnistyles } from 'react-native-unistyles';

const { rt } = useUnistyles();
const currentTheme = rt.themeName; // 'light' or 'dark'
```

### Programmatic Theme Changes

```typescript
import { UnistylesRuntime } from 'react-native-unistyles';

UnistylesRuntime.setTheme('dark'); // or 'light'
```

## BaseScreen Component

The `BaseScreen` component provides a consistent base for all screens with:

- **Safe Area Handling**: Uses `react-native-safe-area-context` to respect device safe areas
- **Status Bar**: Automatically adjusts status bar style based on current theme
- **Theme-Aware Background**: Applies theme background color

**Location**: `app/screens/BaseScreen.tsx`

**Usage**:

```typescript
import { BaseScreen } from './BaseScreen';

export const MyScreen = () => {
  return (
    <BaseScreen>
      {/* Your screen content */}
    </BaseScreen>
  );
};
```

## Keyboard Handling

The app uses `react-native-keyboard-aware-scroll-view` to automatically adjust scroll position when the keyboard appears, ensuring form inputs remain visible and accessible.

**Usage in Profile Screen**:

```typescript
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

<KeyboardAwareScrollView
  enableAutomaticScroll
  enableOnAndroid
  keyboardDismissMode="none"
  extraHeight={-64}
>
  {/* Form content */}
</KeyboardAwareScrollView>
```

This ensures a smooth user experience when filling out forms on mobile devices.

## CI/CD

The project uses GitHub Actions for continuous integration. The workflow:

- Runs on pushes and pull requests to the `main` branch
- Tests across Node.js versions: 18.x, 20.x, and 22.x
- Installs dependencies and runs the test suite

View the workflow status in the badge at the top of this README.

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Ensure all tests pass: `npm test`
4. Ensure code is properly formatted: `npm run lint`
5. Commit your changes (Husky will run pre-commit checks)
6. Push to your branch and create a pull request

## Learn More

- [Expo Documentation](https://docs.expo.dev/): Learn about Expo features and APIs
- [React Native Documentation](https://reactnative.dev/): Learn about React Native
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/): Learn about Redux Toolkit
- [React Hook Form Documentation](https://react-hook-form.com/): Learn about form handling
- [react-native-unistyles Documentation](https://reactnativeunistyles.vercel.app/): Learn about Unistyles theming
- [i18next Documentation](https://www.i18next.com/): Learn about internationalization
- [react-native-keyboard-aware-scroll-view](https://github.com/mateusz1913/react-native-keyboard-aware-scroll-view): Learn about keyboard handling

## License

This project is private and proprietary.
