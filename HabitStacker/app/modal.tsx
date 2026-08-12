import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useHabits } from '../src/context/HabitContext';
import { useAuth } from '../src/context/AuthContext';
import { COLORS, SHADOWS, GRADIENTS } from '../src/constants/Config';
import { isCompletedToday } from '../src/utils/dateUtils';

/**
 * Quick Stats Modal — accessible via the FAB long-press or as a
 * bottom-sheet overlay over the home tab.
 */
export default function ModalScreen() {
  const router          = useRouter();
  const { habits }      = useHabits();
  const { user }        = useAuth();

  const totalHabits     = habits.length;
  const completedToday  = habits.filter(h => isCompletedToday(h.CompletedDates)).length;
  const completionRate  = totalHabits > 0
    ? Math.round((completedToday / totalHabits) * 100)
    : 0;
  const longestStreak   = habits.reduce((max, h) => Math.max(max, h.longestStreak || 0), 0);
  const currentStreaks  = habits.filter(h => (h.currentStreak || 0) > 0).length;

  const StatCard = ({ icon, value, label, color }: any) => (
    <View style={[styles.statCard, SHADOWS.sm]}>
      <View style={[styles.statIcon, { backgroundColor: color + '18' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />

      {/* Header */}
      <LinearGradient colors={GRADIENTS.primary} style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Today's Overview</Text>
            <Text style={styles.userName}>{user?.name || 'Your'} progress</Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
            <Ionicons name="close" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Ring summary */}
        <View style={styles.ringRow}>
          <View style={styles.ringContainer}>
            <Text style={styles.ringValue}>{completedToday}</Text>
            <Text style={styles.ringSlash}>/{totalHabits}</Text>
          </View>
          <View style={styles.ringLabels}>
            <Text style={styles.ringMain}>habits done today</Text>
            <View style={styles.rateBar}>
              <View style={[styles.rateFill, { width: `${completionRate}%` as any }]} />
            </View>
            <Text style={styles.rateText}>{completionRate}% completion rate</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {/* Stat grid */}
        <View style={styles.statGrid}>
          <StatCard
            icon="flame"
            value={longestStreak}
            label="Best Streak"
            color="#f59e0b"
          />
          <StatCard
            icon="trending-up"
            value={currentStreaks}
            label="Active Streaks"
            color={COLORS.primary}
          />
          <StatCard
            icon="checkmark-circle"
            value={completedToday}
            label="Done Today"
            color="#10b981"
          />
          <StatCard
            icon="list"
            value={totalHabits}
            label="Total Habits"
            color="#8b5cf6"
          />
        </View>

        {/* Today's habit list */}
        <Text style={styles.sectionTitle}>TODAY'S HABITS</Text>
        {habits.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="add-circle-outline" size={32} color={COLORS.gray} />
            <Text style={styles.emptyText}>No habits yet. Tap + on the home screen to add one!</Text>
          </View>
        ) : (
          habits.map(habit => {
            const done  = isCompletedToday(habit.CompletedDates);
            const color = habit.color || COLORS.primary;
            return (
              <View key={habit._id} style={[styles.habitRow, SHADOWS.sm]}>
                <View style={[styles.habitDot, { backgroundColor: color }]} />
                <View style={styles.habitInfo}>
                  <Text style={[styles.habitTitle, done && styles.habitTitleDone]}>
                    {habit.title}
                  </Text>
                  <Text style={styles.habitMeta}>
                    {habit.currentStreak}d streak · {habit.category}
                  </Text>
                </View>
                <Ionicons
                  name={done ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={done ? '#10b981' : COLORS.border}
                />
              </View>
            );
          })
        )}

        {/* Action buttons */}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => { router.back(); router.push('/habits/add'); }}
        >
          <LinearGradient colors={GRADIENTS.primary} style={styles.actionBtnGradient}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.actionBtnText}>Add New Habit</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header:    { paddingTop: Platform.OS === 'ios' ? 56 : 32, paddingHorizontal: 24, paddingBottom: 28 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  greeting:  { fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: '600', letterSpacing: 0.5 },
  userName:  { fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 2 },
  closeBtn:  {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  ringRow:       { flexDirection: 'row', alignItems: 'center', gap: 20 },
  ringContainer: { flexDirection: 'row', alignItems: 'baseline' },
  ringValue:     { fontSize: 52, fontWeight: 'bold', color: '#fff', lineHeight: 56 },
  ringSlash:     { fontSize: 28, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
  ringLabels:    { flex: 1 },
  ringMain:      { fontSize: 15, color: 'rgba(255,255,255,0.85)', fontWeight: '600', marginBottom: 8 },
  rateBar:       { height: 6, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 3, marginBottom: 6 },
  rateFill:      { height: '100%', backgroundColor: '#fff', borderRadius: 3 },
  rateText:      { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  body:          { flex: 1 },
  bodyContent:   { padding: 20 },
  statGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28,
  },
  statCard: {
    width: '47%', backgroundColor: '#fff', borderRadius: 18,
    padding: 16, alignItems: 'center', gap: 6,
  },
  statIcon:  { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  statValue: { fontSize: 26, fontWeight: 'bold', color: COLORS.text },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600', textAlign: 'center' },
  sectionTitle: {
    fontSize: 12, fontWeight: '800', color: COLORS.gray,
    letterSpacing: 1, marginBottom: 12,
  },
  emptyCard: {
    backgroundColor: '#fff', borderRadius: 18, padding: 24,
    alignItems: 'center', gap: 12, ...SHADOWS.sm,
  },
  emptyText: { color: COLORS.textSecondary, textAlign: 'center', fontSize: 14, lineHeight: 20 },
  habitRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 16, padding: 14, marginBottom: 10, gap: 12,
  },
  habitDot:       { width: 10, height: 10, borderRadius: 5 },
  habitInfo:      { flex: 1 },
  habitTitle:     { fontSize: 15, fontWeight: '700', color: COLORS.text },
  habitTitleDone: { color: COLORS.textSecondary, textDecorationLine: 'line-through' },
  habitMeta:      { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  actionBtn: { marginTop: 24, borderRadius: 16, overflow: 'hidden', ...SHADOWS.md },
  actionBtnGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, gap: 8,
  },
  actionBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});