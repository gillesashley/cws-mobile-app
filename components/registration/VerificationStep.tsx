import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

interface VerificationStepProps {
    onChange: (data: { phone: string; dateOfBirth: Date; ghanaCardId: string; ghanaCardImage: string | null }) => void;
    initialData: {
        phone: string;
        dateOfBirth: Date;
        ghanaCardId: string;
        ghanaCardImage: string | null;
    };
}

export default function VerificationStep({ onChange, initialData }: VerificationStepProps) {
    const [phone, setPhone] = useState(initialData.phone);
    const [dateOfBirth, setDateOfBirth] = useState(initialData.dateOfBirth);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [ghanaCardId, setGhanaCardId] = useState(initialData.ghanaCardId);
    const [ghanaCardImage, setGhanaCardImage] = useState(initialData.ghanaCardImage);

    useEffect(() => {
        onChange({ phone, dateOfBirth, ghanaCardId, ghanaCardImage });
    }, [phone, dateOfBirth, ghanaCardId, ghanaCardImage]);

    const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDateOfBirth(selectedDate);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setGhanaCardImage(result.assets[0].uri);
        }
    };

    const handleComplete = () => {
        onChange({ phone, dateOfBirth, ghanaCardId, ghanaCardImage });
    };

    return (
        <View style={styles.container}>
            <Input label="Phone Number" value={phone} onChangeText={setPhone} placeholder="Enter your phone number" keyboardType="phone-pad" />
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <ThemedText>Date of Birth: {dateOfBirth.toDateString()}</ThemedText>
            </TouchableOpacity>
            {showDatePicker && <DateTimePicker value={dateOfBirth} mode="date" display="default" onChange={handleDateChange} />}
            <Input label="Ghana Card ID" value={ghanaCardId} onChangeText={setGhanaCardId} placeholder="Enter your Ghana Card ID" />
            <Button title="Upload Ghana Card Image" onPress={pickImage} />
            {ghanaCardImage && <Image source={{ uri: ghanaCardImage }} style={styles.image} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        width: 200,
        height: 150,
        resizeMode: "contain",
        marginTop: 10,
    },
});
