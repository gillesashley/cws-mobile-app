import { API_BASE_URL } from "@/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

interface AuthState {
  token: string | null;
  user: any | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    user: null,
  });

  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = async () => {
    try {
      const storedAuthState = await AsyncStorage.getItem("authState");
      if (storedAuthState) {
        setAuthState(JSON.parse(storedAuthState));
      }
    } catch (error) {
      console.error("Error loading auth state:", error);
    }
  };

  const saveAuthState = async (newAuthState: AuthState) => {
    try {
      await AsyncStorage.setItem("authState", JSON.stringify(newAuthState));
      setAuthState(newAuthState);
    } catch (error) {
      console.error("Error saving auth state:", error);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });
      const { token, user } = response.data;
      await saveAuthState({ token, user });
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  }, []);

  const register = useCallback(async (userData: FormData) => {
    try {
      console.log(
        "Sending registration request to:",
        `${API_BASE_URL}/register`
      );
      const response = await axios.post(`${API_BASE_URL}/register`, userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Registration response:", response.data);
      const { token, user } = response.data;
      await saveAuthState({ token, user });
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
        console.error("Error response:", error.response?.data);
        console.error("Error request:", error.request);
      } else {
        console.error("Unexpected error:", error);
      }
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Call your API to invalidate the token if necessary
      await axios.post(
        `${API_BASE_URL}/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${authState.token}` },
        }
      );

      // Clear the stored auth state
      await AsyncStorage.removeItem("authState");
      setAuthState({ token: null, user: null });
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  }, [authState.token]);

  const isAuthenticated = authState.token !== null;

  return {
    isAuthenticated,
    login,
    register,
    logout,
    ...authState
  };
}
