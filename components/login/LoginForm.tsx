import { useAuthContext } from "@/components/AuthProvider";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthContext();

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
      const success = await login(email, password);
      if (success) {
        onLoginSuccess();
      } else {
        Alert.alert("Error", "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: "100%",
    maxWidth: 300,
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
});

export default LoginForm;