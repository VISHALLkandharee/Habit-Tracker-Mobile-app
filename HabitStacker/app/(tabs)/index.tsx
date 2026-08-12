import React, { useEffect, useMemo } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { useHabits } from '../../src/context/HabitContext';
import { useAuth } from '../../src/context/AuthContext';
import { HabitCard } from '../../src/components/HabitCard';
import { COLORS, SHADOWS, GRADIENTS } from '../../src/constants/Config';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { showConfirm } from '../../src/utils/ui';
import { isCompletedToday } from '../../src/utils/dateUtils';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

export default function Home() {
  const { habits, fetchHabits, toggleComplete, loading } = useHabits();
  const { user } = useAuth();
  const router = useRouter();

  const completedCount = useMemo(() => 
    habits.filter(h => isCompletedToday(h.CompletedDates)).length,
    [habits]
  );

  const progress = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;

  const weekDays = useMemo(() => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to midnight
    
    const currentDay = today.getDay(); // 0 (Sun) to 6 (Sat)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay); // Go back to Sunday
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      d.setHours(0, 0, 0, 0); // Normalize d to midnight
      
      days.push({
        date: d.getDate(),
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        isToday: d.getTime() === today.getTime()
      });
    }
    return days;
  }, []);

  const handleToggle = React.useCallback((id: string, isDone: boolean) => {
    toggleComplete(id, isDone);
  }, [toggleComplete]);

  const handlePress = React.useCallback((id: string) => {
    router.push(`/habits/${id}`);
  }, [router]);

  const header = useMemo(() => (
    <LinearGradient
      colors={GRADIENTS.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.greeting}>Good day,</Text>
          <Text style={styles.userName}>{user?.name || 'Achiever'}</Text>
        </View>
      </View>

      <View style={styles.statsOverview}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{habits.length}</Text>
          <Text style={styles.statLabel}>Total Habits</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{completedCount}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      <View style={styles.calendarContainer}>
        {weekDays.map((day, idx) => (
          <View key={idx} style={[styles.dayCard, day.isToday && styles.todayCard]}>
            <Text style={[styles.dayName, day.isToday && styles.todayText]}>{day.day.charAt(0)}</Text>
            <Text style={[styles.dayDate, day.isToday && styles.todayText]}>{day.date}</Text>
            {day.isToday && <View style={styles.todayDot} />}
          </View>
        ))}
      </View>
    </LinearGradient>
  ), [user?.name, habits.length, completedCount, weekDays]);

  const renderHabitItem = React.useCallback(({ item }: { item: any }) => (
    <HabitCard 
      habit={item} 
      onToggle={() => handleToggle(item._id, isCompletedToday(item.CompletedDates))}
      onPress={() => handlePress(item._id)}
    />
  ), [handleToggle, handlePress]);

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="sparkles" size={60} color={COLORS.primary} />
      </View>
      <Text style={styles.emptyTitle}>Your journey starts here</Text>
      <Text style={styles.emptySubtitle}>Small habits lead to big changes. Create your first habit now.</Text>
      <TouchableOpacity 
        activeOpacity={0.8}
        style={[styles.createButton, SHADOWS.md]}
        onPress={() => router.push('/habits/add')}
      >
        <LinearGradient
          colors={GRADIENTS.primary}
          style={styles.createButtonGradient}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.createButtonText}>Add New Habit</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {header}
      
      <View style={styles.listContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Focus</Text>
          <TouchableOpacity onPress={() => router.push('/habits/add')}>
             <Ionicons name="add-circle" size={32} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={habits}
          keyExtractor={(item) => item._id}
          renderItem={renderHabitItem}
          ListEmptyComponent={!loading ? <EmptyState /> : null}
          contentContainerStyle={habits.length === 0 ? styles.emptyList : { paddingHorizontal: 20, paddingBottom: 100 }}
          onRefresh={fetchHabits}
          refreshing={loading}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {habits.length > 0 && (
        <View style={styles.fabContainer}>
          <BlurView intensity={80} tint="light" style={styles.fabBlur}>
            <TouchableOpacity 
              activeOpacity={0.9} 
              style={styles.fab}
              onPress={() => router.push('/habits/add')}
            >
              <LinearGradient colors={GRADIENTS.primary} style={styles.fabGradient}>
                <Ionicons name="add" size={30} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </BlurView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  header: { 
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: -0.5,
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsOverview: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  calendarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dayCard: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: 42,
  },
  todayCard: {
    backgroundColor: '#fff',
    ...SHADOWS.md,
  },
  dayName: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    marginBottom: 8,
  },
  dayDate: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  todayText: {
    color: COLORS.primary,
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    position: 'absolute',
    bottom: 6,
  },
  listContainer: {
    flex: 1,
    marginTop: -20,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  createButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  createButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    gap: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    borderRadius: 30,
    overflow: 'hidden',
    ...SHADOWS.lg,
  },
  fabBlur: {
    padding: 4,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyList: {
    flexGrow: 1,
  }
});