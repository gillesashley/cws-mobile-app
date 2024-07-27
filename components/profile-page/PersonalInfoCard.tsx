import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Input } from "@/components/ui/Input";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { StyleSheet } from "react-native";

type PersonalInfoCardProps = {
  profile: any;
  setProfile: (profile: any) => void;
};

export const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({
  profile,
  setProfile,
}) => {
  const surfaceColor = useThemeColor({}, "surface");
  const textColor = useThemeColor({}, "text");

  return (
    <ThemedView style={[styles.card, { backgroundColor: surfaceColor }]}>
      <ThemedText style={styles.sectionTitle}>Personal Information</ThemedText>
      <Input
        label="Name"
        value={profile.name}
        onChangeText={(text) => setProfile({ ...profile, name: text })}
        placeholder="Enter your name"
      />
      <Input
        label="Email"
        value={profile.email}
        onChangeText={(text) => setProfile({ ...profile, email: text })}
        placeholder="Enter your email"
        keyboardType="email-address"
      />
      <Input
        label="Phone"
        value={profile.phone}
        onChangeText={(text) => setProfile({ ...profile, phone: text })}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
      />
      <Input
        label="Area"
        value={profile.area}
        onChangeText={(text) => setProfile({ ...profile, area: text })}
        placeholder="Enter your area"
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
