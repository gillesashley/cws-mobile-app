import { WhenNotAuthed } from "@/components/AuthProvider";
import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <WhenNotAuthed>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="landing" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ title: "Login" }} />
                <Stack.Screen name="register" options={{ title: "Register" }} />
            </Stack>
        </WhenNotAuthed>
    );
}
