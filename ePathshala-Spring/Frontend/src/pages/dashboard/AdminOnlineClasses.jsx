import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Paper, CircularProgress, Alert } from '@mui/material';

function AdminOnlineClasses() {
  const [onlineClasses, setOnlineClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOnlineClasses() {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/admin/online-classes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch online classes');
        const data = await res.json();
        setOnlineClasses(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        setOnlineClasses([]);
      } finally {
        setLoading(false);
      }
    }
    fetchOnlineClasses();
  }, []);

  if (loading) return <Box sx={{ p: 3 }}><CircularProgress /> Loading online classes...</Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>Online Classes ({onlineClasses.length})</Typography>
      <List>
        {onlineClasses.map(classItem => (
          <ListItem key={classItem.id}>
            <Paper sx={{ width: '100%', p: 2, bgcolor: '#f9f9f9' }}>
              <Typography variant="subtitle1" fontWeight={600}>{classItem.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {classItem.subject}
              </Typography>
              <Typography variant="body2">
                Teacher: {classItem.teacherName} | Status: {classItem.status} | Duration: {classItem.duration} minutes
              </Typography>
              <Typography variant="body2">
                Scheduled: {new Date(classItem.scheduledTime).toLocaleString()}
              </Typography>
              <Typography variant="body2">
                Participants: {classItem.currentParticipants || 0}/{classItem.maxParticipants}
              </Typography>
              <Typography variant="body2" color="primary">
                Meeting ID: {classItem.roomId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Meeting URL: {classItem.meetingUrl}
              </Typography>
            </Paper>
          </ListItem>
        ))}
        {onlineClasses.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
            No online classes found.
          </Typography>
        )}
      </List>
    </Box>
  );
}

export default React.memo(AdminOnlineClasses);