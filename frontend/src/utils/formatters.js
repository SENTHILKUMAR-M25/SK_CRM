export const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
};

export const formatDateTime = (date, time) => {
  if (!date) return '-';
  const d = formatDate(date);
  return time ? `${d} ${time}` : d;
};

export const formatTime = (time) => {
  if (!time) return '';
  return time;
};

export const timeAgo = (date) => {
  if (!date) return '';
  const now = new Date();
  const then = new Date(date);
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(date);
};

export const isOverdue = (date) => {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const followUp = new Date(date);
  followUp.setHours(0, 0, 0, 0);
  return followUp < today;
};

export const isToday = (date) => {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const check = new Date(date);
  check.setHours(0, 0, 0, 0);
  return check.getTime() === today.getTime();
};
