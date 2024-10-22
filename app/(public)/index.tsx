import { Redirect } from "expo-router";

import { useAuthContext } from "@/components/AuthProvider";

export default function Index() {
    const { isAuthenticated, stateEnum } = useAuthContext();

    if (isAuthenticated) {
        return <Redirect href="/(tabs)/home" />;
    } else {
        return <Redirect href="/landing" />;
    }
}
