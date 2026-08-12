import React, { memo, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { COLORS, SHADOWS } from "../constants/Config";
import { Ionicons } from "@expo/vector-icons";
import { Habit } from "../types/api";
import { isCompletedToday as checkIsCompletedToday } from "../utils/dateUtils";
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  habit: Habit;
  onToggle: () => void;
  onPress: () => void;
}

export const HabitCard = memo(({ habit, onToggle, onPress }: Props) => {
  const isCompletedToday = useMemo(() =>
    checkIsCompletedToday(habit.CompletedDates),
    [habit.CompletedDates]
  );

  const habitColor = habit.color || COLORS.primary;
  const habitIcon  = (habit.icon as any) || "star-outline";

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.card, SHADOWS.sm]}
      onPress={onPress}
    >
      {/* Left accent bar */}
      <View style={[styles.statusLine, { backgroundColor: habitColor }]} />

      {/* Icon badge */}
      <View style={[styles.iconBadge, { backgroundColor: habitColor + '18' }]}>
        <Ionicons name={habitIcon} size={20} color={habitColor} />
      </View>

      {/* Text content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{habit.title}</Text>
        <View style={styles.metaRow}>
          {/* Streak pill */}
          <LinearGradient
            colors={['#f59e0b', '#d97706']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.flameBadge}
          >
            <Ionicons name="flame" size={11} color="#fff" />
            <Text style={styles.streakText}>{habit.currentStreak}d</Text>
          </LinearGradient>

          {/* Category pill */}
          {habit.category ? (
            <View style={styles.categoryPill}>
              <Text style={styles.categoryText}>{habit.category}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Checkbox */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onToggle}
        style={styles.checkboxWrapper}
      >
        {isCompletedToday ? (
          <LinearGradient
            colors={[habitColor, habitColor + 'CC']}
            style={styles.checkboxActive}
          >
            <Ionicons name="checkmark" size={18} color="white" />
          </LinearGradient>
        ) : (
          <View style={[styles.checkboxInactive, { borderColor: habitColor + '60' }]} />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: 18,
    marginBottom: 14,
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Platform.OS === 'ios' ? 'transparent' : COLORS.border + '20',
  },
  statusLine: {
    width: 5,
    height: "100%",
    opacity: 0.85,
  },
  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  content: {
    flex: 1,
    paddingVertical: 16,
    paddingLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  flameBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  streakText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
  categoryPill: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  checkboxWrapper: {
    padding: 16,
  },
  checkboxActive: {
    width: 34,
    height: 34,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.md,
  },
  checkboxInactive: {
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: COLORS.background,
  },
});
