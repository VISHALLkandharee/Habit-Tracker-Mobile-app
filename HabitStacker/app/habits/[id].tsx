import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useHabits } from '../../src/context/HabitContext';
import { COLORS } from '../../src/constants/Config';
import { Ionicons } from '@expo/vector-icons';

export default function HabitDetails() {
  const { id } = useLocalSearchParams();
  const { habits, deleteHabit } = useHabits();
  const router = useRouter();
  
  const habit = habits.find(h => h._id === id);

  if (!habit) return null;

  const handleDelete = () => {
    Alert.alert("Delete Habit", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
          await deleteHabit(habit._id);
          router.back();
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: habit.color || COLORS.primary }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{habit.title}</Text>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Current Streak</Text>
          <Text style={styles.statValue}>{habit.currentStreak} Days</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Best Streak</Text>
          <Text style={styles.statValue}>{habit.longestStreak} Days</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.desc}>{habit.description || "No description provided."}</Text>

      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Ionicons name="trash-outline" size={20} color={COLORS.error} />
        <Text style={styles.deleteText}>Delete Habit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { height: 200, justifyContent: 'center', alignItems: 'center', paddingTop: 40 },
  backBtn: { position: 'absolute', top: 50, left: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  statsCard: { flexDirection: 'row', backgroundColor: 'white', margin: 20, borderRadius: 12, padding: 20, marginTop: -30, elevation: 4 },
  stat: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 12, color: COLORS.gray, textTransform: 'uppercase' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 20, marginTop: 20 },
  desc: { fontSize: 16, color: COLORS.gray, margin: 20, lineHeight: 24 },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 'auto', marginBottom: 40 },
  deleteText: { color: COLORS.error, fontWeight: '600', marginLeft: 8 }
});