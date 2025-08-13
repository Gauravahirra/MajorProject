import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, List, ListItem, ListItemText, Paper, Alert } from '@mui/material';
import { getAllActiveSessions, getUserSessions, logoutSession, logoutAllUserSessions } from '../../api/session';

function AdminSessionManagement() {
  const [activeSessions, setActiveSessions] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUserSessions, setSelectedUserSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const loadActiveSessions = async () => {
    setLoading(true);
    setError('');
    try {
      const sessions = await getAllActiveSessions();
      setActiveSessions(sessions.sessions || []);
    } catch (err) {
      setError('Failed to load active sessions');
    } finally {
      setLoading(false);
    }
  };

  const loadUserSessions = async (userId) => {
    setError('');
    try {
      const numericUserId = parseInt(userId, 10);
      if (isNaN(numericUserId)) {
        setError('Invalid user ID. Please enter a valid number.');
        return;
      }
      const sessions = await getUserSessions(numericUserId);
      setSelectedUserSessions(sessions.sessions || []);
    } catch (err) {
      setError('Failed to load user sessions: ' + err.message);
    }
  };

  const handleLogoutSession = async (sessionId) => {
    setError('');
    setSuccess('');
    try {
      await logoutSession(sessionId);
      setSuccess('Session logged out successfully');
      loadActiveSessions();
      if (selectedUserId) {
        loadUserSessions(selectedUserId);
      }
    } catch (err) {
      setError('Failed to logout session');
    }
  };

  const handleLogoutAllUserSessions = async (userId) => {
    setError('');
    setSuccess('');
    try {
      const numericUserId = parseInt(userId, 10);
      if (isNaN(numericUserId)) {
        setError('Invalid user ID. Please enter a valid number.');
        return;
      }
      await logoutAllUserSessions(numericUserId);
      setSuccess('All user sessions logged out successfully');
      loadActiveSessions();
      setSelectedUserSessions([]);
    } catch (err) {
      setError('Failed to logout all user sessions: ' + err.message);
    }
  };

  useEffect(() => {
    loadActiveSessions();
  }, []);

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>Session Management</Typography>
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Active Sessions ({activeSessions.length})</Typography>
        <Button onClick={loadActiveSessions} size="small" sx={{ ml: 2 }}>Refresh Sessions</Button>
        <List>
          {activeSessions.map(session => (
            <ListItem key={session.sessionId} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <Paper sx={{ width: '100%', p: 2, mb: 1 }}>
                <Typography variant="body2">
                  <strong>{session.userName}</strong> ({session.userEmail}) - {session.userRole}
                </Typography>
                <Typography variant="caption">
                  Login: {session.loginTime} | Last Activity: {session.lastActivityTime} | IP: {session.ipAddress}
                </Typography>
                <Button onClick={() => handleLogoutSession(session.sessionId)} size="small" color="error" sx={{ mt: 1 }}>
                  Logout Session
                </Button>
              </Paper>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">User Sessions</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
          <TextField
            label="Enter User ID"
            value={selectedUserId}
            onChange={e => setSelectedUserId(e.target.value)}
            size="small"
          />
          <Button onClick={() => loadUserSessions(selectedUserId)} size="small" variant="outlined">Load User Sessions</Button>
          <Button onClick={() => handleLogoutAllUserSessions(selectedUserId)} size="small" color="error" variant="outlined">Logout All User Sessions</Button>
        </Box>
        <List>
          {selectedUserSessions.map(session => (
            <ListItem key={session.sessionId} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <Paper sx={{ width: '100%', p: 2, mb: 1 }}>
                <Typography variant="body2">
                  <strong>Session ID:</strong> {session.sessionId}
                </Typography>
                <Typography variant="caption">
                  Login: {session.loginTime} | Last Activity: {session.lastActivityTime} | IP: {session.ipAddress}
                  <br />
                  Status: {session.isActive ? 'Active' : 'Inactive'} | Expired: {session.isExpired ? 'Yes' : 'No'}
                </Typography>
                {session.isActive && (
                  <Button onClick={() => handleLogoutSession(session.sessionId)} size="small" color="error" sx={{ mt: 1 }}>
                    Logout Session
                  </Button>
                )}
              </Paper>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}

export default React.memo(AdminSessionManagement);