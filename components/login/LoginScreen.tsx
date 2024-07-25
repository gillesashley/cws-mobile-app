import React from "react";
import { Image, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import LoginForm from "./LoginForm";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, "background");

  const handleLoginSuccess = () => {
    router.replace("/(tabs)/home");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
          />
        </View>
        <ThemedText style={styles.title}>Welcome Back!</ThemedText>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
        <TouchableOpacity
          onPress={() => {
            /* Handle forgot password */
          }}
        >
          <ThemedText style={styles.forgotPassword}>
            Forgot Password?
          </ThemedText>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
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
    marginTop: 20,
  },
  forgotPassword: {
    marginTop: 20,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});

export default LoginScreen;