import { getToken } from '../utils/auth';

function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function getEvents() {
  const response = await fetch('/api/calendar/events', {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    }
  });
  return response.json();
}

export async function getUpcomingEvents() {
  const response = await fetch('/api/calendar/events/upcoming', {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    }
  });
  return response.json();
}