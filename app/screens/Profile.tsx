import { Button } from '@components/button/Button';
import { useLazyValidateCorporateNumberQuery } from '@redux/corporate/apiSlice';
import { usePostProfileMutation } from '@redux/profile/apiSlice';
import React, { useRef } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  ProfileForm,
  ProfileFormData,
  ProfileFormHandle,
} from './forms/ProfileForm';

export const Profile = () => {
  const [, { isLoading: isValidatingCorp }] =
    useLazyValidateCorporateNumberQuery();
  const [postProfile, { isLoading: isSubmitting }] = usePostProfileMutation();
  const formRef = useRef<ProfileFormHandle>(null);

  const handleSubmit = async (data: ProfileFormData) => {
    try {
      await postProfile({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        phone: data.phone,
        corporationNumber: data.corporationNumber.trim(),
      }).unwrap();
      Alert.alert('Success', 'Profile submitted successfully!');
    } catch (error: unknown) {
      const apiError = error as {
        data?: { message?: string };
        status?: number;
      };
      const errorMessage =
        apiError?.data?.message ||
        'Failed to submit profile. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Onboarding Form</Text>
      </View>

      <ProfileForm
        ref={formRef}
        onSubmit={handleSubmit}
        isValidatingCorp={isValidatingCorp}
      />

      <Button
        title="Submit →"
        onPress={() => {
          formRef.current?.submit();
        }}
        loading={isSubmitting}
        disabled={isSubmitting || isValidatingCorp}
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
