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
- 🔍 **Code Quality**: ESLint, Prettier, and Husky for code quality enforcement
- 🚀 **CI/CD**: Automated testing across multiple Node.js versions

## Tech Stack

- **Framework**: [Expo](https://expo.dev) ~54.0.26
- **Runtime**: React Native 0.81.5 with React 19.1.0
- **Language**: TypeScript 5.9.2
- **State Management**: Redux Toolkit 2.11.0
- **Form Handling**: React Hook Form 7.68.0 with Zod 4.1.13
- **Navigation**: Expo Router 6.0.16
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
│   │   └── text/            # Text components (Label, ErrorMessage)
│   ├── redux/               # Redux store configuration
│   │   ├── corporate/       # Corporate-related state
│   │   ├── profile/         # Profile-related state
│   │   ├── hooks.ts         # Typed Redux hooks
│   │   └── store.ts         # Store configuration
│   ├── screens/             # Screen components
│   │   ├── forms/           # Form components
│   │   ├── hooks/           # Custom hooks
│   │   └── Profile.tsx      # Profile screen
│   ├── _layout.tsx          # Root layout
│   └── index.tsx            # Entry point
├── assets/                   # Static assets (images, etc.)
├── .github/                  # GitHub configuration
│   └── workflows/           # CI/CD workflows
├── .husky/                   # Git hooks
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

## License

This project is private and proprietary.
