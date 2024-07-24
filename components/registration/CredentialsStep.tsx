import { Input } from "@/components/ui/Input";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

interface CredentialsStepProps {
  onComplete: (data: { name: string; email: string; password: string }) => void;
  initialData: { name: string; email: string; password: string };
}

export default function CredentialsStep({
  onComplete,
  initialData,
}: CredentialsStepProps) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  const [password, setPassword] = useState(initialData.password);
  const [passwordConfirmation, setPasswordConfirmation] = useState(
    initialData.password
  );

  const handleNext = () => {
    if (password !== passwordConfirmation) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    onComplete({ name, email, password });
  };

  return (
    <View style={styles.container}>
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
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
      />
      <Input
        label="Confirm Password"
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
        placeholder="Confirm your password"
        secureTextEntry
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
