import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Platform, Switch, Linking,
} from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { habitService } from '../../src/services/habitService';
import { COLORS, SHADOWS, GRADIENTS } from '../../src/constants/Config';
import { Ionicons } from '@expo/vector-icons';
import { showConfirm, showAlert } from '../../src/utils/ui';
import { LinearGradient } from 'expo-linear-gradient';
import {
  requestNotificationPermissions,
  cancelAllReminders,
  syncHabitReminders,
} from '../../src/utils/notifications';
import { useHabits } from '../../src/context/HabitContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATIONS_PREF_KEY = '@notifications_enabled';

export default function Settings() {
  const { signOut, user }   = useAuth();
  const { habits }          = useHabits();
  const [achievements, setAchievements]           = useState<any[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [togglingNotifs, setTogglingNotifs]         = useState(false);

  // ── Load achievements ────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await habitService.getAchievements();
        setAchievements(res.achievements || res || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchAchievements();
  }, []);

  // ── Load notifications preference ────────────────────────────────────────
  useEffect(() => {
    AsyncStorage.getItem(NOTIFICATIONS_PREF_KEY).then(val => {
      if (val !== null) setNotificationsEnabled(val === 'true');
    });
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleLogout = () => {
    showConfirm(
      'Log Out',
      'Are you sure you want to log out of your journey?',
      () => { signOut(); }
    );
  };

  const handleNotificationsToggle = async (value: boolean) => {
    setTogglingNotifs(true);
    try {
      if (value) {
        const granted = await requestNotificationPermissions();
        if (!granted) {
          showAlert(
            'Permission Required',
            'Please enable notifications for HabitStacker in your device Settings.'
          );
          setTogglingNotifs(false);
          return;
        }
        // Re-schedule all active habit reminders
        await syncHabitReminders(habits);
      } else {
        await cancelAllReminders();
      }
      setNotificationsEnabled(value);
      await AsyncStorage.setItem(NOTIFICATIONS_PREF_KEY, String(value));
    } catch (e) {
      console.error('Notification toggle error', e);
    } finally {
      setTogglingNotifs(false);
    }
  };

  // ── Sub-components ───────────────────────────────────────────────────────
  const SettingItem = ({
    icon, title, subtitle, onPress, color = COLORS.primary, right,
  }: any) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {right ?? <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />}
    </TouchableOpacity>
  );

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Profile Card */}
        <LinearGradient colors={GRADIENTS.primary} style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || 'U'}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
          </View>
        </LinearGradient>

        {/* Trophy Room */}
        <Text style={styles.sectionHeader}>TROPHY ROOM</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.trophyContainer}
        >
          {(!achievements || achievements.length === 0) ? (
            <View style={styles.noAchievements}>
              <Ionicons name="medal-outline" size={32} color={COLORS.gray} />
              <Text style={styles.noAchievementsText}>Complete habits to earn badges!</Text>
            </View>
          ) : (
            achievements.map((ach: any) => (
              <View key={ach._id} style={[styles.trophyCard, SHADOWS.sm]}>
                <View style={styles.trophyIcon}>
                  <Ionicons name="trophy" size={24} color="#fbbf24" />
                </View>
                <Text style={styles.trophyTitle}>{ach.title}</Text>
                <Text style={styles.trophyDesc} numberOfLines={2}>{ach.description}</Text>
              </View>
            ))
          )}
        </ScrollView>

        {/* Preferences */}
        <Text style={styles.sectionHeader}>PREFERENCES</Text>
        <View style={styles.section}>
          <SettingItem
            icon="notifications"
            title="Notifications"
            subtitle={notificationsEnabled ? 'Daily reminders on' : 'Reminders off'}
            color={COLORS.primary}
            right={
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationsToggle}
                disabled={togglingNotifs}
                trackColor={{ false: COLORS.border, true: COLORS.primary + '80' }}
                thumbColor={notificationsEnabled ? COLORS.primary : '#f4f3f4'}
                ios_backgroundColor={COLORS.border}
              />
            }
          />
        </View>

        {/* Support */}
        <Text style={styles.sectionHeader}>SUPPORT</Text>
        <View style={styles.section}>
          <SettingItem
            icon="mail-outline"
            title="Send Feedback"
            subtitle="Report a bug or suggest a feature"
            color="#10b981"
            onPress={() => Linking.openURL('mailto:support@habitstacker.app?subject=HabitStacker Feedback')}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="star"
            title="Rate App"
            subtitle="Enjoying HabitStacker? Let us know!"
            color="#fbbf24"
            onPress={() =>
              showAlert('Rate App', 'Thank you! Once published, this will open your app store review page.')
            }
          />
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.text },
  content:     { padding: 24 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    marginBottom: 32,
    ...SHADOWS.md,
  },
  avatar: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 16,
  },
  avatarText:  { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  userName:    { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  userEmail:   { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  sectionHeader: {
    fontSize: 12, fontWeight: '800', color: COLORS.gray,
    letterSpacing: 1, marginBottom: 12, marginLeft: 8,
  },
  section: {
    backgroundColor: '#fff', borderRadius: 20,
    overflow: 'hidden', marginBottom: 32, ...SHADOWS.sm,
  },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  iconBox: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginRight: 16,
  },
  settingTextContainer: { flex: 1 },
  settingTitle:    { fontSize: 16, fontWeight: '600', color: COLORS.text },
  settingSubtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: COLORS.border, marginLeft: 72 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', backgroundColor: '#fee2e2',
    padding: 16, borderRadius: 16, gap: 8, marginTop: 8,
  },
  logoutText:  { color: '#ef4444', fontSize: 16, fontWeight: 'bold' },
  version:     { textAlign: 'center', color: COLORS.gray, marginTop: 24, fontSize: 12 },
  // Trophy Room
  trophyContainer: { paddingLeft: 8, paddingBottom: 32, gap: 16 },
  trophyCard: {
    backgroundColor: '#fff', padding: 16,
    borderRadius: 20, alignItems: 'center',
    width: 130, borderWidth: 1, borderColor: '#fbbf2430',
  },
  trophyIcon: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#fbbf2415',
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  trophyTitle: { fontSize: 12, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  trophyDesc:  { fontSize: 11, color: COLORS.gray, textAlign: 'center', marginTop: 4, lineHeight: 15 },
  noAchievements: {
    padding: 24, backgroundColor: '#fff', borderRadius: 20,
    width: 260, flexDirection: 'row', alignItems: 'center',
    gap: 12, ...SHADOWS.sm,
  },
  noAchievementsText: { flex: 1, fontSize: 13, color: COLORS.gray, fontWeight: '500' },
});
