import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const AVAILABLE_LOCALES = ['en', 'fr'] as const;
type Locale = (typeof AVAILABLE_LOCALES)[number];

/**
 * Maps locale codes to ISO 3166-1 alpha-2 country codes for flag generation
 */
const LOCALE_TO_COUNTRY_CODE: Record<Locale, string> = {
  en: 'US',
  fr: 'FR',
};

/**
 * Converts a 2-letter country code to a flag emoji using Unicode Regional Indicator Symbols
 * @param countryCode - ISO 3166-1 alpha-2 country code (e.g., 'US', 'FR')
 * @returns Flag emoji string
 */
const getFlagEmoji = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 0x1f1e6 + (char.charCodeAt(0) - 0x41));
  return String.fromCodePoint(...codePoints);
};

export const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const currentLocale = (i18n.language || 'en') as Locale;
  const nextLocale =
    AVAILABLE_LOCALES[
      (AVAILABLE_LOCALES.indexOf(currentLocale) + 1) % AVAILABLE_LOCALES.length
    ];

  const handleToggle = () => {
    i18n.changeLanguage(nextLocale);
  };

  const flagEmoji = getFlagEmoji(LOCALE_TO_COUNTRY_CODE[currentLocale]);

  return (
    <TouchableOpacity
      onPress={handleToggle}
      style={styles.container}
      activeOpacity={0.6}
      testID="LanguageToggle"
    >
      <Text style={styles.flag}>{flagEmoji}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flag: {
    fontSize: 24,
    lineHeight: 24,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
