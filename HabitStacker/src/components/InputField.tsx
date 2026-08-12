import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../constants/Config';

export const InputField = React.memo(({ label, containerStyle, onFocus, onBlur, ...props }: any) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View 
        style={[
          styles.inputWrapper, 
          isFocused && styles.inputWrapperFocused
        ]}
      >
        <TextInput 
          style={styles.input} 
          placeholderTextColor="#94a3b8" 
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props} 
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { 
    width: '100%',
  },
  label: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: COLORS.text, 
    marginBottom: 10,
    marginLeft: 4,
  },
  inputWrapper: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  inputWrapperFocused: {
    borderColor: COLORS.primary,
    backgroundColor: '#fff',
  },
  input: { 
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16, 
    color: COLORS.text,
    fontWeight: '500',
  }
});