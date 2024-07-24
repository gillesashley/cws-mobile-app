import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthContext } from "@/components/AuthProvider";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { API_BASE_URL } from "@/config/api";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  Constituency,
  fetchConstituencies,
  fetchRegions,
  Region,
} from "@/services/services";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [ghanaCardId, setGhanaCardId] = useState("");
  const [ghanaCardImage, setGhanaCardImage] = useState<string | null>(null);
  const [regionId, setRegionId] = useState("");
  const [constituencyId, setConstituencyId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [area, setArea] = useState("");

  const { register } = useAuthContext();
  const router = useRouter();

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const primaryColor = useThemeColor({}, "tint");

  const checkPhoneAvailability = async (phone: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/check-phone`, {
        phone,
      });
      return response.data.available;
    } catch (error) {
      console.error("Error checking phone availability:", error);
      return false;
    }
  };

  useEffect(() => {
    const loadRegions = async () => {
      try {
        const fetchedRegions = await fetchRegions();
        setRegions(fetchedRegions);
      } catch (error) {
        console.error("Failed to load regions:", error);
        Alert.alert("Error", "Failed to load regions. Please try again.");
      }
    };

    loadRegions();
  }, []);

  const handleRegionChange = async (itemValue: string) => {
    setRegionId(itemValue);
    setConstituencyId("");
    if (itemValue) {
      try {
        const fetchedConstituencies = await fetchConstituencies(
          Number(itemValue)
        );
        setConstituencies(fetchedConstituencies);
      } catch (error) {
        console.error("Failed to load constituencies:", error);
        Alert.alert(
          "Error",
          "Failed to load constituencies. Please try again."
        );
      }
    } else {
      setConstituencies([]);
    }
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(false);
    setDateOfBirth(currentDate);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setGhanaCardImage(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !passwordConfirmation ||
      !dateOfBirth ||
      !ghanaCardId ||
      !ghanaCardImage ||
      !regionId ||
      !constituencyId
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== passwordConfirmation) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (
      new Date(dateOfBirth) >
      new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000)
    ) {
      Alert.alert("Error", "You must be at least 18 years old to register");
      return;
    }

    // Add the phone availability check here
    const isPhoneAvailable = await checkPhoneAvailability(phone);
    if (!isPhoneAvailable) {
      Alert.alert("Error", "This phone number is already registered.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);
      formData.append("date_of_birth", dateOfBirth.toISOString().split("T")[0]);
      formData.append("ghana_card_id", ghanaCardId);
      formData.append("region_id", regionId);
      formData.append("constituency_id", constituencyId);
      formData.append("area", area);
      formData.append("role", "user");

      if (ghanaCardImage) {
        const uriParts = ghanaCardImage.split(".");
        const fileType = uriParts[uriParts.length - 1];

        formData.append("ghana_card_image", {
          uri: ghanaCardImage,
          name: `ghana_card.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }

      console.log(
        "Sending registration request to:",
        `${API_BASE_URL}/register`
      );
      console.log("Registration data:", formData);

      const success = await register(formData);

      if (success) {
        Alert.alert("Success", "Registration successful", [
          { text: "OK", onPress: () => router.replace("/login") },
        ]);
      } else {
        Alert.alert("Registration Failed", "Please try again");
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error response:", error.response.data);
        if (error.response.status === 422) {
          // Validation error
          const errorMessages = error.response.data.errors;
          Alert.alert(
            "Registration Failed",
            Object.values(errorMessages).flat().join("\n")
          );
        } else {
          Alert.alert("Registration Failed", "An unexpected error occurred");
        }
      } else {
        Alert.alert("Error", "An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
          />
        </View>
        <ThemedText style={styles.title}>Register</ThemedText>
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
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
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
        <ThemedView style={styles.datePickerContainer}>
          <ThemedText style={styles.inputLabel}>Date of Birth</ThemedText>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <ThemedText style={styles.datePickerButtonText}>
              {dateOfBirth.toDateString()}
            </ThemedText>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth}
              mode="date"
              display="default"
              onChange={handleDateChange}
              style={styles.datePicker}
            />
          )}
        </ThemedView>
        <Input
          label="Ghana Card ID"
          value={ghanaCardId}
          onChangeText={setGhanaCardId}
          placeholder="Enter your Ghana Card ID"
        />
        <ThemedView style={styles.imagePickerContainer}>
          <Button title="Upload Ghana Card Image" onPress={pickImage} />
          {ghanaCardImage && (
            <Image source={{ uri: ghanaCardImage }} style={styles.image} />
          )}
        </ThemedView>
        <Picker
          selectedValue={regionId}
          onValueChange={handleRegionChange}
          style={styles.picker}
        >
          <Picker.Item label="Select Region" value="" />
          {regions.map((region) => (
            <Picker.Item
              key={region.id}
              label={region.name}
              value={region.id.toString()}
            />
          ))}
        </Picker>
        <Picker
          selectedValue={constituencyId}
          onValueChange={(itemValue) => setConstituencyId(itemValue)}
          style={styles.picker}
          enabled={!!regionId}
        >
          <Picker.Item label="Select Constituency" value="" />
          {constituencies.map((constituency) => (
            <Picker.Item
              key={constituency.id}
              label={constituency.name}
              value={constituency.id.toString()}
            />
          ))}
        </Picker>
        <Input
          label="Area"
          value={area}
          onChangeText={setArea}
          placeholder="Enter your area"
        />
        <Button
          title={isLoading ? "Registering..." : "Register"}
          onPress={handleRegister}
          disabled={isLoading}
          style={styles.registerButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  imagePickerContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
  picker: {
    marginBottom: 20,
  },
  registerButton: {
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  datePickerButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  datePickerButtonText: {
    fontSize: 16,
  },
  datePicker: {
    width: "100%",
    marginTop: 10,
  },
});
