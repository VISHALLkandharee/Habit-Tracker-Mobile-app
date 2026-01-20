import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Alert, ActivityIndicator } from "react-native";
import { useHabits } from "../../src/context/HabitContext";
import { InputField } from "../../src/components/InputField";
import { useRouter } from "expo-router";
import { COLORS } from "../../src/constants/Config";

export default function AddHabit() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reminderTime, setReminderTime] = useState(""); // Optional, e.g., "08:00"
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addHabit } = useHabits();
  const router = useRouter();

const handleSave = async () => {
  // 1. Title validation (Frontend check)
  if (title.length < 5) {
    return Alert.alert("Error", "Title must be at least 5 characters long");
  }

  // 2. Description validation (Frontend check)
  if (description.length < 5) {
    return Alert.alert("Error", "Description must be at least 5 characters long");
  }
  
  try {
    await addHabit({ 
      title: title, 
      description: description, 
      status: "active", // Must be "active" or "compromised" per Zod
      reminderTime: "08:00", // MUST be HH:mm (24-hour format)
    });
    router.back();
  } catch (error: any) {
    // If Zod still fails, this will show the EXACT field that is wrong
    const validationErrors = error.response?.data?.errors;
    const firstErrorMessage = validationErrors?.[0]?.message || "Validation Failed";
    
    Alert.alert("Server Error", firstErrorMessage);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>New Habit</Text>
      
      <InputField
        label="Habit Title"
        placeholder="e.g. Drink Water"
        value={title}
        onChangeText={setTitle}
      />
      
      <InputField
        label="Description (Optional)"
        placeholder="e.g. 2 Liters a day"
        value={description}
        onChangeText={setDescription}
      />

      <InputField
        label="Reminder Time (Optional)"
        placeholder="e.g. 09:00 AM"
        value={reminderTime}
        onChangeText={setReminderTime}
      />

      <TouchableOpacity 
        style={[styles.saveBtn, isSubmitting && styles.disabledBtn]} 
        onPress={handleSave}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>Create Habit</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 30,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  disabledBtn: {
    opacity: 0.7,
  },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
});