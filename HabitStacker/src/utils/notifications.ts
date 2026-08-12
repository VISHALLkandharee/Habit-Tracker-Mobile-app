import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications should be handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  } as any),
});

export async function requestNotificationPermissions() {
  if (Platform.OS === 'web') return false;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    return false;
  }
  
  return true;
}

export async function cancelAllReminders() {
  if (Platform.OS !== 'web') {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
}

export async function syncHabitReminders(habits: any[]) {
  if (Platform.OS === 'web') return;

  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return;

  // Clear all existing to prevent duplicates or orphaned reminders
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
            sound: true,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: hour,
            minute: minute,
          },
        });
      }
    }
  }
}
