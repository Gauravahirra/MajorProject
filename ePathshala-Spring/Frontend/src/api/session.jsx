function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function getSessionInfo(sessionId) {
  const response = await fetch(`/api/session/info/${sessionId}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    }
  });
  return response.json();
}

export async function getAllActiveSessions() {
  const response = await fetch('/api/session/all', {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    }
  });
  return response.json();
}

export async function getUserSessions(userId) {
  const response = await fetch(`/api/session/user/${userId}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    }
  });
  return response.json();
}

export async function logoutSession(sessionId) {
  const response = await fetch(`/api/session/logout/${sessionId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    }
  });
  return response.json();
}

export async function logoutAllUserSessions(userId) {
  console.log('Calling logoutAllUserSessions with userId:', userId);
  const response = await fetch(`/api/session/logout-all/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    }
  });
  console.log('Response status:', response.status);
  const data = await response.json();
  console.log('Response data:', data);
  return data;
}

export async function getMySessions(userId) {
  const response = await fetch(`/api/session/my-sessions?userId=${userId}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    }
  });
  return response.json();
} 