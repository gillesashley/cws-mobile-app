import { API_BASE_URL } from "@/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Redirect } from "expo-router";
import React, { createContext, Dispatch, useContext, useEffect, useState } from "react";
import { LoadingState } from "./profile-page/LoadingState";

interface AuthState {
	token: string | null;
	user: any | null;
	error?: any | { message: string };
}

export enum AuthStateEnum { UN_INITIALIZED='UN_INITIALIZED',AUTHENTICATED='AUTHENTICATED',UN_AUTHENTICATED='UN_AUTHENTICATED'}

interface AuthContextType {
	data:AuthState|undefined;
	// setAuthState:Dispatch<React.SetStateAction<AuthState>>;
	saveAuthState: (data:Partial<AuthState>)=>Promise<void>;
	// login: (email: string, password: string) => Promise<boolean>;
	// register: (userData: FormData) => Promise<boolean>;
	// logout: () => Promise<void>;
	// updateUser: (userData: Partial<any>) => Promise<boolean>;
	// error: any | null;
}
const initialCtx = {
	data: undefined as AuthContextType['data']
}

const AuthContext = createContext<AuthContextType>(initialCtx as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [authState, setAuthState] = useState(initialCtx);

	useEffect(() => {
		setAxiosDefaultHeaders(authState?.data?.token);
	}, [authState.data?.token]);

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


	const saveAuthState = async (newAuthState: AuthState) => {
		try {
			await AsyncStorage.setItem("authState", JSON.stringify(newAuthState));
			setAuthState(prev=>({...prev,data:newAuthState}));
			// setAxiosDefaultHeaders(newAuthState.token);
		} catch (error) {
			console.error("Error saving auth state:", error);
		}
	};

	const setAxiosDefaultHeaders = (token: string | null|undefined) => {
		if (token) {
			axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		} else {
			delete axios.defaults.headers.common["Authorization"];
		}
	};

	const loadAuthState = async () => {
		try {
			const storedAuthState = await AsyncStorage.getItem("authState");
			const parsedAuthState = JSON.parse(storedAuthState??'{data:null}');
			if (parsedAuthState) {
				setAuthState(('data' in parsedAuthState)?parsedAuthState:({data:parsedAuthState}));
				// setAxiosDefaultHeaders(parsedAuthState.token);
			}
		} catch (error) {
			console.error("Error loading auth state:", error);
		}
	};


	return <AuthContext.Provider value={{...authState,saveAuthState} as AuthContextType}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
	const {data:authState,saveAuthState} = useContext(AuthContext);
	
	const login = async (email: string, password: string)=> {
		try {
			return axios.post(`${API_BASE_URL}/login`, {
				email,
				password
			}).then(r=>r.data)
			.then(({access_token:token,user})=>saveAuthState({ token, user }));


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
			// const updatedUser = { ...authState?.user, ...userData };
			await saveAuthState(userData);
			return true;
		} catch (error) {
			console.error("Error updating user:", error);
			return false;
		}
	};

	const logout = async (): Promise<void> => {
		try {
			Promise.resolve([axios.post(`${API_BASE_URL}/logout`), await AsyncStorage.removeItem("authState")]);
			saveAuthState({ token: null, user: null });
			// setAxiosDefaultHeaders(null);
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	const refreshUser = () =>
		axios.get("/profile").then((r) => {
			const user = r.data;
			saveAuthState(({  user }));
			return user;
		});

	const isAuthenticated = !!authState?.token;

	const contextValue = {
		...(authState??{}),
		get isAuthenticated() {
			return !authState?.error && [null, undefined, ""].includes(authState?.token);
			// return isAuthenticated;
		},
		get stateEnum(){
			
			if (authState?.token ===undefined){
				return AuthStateEnum.UN_INITIALIZED
			}
			return {true:AuthStateEnum.AUTHENTICATED,false:AuthStateEnum.UN_AUTHENTICATED}[!!(authState?.token)]
		},
		refreshUser,
		login,
		register,
		logout,
		updateUser
	};

	return contextValue;
}


export const WhenAuthed=({children})=>{
	const {stateEnum}=useAuthContext()

	if (stateEnum===AuthStateEnum.UN_INITIALIZED){
		return <LoadingState />
	}
	
	if (stateEnum===AuthStateEnum.UN_AUTHENTICATED){
		return <Redirect href={'/login'} />
	}
	return children
}

export const WhenNotAuthed=({children})=>{
	const {stateEnum}=useAuthContext()

	if (stateEnum===AuthStateEnum.UN_INITIALIZED){
		return <LoadingState />
	}
	
	if (stateEnum===AuthStateEnum.AUTHENTICATED){
		return <Redirect href={'/(tabs)/home'} />
	}
	return children
}

