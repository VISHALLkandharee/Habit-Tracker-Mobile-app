import { Alert, Platform } from 'react-native';

/**
 * A cross-platform alert utility.
 */
export const showAlert = (title: string, message: string, onConfirm?: () => void) => {
  if (Platform.OS === 'web') {
    const confirmed = window.confirm(`${title}\n\n${message}`);
    if (confirmed && onConfirm) {
      onConfirm();
    }
  } else {
    Alert.alert(
      title,
      message,
      onConfirm ? [{ text: 'OK', onPress: onConfirm }] : [{ text: 'OK' }]
    );
  }
};

export const showConfirm = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
) => {
  if (Platform.OS === 'web') {
    const confirmed = window.confirm(`${title}\n\n${message}`);
    if (confirmed) {
      onConfirm();
    } else if (onCancel) {
      onCancel();
    }
  } else {
    Alert.alert(
      title,
      message,
      [
        { text: 'Cancel', style: 'cancel', onPress: onCancel },
        { text: 'OK', onPress: onConfirm },
      ]
    );
  }
};
