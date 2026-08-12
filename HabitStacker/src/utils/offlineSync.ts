import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const QUEUE_KEY = '@offline_queue';

export const addToOfflineQueue = async (action: any) => {
  const existingQueue = await AsyncStorage.getItem(QUEUE_KEY);
  const queue = existingQueue ? JSON.parse(existingQueue) : [];
  queue.push({ ...action, timestamp: Date.now() });
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
};

/**
 * Listens for network state changes. Calls onBackOnline whenever
 * the device regains connectivity. Returns the unsubscribe function.
 */
export const setupNetworkListener = (onBackOnline: () => void) => {
  let wasOffline = false;

  return NetInfo.addEventListener((state) => {
    if (state.isConnected) {
      if (wasOffline) {
        // Only trigger if we were previously offline — avoids firing on mount
        onBackOnline();
      }
      wasOffline = false;
    } else {
      wasOffline = true;
    }
  });
};

/**
 * Processes all queued offline actions against the given service object.
 * Clears the queue on completion even if some actions fail individually.
 */
export const processOfflineQueue = async (service: any) => {
  const existingQueue = await AsyncStorage.getItem(QUEUE_KEY);
  if (!existingQueue) return;

  const queue: any[] = JSON.parse(existingQueue);
  if (queue.length === 0) return;

  console.log(`[OfflineSync] Processing ${queue.length} queued action(s)`);

  for (const action of queue) {
    try {
      switch (action.type) {
        case 'MARK_COMPLETE':
          await service.markComplete(action.habitId);
          break;
        case 'UNMARK_COMPLETE':
          await service.unmarkComplete(action.habitId);
          break;
        case 'CREATE_HABIT':
          await service.createHabit(action.data);
          break;
        default:
          console.warn('[OfflineSync] Unknown action type:', action.type);
      }
    } catch (e) {
      console.error('[OfflineSync] Failed to sync action', action.type, e);
    }
  }

  // Always clear the queue after processing
  await AsyncStorage.removeItem(QUEUE_KEY);
  console.log('[OfflineSync] Queue cleared');
};