import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LandingPage() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  const primaryColor = useThemeColor({}, 'tint');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      <ThemedView style={styles.content}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <ThemedText style={styles.title}>Welcome to Campaign With Us</ThemedText>
        <ThemedText style={styles.subtitle}>Connect with your constituency</ThemedText>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: primaryColor }]}
            onPress={() => router.push('/login')}
          >
            <ThemedText style={styles.buttonText}>Login</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: primaryColor }]}
            onPress={() => router.push('/register')}
          >
            <ThemedText style={styles.buttonText}>Register</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});