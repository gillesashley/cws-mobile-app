import { AuthStateEnum, useAuthContext } from "@/components/AuthProvider";
import { LoadingState } from "@/components/profile-page/LoadingState";
import { Redirect } from "expo-router";
import { useEffect } from "react";

export default function Index() {
    const { isAuthenticated, stateEnum } = useAuthContext();

    if (stateEnum === AuthStateEnum.UN_INITIALIZED) {
        return <LoadingState />;
    }

    if (isAuthenticated) {
        return <Redirect href="/(tabs)/home" />;
    } else {
        return <Redirect href="/landing" />;
    }
}
