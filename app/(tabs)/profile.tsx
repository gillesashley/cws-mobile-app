import { fetchUserProfile, UserProfile } from "@/services/services";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  TextStyle,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthContext } from "@/components/AuthProvider";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { API_BASE_URL } from "@/config/api";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";

type ColorScheme = "light" | "dark";

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user, logout } = useAuthContext();
  const router = useRouter();
  const colorScheme = useThemeColor({}, "background") as ColorScheme;
  const colors = Colors[colorScheme] || Colors.light;

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userData = await fetchUserProfile(user.token);
      setProfile(userData);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      Alert.alert("Error", "Failed to load user profile");
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

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to logout. Please try again.");
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

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background || "#FFFFFF" },
      ]}
      edges={["top"]}
    >
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.content}>
          <ThemedText style={styles.title}>User Profile</ThemedText>

          <ThemedView style={styles.formContainer}>
            <ThemedText style={styles.sectionTitle}>
              Personal Information
            </ThemedText>
            <Input
              label="Name"
              value={profile.name}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
              placeholder="Enter your name"
              style={styles.input}
              labelStyle={styles.inputLabel}
            />
            <Input
              label="Email"
              value={profile.email}
              onChangeText={(text) => setProfile({ ...profile, email: text })}
              placeholder="Enter your email"
              keyboardType="email-address"
              style={styles.input}
              labelStyle={styles.inputLabel}
            />
            <Input
              label="Phone"
              value={profile.phone}
              onChangeText={(text) => setProfile({ ...profile, phone: text })}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              style={styles.input}
              labelStyle={styles.inputLabel}
            />
            <Input
              label="Constituency"
              value={profile.constituency?.name || "Not set"}
              onChangeText={() => {}}
              style={
                {
                  ...styles.input,
                  backgroundColor: colors.border,
                } as ViewStyle
              }
              labelStyle={styles.inputLabel as TextStyle}
              editable={false}
            />
            <Input
              label="Region"
              value={profile.region?.name || "Not set"}
              onChangeText={() => {}}
              style={
                {
                  ...styles.input,
                  backgroundColor: colors.border,
                } as ViewStyle
              }
              labelStyle={styles.inputLabel as TextStyle}
              editable={false}
            />
          </ThemedView>

          <ThemedView style={styles.preferencesContainer}>
            <ThemedText style={styles.sectionTitle}>
              Notification Preferences
            </ThemedText>
            <ThemedView style={styles.switchContainer}>
              <ThemedText>Email Notifications</ThemedText>
              <Switch
                value={profile.email_notifications}
                onValueChange={(value) =>
                  setProfile({ ...profile, email_notifications: value })
                }
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={
                  profile.email_notifications ? colors.background : colors.text
                }
              />
            </ThemedView>
            <ThemedView style={styles.switchContainer}>
              <ThemedText>Push Notifications</ThemedText>
              <Switch
                value={profile.push_notifications}
                onValueChange={(value) =>
                  setProfile({ ...profile, push_notifications: value })
                }
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={
                  profile.push_notifications ? colors.background : colors.text
                }
              />
            </ThemedView>
          </ThemedView>

          <Button
            title={isLoading ? "Saving..." : "Save Changes"}
            onPress={handleSaveChanges}
            style={
              [styles.button, { backgroundColor: colors.primary }] as ViewStyle
            }
            disabled={isLoading}
          />

          <Button
            title="Logout"
            onPress={handleLogout}
            style={
              [
                styles.button,
                styles.logoutButton,
                { backgroundColor: colors.error },
              ] as ViewStyle
            }
          />
        </ThemedView>
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
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 12,
  },
  inputLabel: {
    marginBottom: 4,
  },
  preferencesContainer: {
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  button: {
    marginBottom: 12,
    paddingVertical: 12,
  },
  logoutButton: {
    marginTop: 20,
  },
});
