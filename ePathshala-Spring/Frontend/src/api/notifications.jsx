import { getToken } from '../utils/auth';

export async function fetchUserNotifications() {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token available');
  }
  
  const res = await fetch('/api/notifications/user', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (res.status === 401 || res.status === 403) {
    throw new Error(`Authentication error: ${res.status}`);
  }
  
  if (!res.ok) {
    throw new Error(`Failed to fetch notifications: ${res.status}`);
  }
  
  return res.json();
}

export async function fetchUnreadNotificationCount() {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token available');
  }
  
  const res = await fetch('/api/notifications/user/unread/count', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (res.status === 401 || res.status === 403) {
    throw new Error(`Authentication error: ${res.status}`);
  }
  
  if (!res.ok) {
    throw new Error(`Failed to fetch unread count: ${res.status}`);
  }
  
  return res.json();
}

export async function markNotificationAsRead(notificationId) {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token available');
  }
  
  const res = await fetch(`/api/notifications/mark-read/${notificationId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (res.status === 401 || res.status === 403) {
    throw new Error(`Authentication error: ${res.status}`);
  }
  
  if (!res.ok) {
    throw new Error(`Failed to mark notification as read: ${res.status}`);
  }
  
  return res.json();
}

export async function markAllNotificationsAsRead() {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token available');
  }
  
  const res = await fetch('/api/notifications/mark-all-read', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (res.status === 401 || res.status === 403) {
    throw new Error(`Authentication error: ${res.status}`);
  }
  
  if (!res.ok) {
    throw new Error(`Failed to mark all as read: ${res.status}`);
  }
  
  return res.json();
}
