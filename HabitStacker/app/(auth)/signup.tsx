import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { InputField } from '../../src/components/InputField';
import { COLORS } from '../../src/constants/Config';
import { useRouter } from 'expo-router';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password) {
      return Alert.alert("Error", "Please fill all fields");
    }
    try {
      await signUp(form);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert("Signup Failed", error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <InputField label="Full Name" value={form.name} onChangeText={(t: string) => setForm({...form, name: t})} />
      <InputField label="Email" value={form.email} onChangeText={(t: string) => setForm({...form, email: t})} autoCapitalize="none" />
      <InputField label="Password" value={form.password} onChangeText={(t: string) => setForm({...form, password: t})} secureTextEntry />
      
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Join Now</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.link} onPress={() => router.back()}>
        <Text>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, justifyContent: 'center', backgroundColor: COLORS.background },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 32, color: COLORS.text },
  button: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: { marginTop: 24, alignItems: 'center' }
});