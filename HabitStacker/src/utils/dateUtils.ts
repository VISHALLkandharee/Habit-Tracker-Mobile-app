/**
 * Utility functions for date handling in the habit tracker.
 */

export const isSameDay = (date1: Date | string, date2: Date | string) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const isCompletedToday = (completedDates: string[] = []) => {
  const today = new Date();
  if (!completedDates || !Array.isArray(completedDates)) return false;
  return completedDates.some(date => isSameDay(date, today));
};

export const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};