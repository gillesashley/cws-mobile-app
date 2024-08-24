import {useRouter} from "expo-router";
import React, {useState} from "react";
import {
    Alert,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    ScrollView,
    View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import axios from 'axios';

import {useAuthContext} from "@/components/AuthProvider";
import {ThemedText} from "@/components/ThemedText";
import {Button} from "@/components/ui/Button";
import {useThemeColor} from "@/hooks/useThemeColor";

import CredentialsStep from "@/components/registration/CredentialsStep";
import LocationStep from "@/components/registration/LocationStep";
import VerificationStep from "@/components/registration/VerificationStep";

enum RegistrationStep {
    Credentials = 1,
    Location = 2,
    Verification = 3
}

const {width} = Dimensions.get("window");
const {height} = Dimensions.get("window");

export default function Register() {
    const [currentStep, setCurrentStep] = useState<RegistrationStep>(
        RegistrationStep.Credentials
    );
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation:"",
        regionId: "",
        constituencyId: "",
        phone: "",
        dateOfBirth: new Date(),
        ghanaCardId: "",
        ghanaCardImage: null as string | null,
        area: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const {register} = useAuthContext();
    const router = useRouter();
    const backgroundColor = useThemeColor({}, "background");
    const primaryColor = useThemeColor({}, "primary");

    const onChange = (stepData: Partial<typeof formData>) => {
        console.log({currentStep,stepData})
        setFormData((prev)=>({...prev, ...stepData}));
        // if (currentStep < RegistrationStep.Verification) {
        //     setCurrentStep(currentStep + 1);
        // } else {
        //     handleRegister();
        // }
    };

    const handleNext = (change=0) => {
        // if (currentStep > RegistrationStep.Credentials) {
        //     setCurrentStep(currentStep - 1);
        // }

        const tempNextStep = currentStep+change
        if (!(0<=tempNextStep && tempNextStep<= Object.values(RegistrationStep).length))return;
        setCurrentStep(tempNextStep);
    };

    const handleRegister = async () => {
        setIsLoading(true);
        try {
            const registrationData = new FormData();

            // Append all form fields to FormData
            registrationData.append('name', formData.name);
            registrationData.append('email', formData.email);
            registrationData.append('password', formData.password);
            registrationData.append('password_confirmation', formData.password_confirmation);
            registrationData.append('phone', formData.phone);
            registrationData.append('date_of_birth', formData.dateOfBirth.toISOString().split('T')[0]);
            registrationData.append('ghana_card_id', formData.ghanaCardId);
            registrationData.append('region_id', formData.regionId);
            registrationData.append('constituency_id', formData.constituencyId);
            registrationData.append('area', formData.area);

            // Handle Ghana Card Image
            if (formData.ghanaCardImage) {
                const uriParts = formData.ghanaCardImage.split('.');
                const fileType = uriParts[uriParts.length - 1];
                registrationData.append('ghana_card_image', {
                    uri: formData.ghanaCardImage,
                    name: `ghana_card.${fileType}`,
                    type: `image/${fileType}`,
                } as any);
            }

           
            const success = await register(registrationData);
            if (success) {
                Platform.OS!=='web'?
                Alert.alert("Success", "Registration successful", [
                    {text: "OK", onPress: () => router.replace("/login")},
                ]):window.confirm('Success: Registration successfull') && router.push('/login');
            } else {
                Alert.alert("Registration Failed", "Please try again");
            }
        } catch (error) {
            console.error("Registration error:", error);
            if (axios.isAxiosError(error) && error.response) {
                console.error("Error response:", error.response.data);
                Alert.alert("Error", `Registration failed: ${error.response.data.message || "Unknown error"}`);
            } else {
                Alert.alert("Error", "An unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case RegistrationStep.Credentials:
                return (
                    <CredentialsStep
                        onChange={onChange}
                        initialData={formData}
                    />
                );
            case RegistrationStep.Location:
                return (
                    <LocationStep
                        onChange={onChange}
                        initialData={formData}
                    />
                );
            case RegistrationStep.Verification:
                return (
                    <VerificationStep
                        onChange={onChange}
                        initialData={formData}
                    />
                );
            default:
                return null;
        }
    };

    const renderProgressBar = () => {
        const progress = (currentStep / 3) * 100;
        return (
            <View style={styles.progressBarContainer}>
                <View
                    style={[
                        styles.progressBar,
                        {width: `${progress}%`, backgroundColor: primaryColor},
                    ]}
                />
            </View>
        );
    };

    const getStepTitle = () => {
        switch (currentStep) {
            case RegistrationStep.Credentials:
                return "Credentials";
            case RegistrationStep.Location:
                return "Location";
            case RegistrationStep.Verification:
                return "Verification";
            default:
                return "";
        }
    };

    return (
        <SafeAreaView style={[styles.container, {backgroundColor}]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingView}
            >
                {/*<ScrollView*/}
                {/*    contentContainerStyle={styles.scrollViewContent}*/}
                {/*    keyboardShouldPersistTaps="handled"*/}
                {/*>*/}
                <View style={styles.content}>
                    <Image
                        source={require("@/assets/images/logo.png")}
                        style={styles.logo}
                    />
                    {renderProgressBar()}
                    <ThemedText style={styles.title}>{getStepTitle()}</ThemedText>
                    <ThemedText style={styles.subtitle}>
                        Step {currentStep} of 3
                    </ThemedText>
                    {renderStep()}
                    <View style={styles.navigationButtons}>
                        {currentStep > RegistrationStep.Credentials && (
                            <Button
                                title="Previous"
                                onPress={()=>handleNext(-1)}
                                backgroundColor="#0200FF"
                                style={styles.button}
                            />
                        )}
                        {currentStep < RegistrationStep.Verification && (
                            <Button
                                title="Next"
                                onPress={() => handleNext(1)}
                                backgroundColor="#0200FF"
                                style={styles.button}
                            />
                        )}
                        {currentStep === RegistrationStep.Verification && (
                            <Button
                                title={isLoading ? "Registering..." : "Complete"}
                                onPress={handleRegister}
                                backgroundColor="#0200FF"
                                disabled={isLoading}
                                style={styles.button}
                            />
                        )}
                    </View>
                </View>
                {/*</ScrollView>*/}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 0,
        minHeight: height,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 20,
        textAlign: "center",
        opacity: 0.7,
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: "space-between",
    },
    logo: {
        width: 120,
        height: 120,
        resizeMode: "contain",
        alignSelf: "center",
        marginBottom: 20,
    },
    progressBarContainer: {
        height: 5,
        backgroundColor: "#E0E0E0",
        borderRadius: 15,
        marginBottom: 20,
    },
    progressBar: {
        height: "100%",
        borderRadius: 5,
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
