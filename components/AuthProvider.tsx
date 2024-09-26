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
	saveAuthState: (data:Partial<AuthState>)=>Promise<void>;
	
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

		const requestInterceptor = axios.interceptors.request.use(
			(config) => {
				const { url, method } = config;
				console.log("cws::network_request:", [method, '---', url].join(' '));
				return config;
			},
			(error) => {
				return Promise.reject(error);
			}
		);

		const responseInterceptor = axios.interceptors.response.use(
			(response) => {
				console.log("cws::network_response:", [
					response.config.method,
					response.status,
					response.config.url,
				].join(' '));
				return response;
			},
			(error) => {
				if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
					
					setAuthState((past) => ({ ...past, error: error.response?.data }));
				}
				return Promise.reject(error);
			}
		);

		return () => {
			axios.interceptors.request.eject(requestInterceptor);
			axios.interceptors.response.eject(responseInterceptor);
		};

	}, []);


	const saveAuthState = async (newAuthStateData: AuthState) => {
		try {
			await AsyncStorage.setItem("authState", JSON.stringify({data:newAuthStateData}));
			setAuthState(prev=>({data:{...prev?.data,...newAuthStateData}}));
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
			console.log({storedAuthState})
			const parsedAuthState = JSON.parse(storedAuthState??'{data:null}');
			if (parsedAuthState) {
				const data = ({data:{user:null,token:null,error:null,...parsedAuthState?.data}})
				saveAuthState(data.data);
			}
		} catch (error) {
			console.error("Error loading auth state:", error);
			saveAuthState({token:undefined,user:undefined,error:undefined})
		}
	};

	if (authState?.data ===undefined){
		return <LoadingState />
	}

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
	
		isAuthenticated,
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

	
	if (stateEnum===AuthStateEnum.UN_AUTHENTICATED){
		return <Redirect href={'/login'} />
	}
	return children
}

export const WhenNotAuthed=({children})=>{
	const {stateEnum}=useAuthContext()

	
	
	if (stateEnum===AuthStateEnum.AUTHENTICATED){
		return <Redirect href={'/(tabs)/home'} />
	}
	return children
}

