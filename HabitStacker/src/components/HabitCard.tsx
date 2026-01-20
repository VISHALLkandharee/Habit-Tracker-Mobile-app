import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../constants/Config";
import { Ionicons } from "@expo/vector-icons";
import { Habit } from "../types/api";

interface Props {
  habit: Habit;
  onToggle: () => void;
  onPress: () => void;
}

export const HabitCard = ({ habit, onToggle, onPress }: Props) => {
  const isCompletedToday = habit.CompletedDates.some(
    (date) => new Date(date).toDateString() === new Date().toDateString(),
  );

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View
        style={[
          styles.statusLine,
          { backgroundColor: habit.color || COLORS.primary },
        ]}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{habit.title}</Text>
        <View style={styles.streakRow}>
          <Ionicons name="flame" size={16} color="#f59e0b" />
          <Text style={styles.streakText}>
            {habit.currentStreak} day streak
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[
          styles.checkbox,
          isCompletedToday && {
            backgroundColor: habit.color || COLORS.primary,
          },
        ]}
        onPress={onToggle}
      >
        {isCompletedToday && (
          <Ionicons name="checkmark" size={20} color="white" />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    overflow: "hidden",
    elevation: 2,
  },
  statusLine: { width: 6, height: "100%" },
  content: { flex: 1, padding: 16 },
  title: { fontSize: 16, fontWeight: "bold", color: COLORS.text },
  streakRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  streakText: { fontSize: 14, color: COLORS.gray, marginLeft: 4 },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
