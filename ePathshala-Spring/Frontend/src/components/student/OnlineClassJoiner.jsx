import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  VideoCall as VideoCallIcon,
  PlayArrow as PlayIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  Link as LinkIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';
import { useAuth } from '../../utils/auth';
import JitsiMeet from '../common/JitsiMeet';

function OnlineClassJoiner() {
  const { user } = useAuth();
  const [availableClasses, setAvailableClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [jitsiDialog, setJitsiDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [joinDialog, setJoinDialog] = useState(false);
  const [roomId, setRoomId] = useState('');

  useEffect(() => {
    loadAvailableClasses();
  }, []);

  const loadAvailableClasses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/student/online-classes/available', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableClasses(data);
      } else {
        setError('Failed to load available classes');
      }
    } catch (error) {
      setError('Failed to load available classes');
    } finally {
      setLoading(false);
    }
  };

  const joinClass = async (classItem) => {
    try {
      const response = await fetch(`/api/student/online-classes/join/${classItem.roomId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        setSelectedClass(classItem);
        setJitsiDialog(true);
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to join class');
      }
    } catch (error) {
      setError('Failed to join class');
    }
  };

  const leaveClass = async (classItem) => {
    try {
      const response = await fetch(`/api/student/online-classes/leave/${classItem.roomId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        setJitsiDialog(false);
        setSelectedClass(null);
        loadAvailableClasses();
      } else {
        setError('Failed to leave class');
      }
    } catch (error) {
      setError('Failed to leave class');
    }
  };

  const copyInviteLink = (classItem) => {
    const link = `${window.location.origin}/join-class/${classItem.roomId}`;
    navigator.clipboard.writeText(link);
    // You could add a toast notification here
  };

  const joinByRoomId = async () => {
    if (!roomId.trim()) {
      setError('Please enter a room ID');
      return;
    }

    try {
      const response = await fetch(`/api/student/online-classes/room/${roomId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        const classData = await response.json();
        setSelectedClass(classData);
        setJitsiDialog(true);
        setJoinDialog(false);
        setRoomId('');
        setError('');
      } else {
        setError('Class not found or not available');
      }
    } catch (error) {
      setError('Failed to join class');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'scheduled': return 'info';
      case 'completed': return 'default';
      default: return 'default';
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Join Online Classes
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" color="text.secondary">
          Available virtual classrooms
        </Typography>
        <Button
          variant="contained"
          startIcon={<VideoCallIcon />}
          onClick={() => setJoinDialog(true)}
        >
          Join by Room ID
        </Button>
      </Box>

      <Grid container spacing={3}>
        {availableClasses.map((classItem) => (
          <Grid item xs={12} md={6} lg={4} key={classItem.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6">{classItem.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {classItem.subject}
                    </Typography>
                  </Box>
                  <Chip
                    label={classItem.status}
                    color={getStatusColor(classItem.status)}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" sx={{ mb: 2 }}>
                  {classItem.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <ScheduleIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {formatDateTime(classItem.scheduledTime)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <PeopleIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {classItem.currentParticipants}/{classItem.maxParticipants} participants
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {classItem.status === 'active' && (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<PlayIcon />}
                      onClick={() => joinClass(classItem)}
                    >
                      Join Class
                    </Button>
                  )}

                  <IconButton
                    size="small"
                    onClick={() => copyInviteLink(classItem)}
                    title="Copy invite link"
                  >
                    <CopyIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Join by Room ID Dialog */}
      <Dialog open={joinDialog} onClose={() => setJoinDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Join Class by Room ID</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            margin="normal"
            placeholder="Enter the room ID provided by your teacher"
            helperText="The room ID is usually provided by your teacher"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJoinDialog(false)}>Cancel</Button>
          <Button onClick={joinByRoomId} variant="contained">Join</Button>
        </DialogActions>
      </Dialog>

      {/* Jitsi Meet Dialog */}
      {selectedClass && (
        <JitsiMeet
          isOpen={jitsiDialog}
          onClose={() => {
            setJitsiDialog(false);
            leaveClass(selectedClass);
          }}
          roomName={selectedClass.roomId}
          userRole="student"
          userName={user?.name || 'Student'}
        />
      )}
    </Box>
  );
}

export default OnlineClassJoiner; 