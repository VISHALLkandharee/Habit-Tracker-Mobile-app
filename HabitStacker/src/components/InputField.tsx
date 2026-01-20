import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../constants/Config';

export const InputField = ({ label, ...props }: any) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} placeholderTextColor="#94a3b8" {...props} />
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#e2e8f0', padding: 12, borderRadius: 8, fontSize: 16, backgroundColor: '#fff' }
});