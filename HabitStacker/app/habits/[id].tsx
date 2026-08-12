import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useHabits } from '../../src/context/HabitContext';
import { COLORS, SHADOWS, GRADIENTS } from '../../src/constants/Config';
import { Ionicons } from '@expo/vector-icons';
import { showConfirm } from '../../src/utils/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { isCompletedToday } from '../../src/utils/dateUtils';

export default function HabitDetails() {
  const { id } = useLocalSearchParams();
  const { habits, deleteHabit, toggleComplete } = useHabits();
  const router = useRouter();
  
  const habit = useMemo(() => habits.find(h => h._id === id), [habits, id]);

  if (!habit) return null;

  const isDoneToday = isCompletedToday(habit.CompletedDates);
  const habitColor = habit.color || COLORS.primary;

  const handleDelete = () => {
    showConfirm(
      "Delete Habit",
      "All your progress for this habit will be lost forever. Proceed?",
      () => {
        // Navigate first — HabitContext handles optimistic deletion & background sync
        router.back();
        deleteHabit(habit._id).catch(() => {});
      }
    );
  };

  const handleToggle = () => {
    toggleComplete(habit._id, isDoneToday);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header Section */}
      <LinearGradient colors={[habitColor, habitColor + 'DD']} style={styles.header}>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity onPress={() => router.push(`/habits/edit?id=${habit._id}`)} style={styles.navBtn}>
              <Ionicons name="pencil-outline" size={22} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.navBtn}>
              <Ionicons name="trash-outline" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
             <Ionicons name={(habit.icon as any) || 'star'} size={40} color="white" />
          </View>
          <Text style={styles.title}>{habit.title}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{habit.status.toUpperCase()}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: 'rgba(0,0,0,0.1)' }]}>
              <Text style={styles.statusText}>{(habit.category || 'General').toUpperCase()}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, SHADOWS.sm]}>
            <Ionicons name="flame" size={24} color="#f59e0b" />
            <Text style={styles.statValue}>{habit.currentStreak}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>
          <View style={[styles.statCard, SHADOWS.sm]}>
            <Ionicons name="trophy" size={24} color="#fbbf24" />
            <Text style={styles.statValue}>{habit.longestStreak}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Goal Description</Text>
          <View style={styles.descriptionCard}>
            <Text style={styles.desc}>
              {habit.description || "No description provided. Keep pushing forward!"}
            </Text>
          </View>
        </View>

        {/* Reminder Section */}
        <View style={styles.section}>
           <View style={styles.reminderCard}>
             <Ionicons name="notifications" size={20} color={COLORS.primary} />
             <Text style={styles.reminderText}>
               {habit.frequency ? habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1) : 'Daily'} reminder at {habit.reminderTime || '08:00 AM'}
             </Text>
           </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Fixed Action Button */}
      <View style={styles.actionContainer}>
         <TouchableOpacity 
          activeOpacity={0.9} 
          style={[styles.completeBtn, SHADOWS.md]}
          onPress={handleToggle}
        >
          <LinearGradient 
            colors={isDoneToday ? GRADIENTS.success : [habitColor, habitColor]} 
            style={styles.completeGradient}
          >
            <Ionicons 
              name={isDoneToday ? "checkmark-circle" : "ellipse-outline"} 
              size={24} 
              color="white" 
            />
            <Text style={styles.completeText}>
              {isDoneToday ? "Completed Today" : "Mark as Complete"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { 
    height: 300, 
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navBtn: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: 'white',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  statusBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 10,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  content: { 
    flex: 1, 
    marginTop: -40,
    paddingHorizontal: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
    marginLeft: 4,
  },
  descriptionCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border + '50',
  },
  desc: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '08',
    padding: 16,
    borderRadius: 20,
    gap: 12,
  },
  reminderText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  actionContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  completeBtn: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  completeGradient: {
    flexDirection: 'row',
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  completeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  }
});