import { Input } from "@/components/ui/Input";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

interface CredentialsStepProps {
    onChange: (data: { name: string; email: string; password: string; password_confirmation: string }) => void;
    initialData: { name: string; email: string; password: string };
}

export default function CredentialsStep({ onChange, initialData }: CredentialsStepProps) {
    const [name, setName] = useState(initialData.name);
    const [email, setEmail] = useState(initialData.email);
    const [password, setPassword] = useState(initialData.password);
    const [password_confirmation, setPasswordConfirmation] = useState(initialData.password);

    useEffect(() => {
        onChange({ name, email, password, password_confirmation });
    }, [name, email, password, password_confirmation]);

    const handleNext = () => {
        if (password !== password_confirmation) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }
    };

    return (
        <View style={styles.container}>
            <Input label="Name" value={name} onChangeText={setName} placeholder="Enter your name" />
            <Input label="Email" value={email} onChangeText={setEmail} placeholder="Enter your email" keyboardType="email-address" />
            <Input label="Password" value={password} onChangeText={setPassword} placeholder="Enter your password" secureTextEntry />
            <Input
                label="Confirm Password"
                value={password_confirmation}
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
