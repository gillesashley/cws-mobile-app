import { useRouter } from "expo-router";
import React, {useCallback, useEffect, useState} from "react";
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
import {Button} from "@/components/ui/Button";
import {useAuth} from "@/hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";


type ColorScheme = "light" | "dark";

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { token, user } = useAuthContext();
  const router = useRouter();
  const backgroundColor = useThemeColor({}, "background");

  const colorScheme = useThemeColor({}, "background") as ColorScheme;
  const colors = Colors[colorScheme] || Colors.light;

  const fetchProfile = useCallback(async (access_token: string) => {
    console.log(`This is my token - ${access_token}`);
    try {
      setIsLoading(true);
      setError(null);

      const userData = await fetchUserProfile(access_token!);
      setProfile(userData);
    } catch (error) {
      // console.error("Error fetching user profile:", error);
      console.log(error);
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
  },[]);

  useEffect(() => {
    fetchProfile(token!).catch(error => console.log(error));
  }, [fetchProfile, token]);

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

  const logoutUser = async (access_token: string) => {
    try {
      // Call your API to invalidate the token if necessary
      await axios.post(
          `${API_BASE_URL}/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
      );

      // Clear the stored auth state
      await AsyncStorage.removeItem("authState");
      // setAuthState({ token: null, user: null });
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  };

  const logout = () => {
    logoutUser(token!).then(res => router.replace('/login'));
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView style={styles.scrollView}>
        <ProfileHeader profile={profile} />
        <PersonalInfoCard profile={profile} setProfile={setProfile} />
        <LocationCard profile={profile} />
        <Button onPress={logout} title={"Logout"}/>
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
