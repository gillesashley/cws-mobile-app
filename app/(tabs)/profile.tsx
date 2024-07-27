import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { API_BASE_URL } from "@/api/api";
import { useAuthContext } from "@/components/AuthProvider";
import { LoadingState } from "@/components/profile-page/LoadingState";
import { LocationCard } from "@/components/profile-page/LocationCard";
import { PersonalInfoCard } from "@/components/profile-page/PersonalInfoCard";
import { ProfileHeader } from "@/components/profile-page/ProfileHeader";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { fetchUserProfile, UserProfile } from "@/services/services";
import axios from "axios";

type ColorScheme = "light" | "dark";

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user, logout } = useAuthContext();
  const router = useRouter();
  const backgroundColor = useThemeColor({}, "background");

  const colorScheme = useThemeColor({}, "background") as ColorScheme;
  const colors = Colors[colorScheme] || Colors.light;

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userData = await fetchUserProfile(user.token);
      setProfile(userData);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          setError("Your session has expired. Please log in again.");
          setError(
            `Failed to load user profile: ${
              error.response.data.message || "Unknown error"
            }`
          );
        }
      } else {
        setError("An unexpected error occurred while fetching your profile.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      await axios.put(
        `${API_BASE_URL}/update-profile`,
        {
          name: profile?.name,
          email: profile?.email,
          phone: profile?.phone,
          area: profile?.area,
          email_notifications: profile?.email_notifications,
          push_notifications: profile?.push_notifications,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={["top"]}
      >
        <ThemedText>Loading profile...</ThemedText>
      </SafeAreaView>
    );
  }

  if (isLoading || !profile) {
    return <LoadingState />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView style={styles.scrollView}>
        <ProfileHeader profile={profile} />
        <PersonalInfoCard profile={profile} setProfile={setProfile} />
        <LocationCard profile={profile} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
});
