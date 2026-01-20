import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const QUEUE_KEY = '@offline_queue';

export const addToOfflineQueue = async (action: any) => {
  const existingQueue = await AsyncStorage.getItem(QUEUE_KEY);
  const queue = existingQueue ? JSON.parse(existingQueue) : [];
  queue.push({ ...action, timestamp: Date.now() });
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
};

export const setupNetworkListener = (onBackOnline: () => void) => {
  return NetInfo.addEventListener((state) => {
    if (state.isConnected) {
      onBackOnline();
    }
  });
};

export const processOfflineQueue = async (service: any) => {
  const existingQueue = await AsyncStorage.getItem(QUEUE_KEY);
  if (!existingQueue) return;

  const queue = JSON.parse(existingQueue);
  for (const action of queue) {
    try {
      if (action.type === 'MARK_COMPLETE') await service.markComplete(action.habitId);
      if (action.type === 'CREATE_HABIT') await service.createHabit(action.data);
      // Add other types as needed
    } catch (e) {
      console.error("Failed to sync action", action.type, e);
    }
  }
  await AsyncStorage.removeItem(QUEUE_KEY);
};