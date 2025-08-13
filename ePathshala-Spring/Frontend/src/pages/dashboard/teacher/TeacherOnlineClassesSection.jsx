import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Button, Alert, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { VideoCall as VideoCallIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, ContentCopy as CopyIcon } from '@mui/icons-material';
import { useAuth } from '../../../utils/auth';

function TeacherOnlineClassesSection() {
  const { user } = useAuth();
  const [onlineClasses, setOnlineClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [classForm, setClassForm] = useState({
    title: '',
    subject: '',
    scheduledTime: '',
    duration: 60,
    maxParticipants: 30,
    description: ''
  });

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // TODO: Replace with actual API call when available
      // const classesData = await getTeacherOnlineClasses();
      // setOnlineClasses(Array.isArray(classesData) ? classesData : []);
      
      // Mock data for now
      setOnlineClasses([
        {
          id: 1,
          title: 'Mathematics - Class 10A',
          subject: 'Mathematics',
          scheduledTime: '2025-08-07T09:00:00',
          status: 'scheduled',
          duration: 60,
          currentParticipants: 0,
          maxParticipants: 30,
          meetingId: 'epathshala-1754321724989',
          meetingUrl: 'https://meet.jit.si/epathshala-1754321724989',
          description: 'Advanced mathematics concepts for Class 10A students'
        }
      ]);
    } catch (err) {
      setError('Failed to load online classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateClass = () => {
    setClassForm({
      title: '',
      subject: '',
      scheduledTime: '',
      duration: 60,
      maxParticipants: 30,
      description: ''
    });
    setCreateDialogOpen(true);
  };

  const handleEditClass = (classItem) => {
    // Navigate to full online class manager or open edit modal
    window.location.href = `/teacher/online-classes/${classItem.id}/edit`;
  };

  const handleDeleteClass = (classItem) => {
    setSelectedClass(classItem);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteClass = async () => {
    if (!selectedClass) return;

    setDeleting(true);
    try {
      // TODO: Replace with actual API call
      // await deleteOnlineClass(selectedClass.id);
      
      // Mock deletion
      setOnlineClasses(prev => prev.filter(c => c.id !== selectedClass.id));
      setDeleteDialogOpen(false);
      setSelectedClass(null);
    } catch (err) {
      setError('Failed to delete online class');
    } finally {
      setDeleting(false);
    }
  };

  const handleCreateClassSubmit = async () => {
    setCreating(true);
    try {
      // TODO: Replace with actual API call
      // await createOnlineClass(classForm);
      
      // Mock creation
      const newClass = {
        id: Date.now(),
        ...classForm,
        status: 'scheduled',
        currentParticipants: 0,
        meetingId: `epathshala-${Date.now()}`,
        meetingUrl: `https://meet.jit.si/epathshala-${Date.now()}`
      };
      setOnlineClasses(prev => [...prev, newClass]);
      setCreateDialogOpen(false);
      setClassForm({
        title: '',
        subject: '',
        scheduledTime: '',
        duration: 60,
        maxParticipants: 30,
        description: ''
      });
    } catch (err) {
      setError('Failed to create online class');
    } finally {
      setCreating(false);
    }
  };

  const handleJoinClass = (classItem) => {
    if (classItem.meetingUrl) {
      window.open(classItem.meetingUrl, '_blank');
    }
  };

  const handleCopyInviteLink = (classItem) => {
    if (classItem.meetingUrl) {
      navigator.clipboard.writeText(classItem.meetingUrl);
      // You could show a snackbar notification here
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'primary';
      case 'ongoing': return 'success';
      case 'completed': return 'default';
      default: return 'default';
    }
  };

  return (
    <>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Online Classes
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateClass}
            >
              Create Class
            </Button>
          </Box>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <List>
            {onlineClasses && onlineClasses.length > 0 ? (
              onlineClasses.map((classItem, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={classItem.title}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {formatDateTime(classItem.scheduledTime)} | Duration: {classItem.duration} minutes
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.secondary">
                          Participants: {classItem.currentParticipants}/{classItem.maxParticipants} | 
                          Meeting ID: {classItem.meetingId}
                        </Typography>
                        {classItem.description && (
                          <Typography component="span" variant="body2" color="text.secondary" display="block">
                            {classItem.description}
                          </Typography>
                        )}
                      </>
                    }
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<VideoCallIcon />}
                      onClick={() => handleJoinClass(classItem)}
                      color={getStatusColor(classItem.status)}
                    >
                      Join
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CopyIcon />}
                      onClick={() => handleCopyInviteLink(classItem)}
                      size="small"
                    >
                      Copy Link
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditClass(classItem)}
                      size="small"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteClass(classItem)}
                      size="small"
                      color="error"
                    >
                      Delete
                    </Button>
                  </Box>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No online classes scheduled" />
              </ListItem>
            )}
          </List>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              variant="text"
              onClick={handleCreateClass}
              sx={{ textTransform: 'none' }}
            >
              Manage Classes
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Create Class Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Online Class</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Class Title"
            value={classForm.title}
            onChange={(e) => setClassForm({ ...classForm, title: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Subject"
            value={classForm.subject}
            onChange={(e) => setClassForm({ ...classForm, subject: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            type="datetime-local"
            label="Scheduled Time"
            value={classForm.scheduledTime}
            onChange={(e) => setClassForm({ ...classForm, scheduledTime: e.target.value })}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            type="number"
            label="Duration (minutes)"
            value={classForm.duration}
            onChange={(e) => setClassForm({ ...classForm, duration: parseInt(e.target.value) })}
            margin="normal"
            required
            inputProps={{ min: 15, max: 180 }}
          />
          <TextField
            fullWidth
            type="number"
            label="Max Participants"
            value={classForm.maxParticipants}
            onChange={(e) => setClassForm({ ...classForm, maxParticipants: parseInt(e.target.value) })}
            margin="normal"
            required
            inputProps={{ min: 1, max: 100 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={classForm.description}
            onChange={(e) => setClassForm({ ...classForm, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateClassSubmit} 
            variant="contained" 
            disabled={creating || !classForm.title || !classForm.subject || !classForm.scheduledTime}
          >
            {creating ? 'Creating...' : 'Create Class'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Online Class</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the online class "{selectedClass?.title}"?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            This action cannot be undone. All class data and meeting information will be permanently deleted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={confirmDeleteClass} 
            variant="contained" 
            color="error"
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default React.memo(TeacherOnlineClassesSection); 