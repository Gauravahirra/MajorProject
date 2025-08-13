import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Upload as UploadIcon,
  Download as DownloadIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useAuth } from '../../utils/auth';
import { uploadAssignment } from '../../api/assignments';

const AssignmentManager = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    subject: '',
    className: '',
    file: null
  });

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/assignments/teacher/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      }
    } catch (error) {
      console.error('Error loading assignments:', error);
      showMessage('Error loading assignments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    setFormData({
      ...formData,
      file: event.target.files[0]
    });
  };

  const handleUpload = async () => {
    try {
      setLoading(true);
      
      // Use the uploadAssignment API function
      const result = await uploadAssignment(formData);
      
      if (result.id) {
        showMessage('Assignment uploaded successfully!', 'success');
        setOpenUpload(false);
        setFormData({
          title: '',
          description: '',
          dueDate: '',
          subject: '',
          className: '',
          file: null
        });
        loadAssignments();
      } else {
        showMessage(`Error uploading assignment: ${result.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showMessage(`Error uploading assignment: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (filename) => {
    try {
      const response = await fetch(`/api/assignments/download/${filename}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      showMessage('Error downloading file', 'error');
    }
  };

  const showMessage = (msg, sev) => {
    setMessage(msg);
    setSeverity(sev);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Assignment Management
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpenUpload(true)}
        sx={{ mb: 3 }}
      >
        Upload New Assignment
      </Button>

      <Grid container spacing={3}>
        {assignments.map((assignment) => (
          <Grid item xs={12} md={6} key={assignment.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {assignment.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {assignment.subject} - {assignment.className}
                </Typography>
                <Typography variant="body2" paragraph>
                  {assignment.description}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={`Due: ${new Date(assignment.dueDate).toLocaleDateString()}`}
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip 
                    label={`${assignment.submissionCount} submissions`}
                    color="secondary"
                    size="small"
                  />
                </Box>

                {assignment.fileUrl && (
                  <Button
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownload(assignment.fileUrl)}
                  >
                    Download Assignment
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openUpload} onClose={() => setOpenUpload(false)} maxWidth="md" fullWidth>
        <DialogTitle>Upload New Assignment</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Assignment Title"
                value={formData.title}
                onChange={(e) => {
                  console.log('Title changed to:', e.target.value);
                  setFormData({ ...formData, title: e.target.value });
                }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => {
                  console.log('Description changed to:', e.target.value);
                  setFormData({ ...formData, description: e.target.value });
                }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Subject"
                value={formData.subject}
                onChange={(e) => {
                  console.log('Subject changed to:', e.target.value);
                  setFormData({ ...formData, subject: e.target.value });
                }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Class"
                value={formData.className}
                onChange={(e) => {
                  console.log('ClassName changed to:', e.target.value);
                  setFormData({ ...formData, className: e.target.value });
                }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                label="Due Date"
                value={formData.dueDate}
                onChange={(e) => {
                  console.log('DueDate changed to:', e.target.value);
                  setFormData({ ...formData, dueDate: e.target.value });
                }}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                fullWidth
                sx={{ height: 56 }}
              >
                Upload File
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </Button>
            </Grid>
            {formData.file && (
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary">
                  Selected file: {formData.file.name}
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpload(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              console.log('Current formData state:', formData);
              console.log('Form validation:', {
                title: !!formData.title,
                description: !!formData.description,
                dueDate: !!formData.dueDate,
                subject: !!formData.subject,
                className: !!formData.className,
                file: !!formData.file
              });
            }}
            variant="outlined"
            size="small"
          >
            Debug Form
          </Button>
          <Button 
            onClick={handleUpload} 
            variant="contained"
            disabled={loading || !formData.title || !formData.dueDate}
          >
            {loading ? 'Uploading...' : 'Upload Assignment'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
      >
        <Alert onClose={() => setMessage('')} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AssignmentManager; 