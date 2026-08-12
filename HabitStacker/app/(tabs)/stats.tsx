import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { habitService } from '../../src/services/habitService';
import { COLORS, SHADOWS, GRADIENTS } from '../../src/constants/Config';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function StatsScreen() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const analytics = await habitService.getAnalytics();
      setData(analytics);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!data || !data.summary) {
    return (
      <View style={styles.center}>
        <Text style={styles.footerText}>No stats available yet. Complete some habits!</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
    >
      <Text style={styles.title}>Performance</Text>

      <View style={styles.summaryGrid}>
        <View style={[styles.summaryCard, SHADOWS.sm]}>
          <Text style={styles.summaryLabel}>Total Success</Text>
          <Text style={styles.summaryValue}>{data.summary.overallCompletionRate}%</Text>
        </View>
        <View style={[styles.summaryCard, SHADOWS.sm]}>
          <Text style={styles.summaryLabel}>Total Checks</Text>
          <Text style={styles.summaryValue}>{data.summary.totalCompletions}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Habit Breakdown</Text>
      {(data.habits || []).map((habit: any) => (
        <View key={habit.id} style={[styles.habitStatCard, SHADOWS.sm]}>
          <View style={styles.habitHeader}>
            <Text style={styles.habitTitle}>{habit.title}</Text>
            <Text style={styles.habitPercentage}>{habit.completionRate}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <LinearGradient 
              colors={GRADIENTS.primary} 
              start={{ x: 0, y: 0 }} 
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: `${habit.completionRate}%` }]} 
            />
          </View>
          <View style={styles.habitFooter}>
            <View style={styles.streakInfo}>
              <Ionicons name="flame" size={16} color={COLORS.secondary} />
              <Text style={styles.footerText}>{habit.streak} day streak</Text>
            </View>
            <View style={styles.streakInfo}>
              <Ionicons name="trophy-outline" size={16} color={COLORS.primary} />
              <Text style={styles.footerText}>Best: {habit.best}</Text>
            </View>
          </View>
        </View>
      ))}
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 24,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.gray,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  habitStatCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  habitPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: COLORS.background,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  habitFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  streakInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});
