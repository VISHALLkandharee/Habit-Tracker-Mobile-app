import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { InputField } from '../../src/components/InputField';
import { COLORS } from '../../src/constants/Config';
import { Link } from 'expo-router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  const handleLogin = async () => {
    try {
      await signIn({ email, password });
    } catch (error: any) {
      Alert.alert("Login Failed", error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <InputField label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <InputField label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Link href="/auth/signup" asChild>
        <TouchableOpacity style={styles.link}><Text>Don't have an account? Sign Up</Text></TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: COLORS.background },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 32, color: COLORS.text },
  button: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: { marginTop: 24, alignItems: 'center' }
});