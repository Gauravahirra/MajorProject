import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  Grid,
  Paper,
  Divider
} from '@mui/material';
import {
  VideoCall as VideoCallIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import { useAuth } from '../../utils/auth';
import JitsiMeet from '../common/JitsiMeet';

function OnlineClassManager() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [jitsiDialog, setJitsiDialog] = useState(false);
  const [activeClass, setActiveClass] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    scheduledTime: '',
    duration: 60,
    maxParticipants: 30
  });

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/teacher/online-classes?teacherId=${user?.id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        const data = await response.json();
        setClasses(data);
      } else {
        setError('Failed to load online classes');
      }
    } catch (error) {
      setError('Failed to load online classes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async () => {
    // Validate required fields
    if (!formData.title || !formData.subject || !formData.scheduledTime) {
      setError('Please fill in all required fields (Title, Subject, and Scheduled Time)');
      return;
    }

    try {
      const response = await fetch(`/api/teacher/online-classes?teacherId=${user?.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setCreateDialog(false);
        setFormData({
          title: '',
          subject: '',
          description: '',
          scheduledTime: '',
          duration: 60,
          maxParticipants: 30
        });
        loadClasses();
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create class');
      }
    } catch (error) {
      setError('Failed to create class');
    }
  };

  const handleEditClass = async () => {
    // Validate required fields
    if (!formData.title || !formData.subject || !formData.scheduledTime) {
      setError('Please fill in all required fields (Title, Subject, and Scheduled Time)');
      return;
    }

    try {
      const response = await fetch(`/api/teacher/online-classes/${selectedClass.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setEditDialog(false);
        setSelectedClass(null);
        loadClasses();
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update class');
      }
    } catch (error) {
      setError('Failed to update class');
    }
  };

  const handleDeleteClass = async (classId) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        const response = await fetch(`/api/teacher/online-classes/${classId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (response.ok) {
          loadClasses();
        } else {
          setError('Failed to delete class');
        }
      } catch (error) {
        setError('Failed to delete class');
      }
    }
  };

  const startClass = (classItem) => {
    setActiveClass(classItem);
    setJitsiDialog(true);
  };

  const stopClass = () => {
    setActiveClass(null);
    setJitsiDialog(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'info';
      case 'active': return 'success';
      case 'completed': return 'default';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString();
  };

  const copyInviteLink = (classItem) => {
    const link = `${window.location.origin}/join-class/${classItem.id}`;
    navigator.clipboard.writeText(link);
    // You could add a toast notification here
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Online Class Manager
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" color="text.secondary">
          Manage your virtual classrooms
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialog(true)}
        >
          Create New Class
        </Button>
      </Box>

      <Grid container spacing={3}>
        {classes.map((classItem) => (
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
                    {classItem.currentParticipants || 0}/{classItem.maxParticipants} participants
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {classItem.status === 'scheduled' && (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<PlayIcon />}
                      onClick={() => startClass(classItem)}
                    >
                      Start Class
                    </Button>
                  )}

                  {classItem.status === 'active' && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<StopIcon />}
                      onClick={() => stopClass()}
                    >
                      End Class
                    </Button>
                  )}

                  <IconButton
                    size="small"
                    onClick={() => copyInviteLink(classItem)}
                    title="Copy invite link"
                  >
                    <LinkIcon />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedClass(classItem);
                      setFormData({
                        title: classItem.title,
                        subject: classItem.subject,
                        description: classItem.description,
                        scheduledTime: classItem.scheduledTime,
                        duration: classItem.duration,
                        maxParticipants: classItem.maxParticipants
                      });
                      setEditDialog(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteClass(classItem.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create Class Dialog */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Online Class</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Class Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Scheduled Time"
            type="datetime-local"
            value={formData.scheduledTime}
            onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Duration (minutes)"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Max Participants"
            type="number"
            value={formData.maxParticipants}
            onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateClass} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Class Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Online Class</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Class Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Scheduled Time"
            type="datetime-local"
            value={formData.scheduledTime}
            onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Duration (minutes)"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Max Participants"
            type="number"
            value={formData.maxParticipants}
            onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditClass} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Jitsi Meet Dialog */}
      {activeClass && (
        <JitsiMeet
          isOpen={jitsiDialog}
          onClose={() => setJitsiDialog(false)}
          roomName={`epathshala-${activeClass.id}`}
          userRole="teacher"
          userName={user?.name || 'Teacher'}
        />
      )}
    </Box>
  );
}

export default OnlineClassManager; 