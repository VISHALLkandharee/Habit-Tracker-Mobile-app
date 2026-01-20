import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useHabits } from '../../src/context/HabitContext';
import { HabitCard } from '../../src/components/HabitCard';
import { COLORS } from '../../src/constants/Config';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const { habits, fetchHabits, toggleComplete, loading } = useHabits();
  const router = useRouter();

  useEffect(() => { fetchHabits(); }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Habits</Text>
        <TouchableOpacity onPress={() => router.push('/habits/add')}>
          <Ionicons name="add-circle" size={40} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={habits}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <HabitCard 
            habit={item} 
            onToggle={() => toggleComplete(item._id, item.CompletedDates.some(d => new Date(d).toDateString() === new Date().toDateString()))}
            onPress={() => router.push(`/habits/${item._id}`)}
          />
        )}
        contentContainerStyle={{ padding: 20 }}
        onRefresh={fetchHabits}
        refreshing={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold' }
});