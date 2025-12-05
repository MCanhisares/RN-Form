import { Button } from '@components/button/Button';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
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
    } catch (error: unknown) {
      const apiError = error as {
        data?: { message?: string };
        status?: number;
      };
      const errorMessage =
        apiError?.data?.message || t('profile.alerts.error.message');
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
      />

      <Button
        title={t('profile.submitButton')}
        onPress={() => {
          formRef.current?.submit();
        }}
        loading={isLoadingPostProfile}
        disabled={isLoadingPostProfile || isLoadingValidation}
        style={styles.submitButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  submitButton: {
    marginTop: 16,
  },
});
