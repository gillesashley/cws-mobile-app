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
  token: string | null;
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

  useEffect(() => {
    if (authState.token) {
      setAxiosDefaultHeaders(authState.token);
    }
  }, [authState.token]);

  const loadAuthState = async () => {
    try {
      const storedAuthState = await AsyncStorage.getItem("authState");
      if (storedAuthState) {
        const parsedAuthState = JSON.parse(storedAuthState);
        setAuthState(parsedAuthState);
        setAxiosDefaultHeaders(parsedAuthState.token);
      }
    } catch (error) {
      console.error("Error loading auth state:", error);
    }
  };

  const setAxiosDefaultHeaders = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  const saveAuthState = async (newAuthState: AuthState) => {
    try {
      await AsyncStorage.setItem("authState", JSON.stringify(newAuthState));
      setAuthState(newAuthState);
      setAxiosDefaultHeaders(newAuthState.token);
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
      await saveAuthState({ token, user: { ...user, token } });
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
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
      await axios.post(`${API_BASE_URL}/logout`);
      await AsyncStorage.removeItem("authState");
      setAuthState({ token: null, user: null });
      setAxiosDefaultHeaders(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isAuthenticated = authState.token !== null;

  const contextValue: AuthContextType = {
    isAuthenticated: authState.token !== null,
    user: authState.user,
    token: authState.token,
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
