import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';

// In Expo SDK 53+, remote push token auto-registration in expo-notifications
// was removed from Expo Go. Checking if running in Expo Go allows us to
// gracefully skip notification side-effects in Expo Go while providing full
// native scheduled notifications in standalone / EAS production builds.
const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let Notifications: any = null;

if (!isExpoGo && Platform.OS !== 'web') {
  try {
    Notifications = require('expo-notifications');
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    // Create high-importance notification channel for Android 8.0+
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('habit-reminders', {
        name: 'Habit Reminders',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#6366f1',
        sound: 'default',
      }).catch((e: any) => console.warn('[Notifications] Failed to create channel:', e));
    }
  } catch (e) {
    console.warn('[Notifications] Failed to initialize notifications handler:', e);
  }
}

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web' || isExpoGo || !Notifications) return false;

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } catch (e) {
    console.warn('[Notifications] Error requesting permissions:', e);
    return false;
  }
}

export async function cancelAllReminders(): Promise<void> {
  if (Platform.OS === 'web' || isExpoGo || !Notifications) return;

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e) {
    console.warn('[Notifications] Error canceling reminders:', e);
  }
}

export async function syncHabitReminders(habits: any[]): Promise<void> {
  if (Platform.OS === 'web' || isExpoGo || !Notifications) return;

  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return;

    // Clear all existing to prevent duplicates
    await cancelAllReminders();

    for (const habit of habits) {
      if (habit.status === 'active' && habit.reminderTime) {
        const [hourStr, minuteStr] = habit.reminderTime.split(':');
        const hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);

        if (!isNaN(hour) && !isNaN(minute)) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `Time for: ${habit.title} 🚀`,
              body: "Don't break your streak! Take a few minutes to complete your habit now.",
              sound: 'default',
              channelId: 'habit-reminders',
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DAILY,
              hour,
              minute,
            },
          });
        }
      }
    }
  } catch (e) {
    console.warn('[Notifications] Error syncing reminders:', e);
  }
}
