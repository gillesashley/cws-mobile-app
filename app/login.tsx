import axios from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { API_BASE_URL } from "@/api/api";
import { useAuthContext } from "@/components/AuthProvider";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
const { height } = Dimensions.get("window");

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthContext();
  const router = useRouter();

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const primaryColor = useThemeColor({}, "tint");
  const surfaceColor = useThemeColor({}, "surface");
  const placeholderColor = useThemeColor({}, "placeholder");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Attempting login with email:", email);
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });

      console.log("Login response:", response.data);

      if (response.data.token && response.data.user) {
        // Call the login function from AuthContext
        const loginResult = await login(email, password);
        if (loginResult) {
          router.replace("/(tabs)");
        } else {
          Alert.alert("Error", "Failed to save login information");
        }
      } else {
        Alert.alert("Error", "Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;

        if (status === 422 || status === 400) {
          // Validation error or Bad Request
          let errorMessage = "Invalid login credentials. Please try again.";

          if (data.errors && typeof data.errors === "object") {
            const errorMessages = Object.values(data.errors).flat();
            errorMessage = errorMessages.join("\n");
          } else if (data.message) {
            errorMessage = data.message;
          }

          Alert.alert("Login Failed", errorMessage);
        } else {
          Alert.alert(
            "Login Failed",
            data.message || "An unexpected error occurred"
          );
        }
      } else {
        Alert.alert(
          "Login Failed",
          "An unexpected error occurred. Please check your internet connection and try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logo}
            />
          </View>
          <ThemedText style={styles.title}>Welcome Back!</ThemedText>
          <View style={styles.formContainer}>
            <View
              style={[styles.inputContainer, { backgroundColor: surfaceColor }]}
            >
              <TextInput
                style={[styles.input, { color: textColor }]}
                placeholder="Email"
                placeholderTextColor={placeholderColor}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View
              style={[styles.inputContainer, { backgroundColor: surfaceColor }]}
            >
              <TextInput
                style={[styles.input, { color: textColor }]}
                placeholder="Password"
                placeholderTextColor={placeholderColor}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: primaryColor }]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <ThemedText style={styles.buttonText}>
                {isLoading ? "Logging in..." : "Log In"}
              </ThemedText>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Forgot Password",
                "Under development. Come back later."
              );
            }}
          >
            <ThemedText style={styles.forgotPassword}>
              Forgot Password?
            </ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    minHeight: height,
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    maxWidth: 300,
    marginBottom: 20,
  },
  inputContainer: {
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
  },
  input: {
    height: 50,
    paddingHorizontal: 15,
  },
  button: {
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPassword: {
    marginTop: 20,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
