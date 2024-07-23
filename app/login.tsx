import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthContext } from "@/components/AuthProvider";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthContext();
  const router = useRouter();

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const primaryColor = useThemeColor({}, "tint");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.replace("/(tabs)/home");
      } else {
        Alert.alert("Login Failed", "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ThemedText style={styles.title}>Login</ThemedText>
      <TextInput
        style={[styles.input, { color: textColor, borderColor: textColor }]}
        placeholder="Email"
        placeholderTextColor={textColor}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, { color: textColor, borderColor: textColor }]}
        placeholder="Password"
        placeholderTextColor={textColor}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: primaryColor }]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <ThemedText style={styles.buttonText}>
          {isLoading ? "Logging in..." : "Login"}
        </ThemedText>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    height: 40,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});