import { useAuthContext } from "@/components/AuthProvider";
import { Redirect } from "expo-router";

export default function Index() {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  } else {
    return <Redirect href="/landing" />;
  }
}
