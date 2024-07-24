import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthContext } from "@/components/AuthProvider";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/ui/Button";
import { useThemeColor } from "@/hooks/useThemeColor";

import CredentialsStep from "@/components/registration/CredentialsStep";
import LocationStep from "@/components/registration/LocationStep";
import VerificationStep from "@/components/registration/VerificationStep";

enum RegistrationStep {
  Credentials = 1,
  Location = 2,
  Verification = 3,
}

export default function Register() {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(
    RegistrationStep.Credentials
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    regionId: "",
    constituencyId: "",
    phone: "",
    dateOfBirth: new Date(),
    ghanaCardId: "",
    ghanaCardImage: null as string | null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuthContext();
  const router = useRouter();
  const backgroundColor = useThemeColor({}, "background");

  const handleStepComplete = (stepData: Partial<typeof formData>) => {
    setFormData({ ...formData, ...stepData });
    if (currentStep < RegistrationStep.Verification) {
      setCurrentStep(currentStep + 1);
    } else {
      handleRegister();
    }
  };

  const handlePrevious = () => {
    if (currentStep > RegistrationStep.Credentials) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const registrationData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'dateOfBirth') {
          registrationData.append(key, (value as Date).toISOString().split('T')[0]);
        } else if (key === 'ghanaCardImage' && value) {
          const uriParts = (value as string).split('.');
          const fileType = uriParts[uriParts.length - 1];
          registrationData.append('ghana_card_image', {
            uri: value,
            name: `ghana_card.${fileType}`,
            type: `image/${fileType}`,
          } as any);
        } else {
          registrationData.append(key, value as string);
        }
      });

      const success = await register(registrationData);
      if (success) {
        Alert.alert("Success", "Registration successful", [
          { text: "OK", onPress: () => router.replace("/login") },
        ]);
      } else {
        Alert.alert("Registration Failed", "Please try again");
      }
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case RegistrationStep.Credentials:
        return (
          <CredentialsStep
            onComplete={handleStepComplete}
            initialData={formData}
          />
        );
      case RegistrationStep.Location:
        return (
          <LocationStep
            onComplete={handleStepComplete}
            initialData={formData}
          />
        );
      case RegistrationStep.Verification:
        return (
          <VerificationStep
            onComplete={handleStepComplete}
            initialData={formData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        <ThemedText style={styles.title}>
          Register - Step {currentStep} of 3
        </ThemedText>
        {renderStep()}
        <View style={styles.navigationButtons}>
          {currentStep > RegistrationStep.Credentials && (
            <Button
              title="Previous"
              onPress={handlePrevious}
              style={styles.button}
            />
          )}
          {currentStep < RegistrationStep.Verification && (
            <Button
              title="Next"
              onPress={() => handleStepComplete({})}
              style={styles.button}
            />
          )}
          {currentStep === RegistrationStep.Verification && (
            <Button
              title={isLoading ? "Registering..." : "Complete Registration"}
              onPress={handleRegister}
              disabled={isLoading}
              style={styles.button}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});
