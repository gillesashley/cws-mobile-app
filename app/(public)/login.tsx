import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
	Alert,
	Dimensions,
	Image,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthContext } from '@/components/AuthProvider';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useForm, Controller } from 'react-hook-form';
import useSWRMutation from 'swr/dist/mutation';
const { height } = Dimensions.get('window');

export default function Login() {
	const { control, handleSubmit } = useForm({
		defaultValues: {
			email: 'user1_11@example.com' as any as string,
			password: 'password' as any as string,
		},
	});
type Creds = Parameters<Parameters<typeof handleSubmit>[0]>[0]
	const { login, } = useAuthContext();
	const {
		trigger: mxLogin,
		isMutating: isLoading,
		error,
	} = useSWRMutation('/login', (_key,{arg}:{arg:Creds}) => login(arg.email,arg.password));
	const router = useRouter();

	const backgroundColor = useThemeColor({}, 'background');
	const textColor = useThemeColor({}, 'text');
	const primaryColor = useThemeColor({}, 'tint');
	const surfaceColor = useThemeColor({}, 'surface');
	const placeholderColor = useThemeColor({}, 'placeholder');

	const handleLogin = async (creds: Creds) => {
		if (Object.values(creds).some(c => ['', null, undefined].includes(c))) {
			Alert.alert('Error', 'Please fill in all fields');
			return;
		}

    mxLogin(creds).then(()=>router.replace('/home'))
    .catch(()=>Alert.alert('Error', 'Login failed. Please check your credentials and try again.'))

	};

	return (
		<SafeAreaView style={[styles.container, { backgroundColor }]}>
			<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView}>
				<ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
					<View style={styles.logoContainer}>
						<Image source={require('@/assets/images/logo.png')} style={styles.logo} />
					</View>
					<ThemedText style={styles.title}>Welcome Back!</ThemedText>
					<View style={styles.formContainer}>
						<View style={[styles.inputContainer, { backgroundColor: surfaceColor }]}>
							<Controller
								control={control}
								name="email"
								render={({ field }) => (
									<TextInput
										style={[styles.input, { color: textColor }]}
										placeholder="Email"
										placeholderTextColor={placeholderColor}
										value={field.value}
										onChangeText={field.onChange}
										keyboardType="email-address"
										autoCapitalize="none"
									/>
								)}
							/>
						</View>
						<View style={[styles.inputContainer, { backgroundColor: surfaceColor }]}>
							<Controller
								name="password"
								control={control}
								render={({ field }) => (
									<TextInput
										style={[styles.input, { color: textColor }]}
										placeholder="Password"
										placeholderTextColor={placeholderColor}
										value={field.value}
										onChangeText={field.onChange}
										secureTextEntry
									/>
								)}
							/>
						</View>
						<TouchableOpacity
							style={[styles.button, { backgroundColor: primaryColor }]}
							onPress={handleSubmit(handleLogin)}
							disabled={isLoading}
						>
							<ThemedText style={styles.buttonText}>{isLoading ? 'Logging in...' : 'Login'}</ThemedText>
						</TouchableOpacity>
					</View>
					<TouchableOpacity onPress={() => router.push('/register')}>
						<ThemedText style={styles.forgotPassword}>Register</ThemedText>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							Alert.alert('Forgot Password', 'Under development. Come back later.');
						}}
					>
						<ThemedText style={styles.forgotPassword}>Forgot Password?</ThemedText>
					</TouchableOpacity>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	keyboardAvoidingView: {
		flex: 1,
	},
	scrollViewContent: {
		flexGrow: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 0,
		minHeight: height,
	},
	logoContainer: {
		marginBottom: 20,
		alignItems: 'center',
	},
	logo: {
		width: 120,
		height: 120,
		resizeMode: 'contain',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 30,
		textAlign: 'center',
	},
	formContainer: {
		width: '100%',
		maxWidth: 300,
		marginBottom: 20,
	},
	inputContainer: {
		borderRadius: 10,
		marginBottom: 15,
		overflow: 'hidden',
	},
	input: {
		height: 50,
		paddingHorizontal: 15,
	},
	button: {
		height: 50,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 20,
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
	forgotPassword: {
		color: 'grey',
		marginTop: 20,
		textAlign: 'center',
		fontSize: 14,
		textDecorationLine: 'underline',
	},
});
