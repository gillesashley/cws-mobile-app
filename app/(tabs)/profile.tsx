import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { API_BASE_URL } from "@/api/api";
import { useAuthContext } from "@/components/AuthProvider";
import { LocationCard } from "@/components/profile-page/LocationCard";
import { PersonalInfoCard } from "@/components/profile-page/PersonalInfoCard";
import { ProfileHeader } from "@/components/profile-page/ProfileHeader";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { fetchUserProfile, useApi, UserProfile, zNewUserProfile, zUserProfile } from "@/services/services";
import axios from "axios";
import { Button } from "@/components/ui/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useForm } from "react-hook-form";
import { LoadingState } from "@/components/profile-page/LoadingState";
import { ErrorView } from "@/components/ErrorView";

type ColorScheme = "light" | "dark";

export default function ProfileScreen() {
  const { logout, updateUser } = useAuthContext();
  const api = useApi();
  const { data: profile, error: qrProfileError, isLoading: qrProfileLoading, mutate: revalidateProfile } = api.getUserProfile();
  const { trigger: doProfileUdpate, isMutating: mxProfileLoading, error: mxProfileError } = api.mxUpdateUserProfile();

  const { control, handleSubmit, reset, getValues } = useForm < typeof profile > ();

  useEffect(() => {
    if (!getValues||!profile) return;
    const _value = getValues();
    if (!_value) return;
    reset(profile);
  }, [getValues,profile]);

  const isLoading = qrProfileLoading || mxProfileLoading;
  const error = qrProfileError?.message || mxProfileError?.message;

  const router = useRouter();
  const backgroundColor = useThemeColor({}, "background");

  const colorScheme = useThemeColor({}, "background");
  const colors = Colors[colorScheme] || Colors.light;

  const handleSaveChanges = async (profile: any) => {
    try {
      doProfileUdpate(zNewUserProfile.parse(profile))
        .then(({ token, ...user }) => Promise.allSettled([updateUser({ user, token }), revalidateProfile()]))
        .then(() => Alert.alert("Success", "Profile updated successfully"))
        .catch(error => Alert.alert(error.message));
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile");
    }
  };

  if (error) {
    return <ErrorView onRetry={() => void 0} error={JSON.stringify(error, null, 2)} />;
  }

  if (!profile || isLoading) {
    return <LoadingState />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView style={styles.scrollView}>
        <View className="flex flex-col justify-center gap-5 p-1">
          <ProfileHeader profile={profile} />
          <PersonalInfoCard control={control} />
          <LocationCard control={control} />
          <View className="flex flex-col gap-3 w-full p-4">
            <Button disabled onPress={handleSubmit(handleSaveChanges)} title={"update"} />
            <Button onPress={() => reset()} title={"clear"} />
            <Button onPress={() => logout().then(res => router.replace("/login"))} title={"Logout"} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    flex: 1
  }
});
