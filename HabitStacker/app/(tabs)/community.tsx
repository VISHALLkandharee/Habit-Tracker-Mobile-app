import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { habitService } from '../../src/services/habitService';
import { COLORS, SHADOWS, GRADIENTS } from '../../src/constants/Config';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function CommunityScreen() {
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [pulse, setPulse] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [lbRes, pulseRes] = await Promise.all([
        habitService.getLeaderboard(),
        habitService.getPulse()
      ]);
      setLeaderboard(lbRes.leaderboard);
      setPulse(pulseRes);
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

  const renderLeaderItem = ({ item, index }: { item: any, index: number }) => (
    <View style={[styles.leaderCard, SHADOWS.sm]}>
      <View style={styles.rankBadge}>
        <Text style={styles.rankText}>{index + 1}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.userName}</Text>
        <Text style={styles.userHabit}>{item.habitTitle}</Text>
      </View>
      <View style={styles.streakBadge}>
        <Ionicons name="flame" size={16} color="#fff" />
        <Text style={styles.streakValue}>{item.bestStreak}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!leaderboard || !pulse) {
    return (
      <View style={styles.center}>
        <Text style={{ color: COLORS.textSecondary }}>Community data is currently unavailable.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Global Pulse</Text>
        <LinearGradient 
          colors={GRADIENTS.primary} 
          style={styles.pulseCard}
        >
          <View style={styles.pulseInfo}>
            <Text style={styles.pulseValue}>{pulse?.totalUsers}</Text>
            <Text style={styles.pulseLabel}>Stackers</Text>
          </View>
          <View style={styles.pulseDivider} />
          <View style={styles.pulseInfo}>
            <Text style={styles.pulseValue}>{pulse?.activeHabits}</Text>
            <Text style={styles.pulseLabel}>Active Habits</Text>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Leaderboard</Text>
        <FlatList
          data={leaderboard}
          renderItem={renderLeaderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    ...SHADOWS.md,
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
    marginBottom: 20,
  },
  pulseCard: {
    flexDirection: 'row',
    borderRadius: 24,
    padding: 24,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  pulseInfo: {
    alignItems: 'center',
  },
  pulseValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  pulseLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  pulseDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 40,
  },
  leaderCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  userHabit: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  streakValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
});
