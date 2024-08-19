import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { AuthProvider } from '@/components/AuthProvider';
import { ExpoErrorBoundary } from '@/components/ErrorBoundary';
import { UserDataProvider } from '@/components/UserDataContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useCustomFonts } from '@/hooks/useCustomFonts';
import { StatusBar } from 'expo-status-bar';
import { SWRConfig } from 'swr';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const { fontsLoaded, fontError } = useCustomFonts();

	useEffect(() => {
		if (fontsLoaded || fontError) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded, fontError]);

	if (!fontsLoaded && !fontError) {
		return null;
	}

	return (
		<UserDataProvider>
			<ExpoErrorBoundary>
				<SWRConfig>
					<AuthProvider>
						<SafeAreaProvider>
							<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
								<SafeAreaView style={{ flex: 1 }} edges={['right', 'bottom', 'left']}>
									<StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} backgroundColor="transparent" translucent />
									<Stack>
										<Stack.Screen name="index" options={{ headerShown: false }} />
										<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
										<Stack.Screen name="landing" options={{ headerShown: false }} />
										<Stack.Screen name="login" options={{ title: 'Login' }} />
										<Stack.Screen name="register" options={{ title: 'Register' }} />
										<Stack.Screen name="full-post" options={{ headerShown: false }} />
										<Stack.Screen name="+not-found" />
									</Stack>
								</SafeAreaView>
							</ThemeProvider>
						</SafeAreaProvider>
					</AuthProvider>
				</SWRConfig>
			</ExpoErrorBoundary>
		</UserDataProvider>
	);
}
