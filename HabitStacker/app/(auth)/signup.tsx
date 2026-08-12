import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { InputField } from '../../src/components/InputField';
import { COLORS, GRADIENTS, SHADOWS } from '../../src/constants/Config';
import { useRouter } from 'expo-router';
import { showAlert } from '../../src/utils/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password) {
      return showAlert("Empty Fields", "Every journey starts with a name. Please fill all fields.");
    }
    
    setIsLoading(true);
    try {
      await signUp(form);
      router.replace('/(tabs)');
    } catch (error: any) {
      showAlert("Signup Failed", error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Join the Community</Text>
          <Text style={styles.subtitle}>Start stacking small wins today.</Text>
        </View>

        <View style={styles.form}>
          <InputField 
            label="Full Name" 
            placeholder="John Doe"
            value={form.name} 
            onChangeText={(t: string) => setForm({...form, name: t})} 
          />
          <View style={{ height: 16 }} />
          <InputField 
            label="Email Address" 
            placeholder="name@example.com"
            value={form.email} 
            onChangeText={(t: string) => setForm({...form, email: t})} 
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <View style={{ height: 16 }} />
          <InputField 
            label="Create Password" 
            placeholder="Min. 6 characters"
            value={form.password} 
            onChangeText={(t: string) => setForm({...form, password: t})} 
            secureTextEntry 
          />
          
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleSignup}
            disabled={isLoading}
          >
            <LinearGradient colors={GRADIENTS.primary} style={styles.buttonGradient}>
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Get Started</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.terms}>
          <Text style={styles.termsText}>
            By signing up, you agree to our Terms and Privacy Policy.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flexGrow: 1, padding: 32, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    ...SHADOWS.sm,
  },
  header: { marginBottom: 32 },
  title: { fontSize: 32, fontWeight: 'bold', color: COLORS.text, letterSpacing: -1 },
  subtitle: { fontSize: 16, color: COLORS.textSecondary, marginTop: 8 },
  form: { width: '100%' },
  button: { marginTop: 32, borderRadius: 16, overflow: 'hidden', ...SHADOWS.md },
  buttonDisabled: { opacity: 0.7 },
  buttonGradient: { padding: 18, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  terms: { marginTop: 40, alignItems: 'center' },
  termsText: { color: COLORS.gray, fontSize: 13, textAlign: 'center', lineHeight: 20 }
});