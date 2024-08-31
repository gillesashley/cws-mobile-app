import { API_BASE_URL } from "@/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthState {
	token: string | null;
	user: any | null;
	error: any | { message: string };
}

interface AuthContextType {
	isAuthenticated: boolean;
	user: any | null;
	token: string | null;
	login: (email: string, password: string) => Promise<boolean>;
	register: (userData: FormData) => Promise<boolean>;
	logout: () => Promise<void>;
	updateUser: (userData: Partial<any>) => Promise<boolean>;
	error: any | null;
}

const AuthContext = createContext<AuthContextType |undefined >(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [authState, setAuthState] =
		useState <
		AuthState >
		({
			token: null,
			user: null,
			error: null
		});

	useEffect(() => {
		loadAuthState();
		axios.interceptors.request.use(
			(config) => {
				const { url, method } = config;
				console.log("cws::network_request:", { method, url });
				return config;
			},
			(error) => {
				return Promise.reject(error);
			}
		);

		axios.interceptors.response.use(
			(response) => {
				console.log("cws::network_response:", {
					url: response.config.url,
					method: response.config.method,
					status: response.status
				});
				return response;
			},
			(error) => {
				if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
					// Handle authorization error here
					// For example, redirect to login page or show an error message
					setAuthState((past) => ({ ...past, error: error.response?.data }));
				}
				return Promise.reject(error);
			}
		);
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
				password
			});
			const { access_token: token, user } = response.data;
			if (token && user) {
				await saveAuthState({ token, user });
				return true;
			} else {
				console.error("Login response missing token or user data");
				return false;
			}
		} catch (error) {
			console.error("Login error:", error);
			return false;
		}
	};

	const register = async (userData: FormData): Promise<boolean> => {
		try {
			const response = await axios.post(`${API_BASE_URL}/register`, userData, {
				headers: {
					"Content-Type": "multipart/form-data"
				}
			});
			const { token, user } = response.data;
			await saveAuthState({ token, user });
			return true;
		} catch (error) {
			console.error("Registration error:", error);
			if (axios.isAxiosError(error) && error.response) {
				console.error("Error response:", error.response.data);
			}
			return false;
		}
	};

	const updateUser = async (userData: Partial<AuthState>) => {
		try {
			const updatedUser = { ...authState.user, ...userData };
			await saveAuthState({ ...authState, user: updatedUser });
			return true;
		} catch (error) {
			console.error("Error updating user:", error);
			return false;
		}
	};

	const logout = async (): Promise<void> => {
		try {
			Promise.resolve([axios.post(`${API_BASE_URL}/logout`), await AsyncStorage.removeItem("authState")]);
			setAuthState({ token: null, user: null });
			setAxiosDefaultHeaders(null);
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	const refreshUser = () =>
		axios.get("/profile").then((r) => {
			const user = r.data;
			setAuthState((prev) => ({ ...prev, user }));
			return user;
		});

	const isAuthenticated = authState.token !== null;

	const contextValue: AuthContextType = {
		...authState,
		get isAuthenticated() {
			return !authState.error && [null, undefined, ""].includes(this.token);
		},
		login,
		register,
		logout,
		updateUser
	};

	return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuthContext must be used within an AuthProvider");
	}
	return context;
}
