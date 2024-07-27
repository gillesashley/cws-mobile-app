import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { UserProfile } from "@/services/services";
import React from "react";
import { StyleSheet, View } from "react-native";

interface ProfileHeaderProps {
  profile: UserProfile;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  const primaryColor = useThemeColor({}, "primary");

  return (
    <View style={styles.header}>
      <ThemedText style={styles.name}>{profile.name}</ThemedText>
      <ThemedText style={styles.email}>{profile.email}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    paddingVertical: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  editAvatarButton: {
    position: "absolute",
    right: 130,
    top: 90,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    opacity: 0.7,
  },
});
