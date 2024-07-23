import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [constituency, setConstituency] = useState("Accra Central");
  const backgroundColor = useThemeColor({}, "background");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
    <ScrollView style={styles.scrollView}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">User Profile</ThemedText>

        <ThemedView style={styles.formContainer}>
          <ThemedText type="subtitle">Personal Information</ThemedText>
          <Input
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
          />
          <Input
            label="Constituency"
            value={constituency}
            onChangeText={setConstituency}
            placeholder="Enter your constituency"
          />
        </ThemedView>

        <ThemedView style={styles.preferencesContainer}>
          <ThemedText type="subtitle">Notification Preferences</ThemedText>
          {/* Add toggle switches for notification preferences */}
        </ThemedView>

        <Button
          title="Save Changes"
          onPress={() => console.log("Save profile")}
          style={styles.saveButton}
        />
      </ThemedView>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    marginVertical: 16,
  },
  preferencesContainer: {
    marginVertical: 16,
  },
  saveButton: {
    marginTop: 16,
  },
});
