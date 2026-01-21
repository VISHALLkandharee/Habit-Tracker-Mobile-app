import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useHabits } from '../../src/context/HabitContext';
import { useAuth } from '../../src/context/AuthContext'; // 1. Import Auth
import { HabitCard } from '../../src/components/HabitCard';
import { COLORS } from '../../src/constants/Config';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const { habits, fetchHabits, toggleComplete, loading } = useHabits();
  const { signOut, user } = useAuth(); // 2. Get user and signOut function
  const router = useRouter();

  useEffect(() => { fetchHabits(); }, []);

  // 3. Handle Logout Confirmation
  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive", 
          onPress: () => {
            signOut();
            // Router will automatically redirect to Login because of the AuthContext check
          } 
        }
      ]
    );
  };

  // Empty state component
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="checkmark-circle-outline" size={80} color={COLORS.gray} />
      <Text style={styles.emptyTitle}>No habits yet</Text>
      <Text style={styles.emptySubtitle}>Create your first habit to get started</Text>
      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => router.push('/habits/add')}
      >
        <Ionicons name="add-circle" size={24} color="#fff" />
        <Text style={styles.createButtonText}>Create First Habit</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 4. Updated Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi, {user?.name || 'Friend'}</Text>
          <Text style={styles.title}>My Habits</Text>
        </View>
        
        <View style={styles.headerActions}>
          {/* Logout Button */}
          <TouchableOpacity onPress={handleLogout} style={styles.iconBtn}>
            <Ionicons name="log-out-outline" size={28} color={COLORS.error || '#ef4444'} />
          </TouchableOpacity>

          {/* Add Button */}
          <TouchableOpacity onPress={() => router.push('/habits/add')}>
            <Ionicons name="add-circle" size={44} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={habits}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <HabitCard 
            habit={item} 
            // Check if today's date exists in the CompletedDates array
            onToggle={() => toggleComplete(item._id, item.CompletedDates.some(d => new Date(d).toDateString() === new Date().toDateString()))}
            onPress={() => router.push(`/habits/${item._id}`)}
          />
        )}
        ListEmptyComponent={!loading ? <EmptyState /> : null}
        contentContainerStyle={habits.length === 0 ? styles.emptyList : { padding: 20 }}
        onRefresh={fetchHabits}
        refreshing={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    paddingTop: 60, 
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15, // Adds space between Logout and Add button
  },
  greeting: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '600',
    marginBottom: 2
  },
  title: { 
    fontSize: 26, 
    fontWeight: 'bold',
    color: COLORS.text
  },
  iconBtn: {
    padding: 4, // Increases touch area slightly
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
    paddingHorizontal: 40,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 30,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});