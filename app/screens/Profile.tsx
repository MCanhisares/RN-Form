import { Button } from '@components/button/Button';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import {
  ProfileForm,
  ProfileFormData,
  ProfileFormHandle,
} from './forms/ProfileForm';
import { useProfile } from './hooks/useProfile';

export const Profile = () => {
  const { t } = useTranslation();
  const {
    validateCorporationNumberQuery,
    isLoadingValidation,
    postProfileMutation,
    isLoadingPostProfile,
  } = useProfile();
  const formRef = useRef<ProfileFormHandle>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleSubmit = async (data: ProfileFormData) => {
    try {
      await postProfileMutation({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        phone: data.phone,
        corporationNumber: data.corporationNumber.trim(),
      }).unwrap();
      Alert.alert(
        t('profile.alerts.success.title'),
        t('profile.alerts.success.message')
      );
      formRef.current?.reset();
    } catch (error: unknown) {
      const apiError = error as { message?: string } | undefined;
      const errorMessage =
        apiError?.message || t('profile.alerts.error.message');
      Alert.alert(t('profile.alerts.error.title'), errorMessage);
    }
  };

  const validateCorporationNumber = async (corporationNumber: string) => {
    const result =
      await validateCorporationNumberQuery(corporationNumber).unwrap();
    return { valid: result.valid, message: result.message || '' };
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{t('profile.title')}</Text>
      </View>

      <ProfileForm
        ref={formRef}
        validateCorporationNumber={validateCorporationNumber}
        onSubmit={handleSubmit}
        isLoadingValidation={isLoadingValidation}
        onValidationChange={setIsFormValid}
      />

      <Button
        title={t('profile.submitButton')}
        onPress={() => {
          formRef.current?.submit();
        }}
        loading={isLoadingPostProfile}
        disabled={isLoadingPostProfile || isLoadingValidation || !isFormValid}
        style={styles.submitButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  header: {
    marginBottom: theme.spacing.xxl,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  submitButton: {
    marginTop: theme.spacing.lg,
  },
}));
