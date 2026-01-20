import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { HabitProvider } from '../src/context/HabitContext';
import { ActivityIndicator, View } from 'react-native';

function RootNavigation() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Check if we are inside the (auth) group folder
    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // If no user and not in auth, go to login
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // If user exists and we're in auth, go to main app
      router.replace('/(tabs)');
    }
  }, [user, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <HabitProvider>
        <RootNavigation />
      </HabitProvider>
    </AuthProvider>
  );
}