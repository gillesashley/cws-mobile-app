import { API_BASE_URL } from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthState {
  token: string | null;
  user: any | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: FormData) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
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
        const parsedAuthState = JSON.parse(storedAuthState);
        setAuthState(parsedAuthState);
        // Set the default Authorization header for all future requests
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${parsedAuthState.token}`;
      }
    } catch (error) {
      console.error("Error loading auth state:", error);
    }
  };

  const saveAuthState = async (newAuthState: AuthState) => {
    try {
      await AsyncStorage.setItem("authState", JSON.stringify(newAuthState));
      setAuthState(newAuthState);
      // Set the default Authorization header for all future requests
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${newAuthState.token}`;
    } catch (error) {
      console.error("Error saving auth state:", error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });
      const { token, user } = response.data;
      await saveAuthState({ token, user });
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 422) {
          // Validation error
          const validationErrors = error.response.data.errors;
          console.error("Validation errors:", validationErrors);

          // Create a user-friendly error message
          const errorMessages = Object.values(validationErrors).flat();
          const errorMessage = errorMessages.join("\n");

          // You can use Alert.alert here if you're in a React component
          // Alert.alert("Login Failed", errorMessage);

          // Or you can throw an error to be caught by the component using this function
          throw new Error(errorMessage);
        } else {
          console.error("Login error:", error.response.data);
          throw new Error(
            error.response.data.message || "An unexpected error occurred"
          );
        }
      } else {
        console.error("Login error:", error);
        throw new Error("An unexpected error occurred");
      }
    }
  };

  const register = async (userData: FormData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const { token, user } = response.data;
      await saveAuthState({ token, user });
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
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
      // Remove the Authorization header
      delete axios.defaults.headers.common["Authorization"];
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isAuthenticated = authState.token !== null;

  const contextValue: AuthContextType = {
    isAuthenticated,
    user: authState.user,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
