export const isToday = (date: string | Date): boolean => {
  if (!date) return false;
  const d = new Date(date);
  const today = new Date();
  return d.toDateString() === today.toDateString();
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};