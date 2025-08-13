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
  Snackbar,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Upload as UploadIcon,
  Download as DownloadIcon,
  Send as SendIcon,
  ExpandMore as ExpandMoreIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useAuth } from '../../utils/auth';

const AssignmentTracker = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openSubmit, setOpenSubmit] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const [submitData, setSubmitData] = useState({
    file: null,
    submissionText: ''
  });

  useEffect(() => {
    loadAssignments();
    loadSubmissions();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/assignments/class/${user.className}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Check submission status for each assignment
        const assignmentsWithStatus = await Promise.all(
          data.map(async (assignment) => {
            try {
              const statusResponse = await fetch(`/api/assignments/${assignment.id}/submitted/${user.id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
              });
              if (statusResponse.ok) {
                const { hasSubmitted } = await statusResponse.json();
                return {
                  ...assignment,
                  hasSubmitted,
                  status: hasSubmitted ? 'submitted' : 'pending'
                };
              }
            } catch (error) {
              console.error(`Error checking submission status for assignment ${assignment.id}:`, error);
            }
            return { ...assignment, hasSubmitted: false, status: 'pending' };
          })
        );
        
        setAssignments(assignmentsWithStatus);
      }
    } catch (error) {
      console.error('Error loading assignments:', error);
      showMessage('Error loading assignments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadSubmissions = async () => {
    try {
      const response = await fetch(`/api/assignments/student/${user.id}/submissions`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
    }
  };

  const handleFileChange = (event) => {
    setSubmitData({
      ...submitData,
      file: event.target.files[0]
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('studentId', user.id);
      
      if (submitData.file) {
        formDataToSend.append('file', submitData.file);
      }
      
      if (submitData.submissionText) {
        formDataToSend.append('submissionText', submitData.submissionText);
      }

      const response = await fetch(`/api/assignments/${selectedAssignment.id}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        showMessage('Assignment submitted successfully!', 'success');
        setOpenSubmit(false);
        setSelectedAssignment(null);
        setSubmitData({ file: null, submissionText: '' });
        loadSubmissions();
      } else {
        showMessage('Error submitting assignment', 'error');
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
      showMessage('Error submitting assignment', 'error');
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

  const checkSubmissionStatus = (assignmentId) => {
    return submissions.find(sub => sub.assignmentId === assignmentId);
  };

  const showMessage = (msg, sev) => {
    setMessage(msg);
    setSeverity(sev);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'warning';
      case 'graded': return 'success';
      case 'late': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Assignment Tracker
      </Typography>

      <Grid container spacing={3}>
        {assignments.map((assignment) => {
          const submission = checkSubmissionStatus(assignment.id);
          const isSubmitted = !!submission;
          const isOverdue = new Date(assignment.dueDate) < new Date();

          return (
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
                      color={isOverdue ? "error" : "primary"}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    {isSubmitted && (
                      <Chip 
                        label={submission.status}
                        color={getStatusColor(submission.status)}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                    )}
                    {submission?.grade && (
                      <Chip 
                        label={`Grade: ${submission.grade}/100`}
                        color="success"
                        size="small"
                      />
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {assignment.fileUrl && (
                      <Button
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownload(assignment.fileUrl)}
                      >
                        Download Assignment
                      </Button>
                    )}
                    
                    {!isSubmitted && (
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<SendIcon />}
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setOpenSubmit(true);
                        }}
                        disabled={isOverdue}
                      >
                        Submit Solution
                      </Button>
                    )}
                    
                    {isSubmitted && submission.submissionFileUrl && (
                      <Button
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownload(submission.submissionFileUrl)}
                      >
                        Download Submission
                      </Button>
                    )}
                  </Box>

                  {submission?.feedback && (
                    <Accordion sx={{ mt: 2 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>View Feedback</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body2">
                          {submission.feedback}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Dialog open={openSubmit} onClose={() => setOpenSubmit(false)} maxWidth="md" fullWidth>
        <DialogTitle>Submit Assignment</DialogTitle>
        <DialogContent>
          {selectedAssignment && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedAssignment.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {selectedAssignment.description}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                    fullWidth
                    sx={{ height: 56 }}
                  >
                    Upload Solution File
                    <input
                      type="file"
                      hidden
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
                    />
                  </Button>
                  {submitData.file && (
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      Selected file: {submitData.file.name}
                    </Typography>
                  )}
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Text Submission (Optional)"
                    multiline
                    rows={4}
                    value={submitData.submissionText}
                    onChange={(e) => setSubmitData({ ...submitData, submissionText: e.target.value })}
                    placeholder="Write your solution here..."
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSubmit(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={loading || (!submitData.file && !submitData.submissionText)}
          >
            {loading ? 'Submitting...' : 'Submit Assignment'}
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

export default AssignmentTracker; 