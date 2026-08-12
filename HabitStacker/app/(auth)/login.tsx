import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { InputField } from '../../src/components/InputField';
import { COLORS, GRADIENTS, SHADOWS } from '../../src/constants/Config';
import { Link } from 'expo-router';
import { showAlert } from '../../src/utils/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) return showAlert("Missing Info", "Please enter both email and password.");
    
    setIsLoading(true);
    try {
      await signIn({ email, password });
    } catch (error: any) {
      showAlert("Login Failed", error.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <LinearGradient colors={GRADIENTS.primary} style={styles.logoCircle}>
            <Ionicons name="infinite" size={40} color="white" />
          </LinearGradient>
          <Text style={styles.title}>HabitStacker</Text>
          <Text style={styles.subtitle}>Build the life you want, one stack at a time.</Text>
        </View>

        <View style={styles.form}>
          <InputField 
            label="Email Address" 
            placeholder="name@example.com"
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none" 
            keyboardType="email-address"
          />
          <View style={{ height: 16 }} />
          <InputField 
            label="Password" 
            placeholder="••••••••"
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry 
          />
          
          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <LinearGradient colors={GRADIENTS.primary} style={styles.buttonGradient}>
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>New to the journey? </Text>
          <Link href="/(auth)/signup" asChild>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Create Account</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flexGrow: 1, padding: 32, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 48 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    ...SHADOWS.md,
  },
  title: { fontSize: 32, fontWeight: 'bold', color: COLORS.text, letterSpacing: -1 },
  subtitle: { fontSize: 16, color: COLORS.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 22 },
  form: { width: '100%' },
  forgotBtn: { alignSelf: 'flex-end', marginTop: 12 },
  forgotText: { color: COLORS.primary, fontWeight: '600', fontSize: 14 },
  button: { marginTop: 32, borderRadius: 16, overflow: 'hidden', ...SHADOWS.md },
  buttonDisabled: { opacity: 0.7 },
  buttonGradient: { padding: 18, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 40 },
  footerText: { color: COLORS.textSecondary, fontSize: 15 },
  footerLink: { color: COLORS.primary, fontWeight: 'bold', fontSize: 15 }
});