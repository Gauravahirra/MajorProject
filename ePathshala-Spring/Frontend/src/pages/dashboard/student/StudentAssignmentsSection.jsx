import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Alert,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip
} from '@mui/material';
import { Upload as UploadIcon, Download as DownloadIcon } from '@mui/icons-material';
import { getStudentAssignments, submitAssignment } from '../../../api/assignments';
import { useAuth } from '../../../utils/auth';
import { useResponsive, typography, buttonStyles, cardStyles } from '../../../utils/responsive';

function StudentAssignmentsSection() {
  const { user } = useAuth();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionForm, setSubmissionForm] = useState({ text: '', file: null });
  const [submitting, setSubmitting] = useState(false);
  const [studentId, setStudentId] = useState(null);

  const className = 'Class 10A'; // TODO: Replace with dynamic class from user profile

  useEffect(() => {
    // Fetch studentId using user.id
    const fetchStudentId = async () => {
      const token = localStorage.getItem('token');
      if (user && user.id && token) {
        try {
          const res = await fetch(`/api/student/details/${user.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setStudentId(data.id);
          } else {
            setError('Failed to fetch student details.');
          }
        } catch (err) {
          setError('Failed to fetch student details.');
        }
      }
    };
    fetchStudentId();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const assignmentsData = await getStudentAssignments(className);
      console.log('Assignments data:', assignmentsData); // Debug log
      
      // Check submission status for each assignment
      const assignmentsWithStatus = await Promise.all(
        (Array.isArray(assignmentsData) ? assignmentsData : []).map(async (assignment) => {
          try {
            const response = await fetch(`/api/assignments/${assignment.id}/submitted/${studentId}`, {
              headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.ok) {
              const { hasSubmitted } = await response.json();
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
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setError('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDownload = async (assignment) => {
    if (!assignment || !assignment.fileUrl) {
      setError('No file available for download.');
      return;
    }
    const downloadUrl = `/api/assignments/download/${assignment.fileUrl}`;
    try {
      const response = await fetch(downloadUrl, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = assignment.fileName || 'assignment-file';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(`Download failed: ${err.message}`);
    }
  };

  const handleSubmitAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setSubmissionForm({ text: '', file: null });
    setSubmitDialogOpen(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (1MB = 1,048,576 bytes)
      const maxSize = 1024 * 1024; // 1MB in bytes
      if (file.size > maxSize) {
        setError(`File size must be less than 1MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
        return;
      }
      setSubmissionForm(prev => ({ ...prev, file }));
      setError('');
    }
  };

  const handleSubmitSubmission = async () => {
    if (!selectedAssignment) {
      setError('No assignment selected');
      return;
    }
    if (!studentId) {
      setError('Unable to identify student. Please re-login.');
      return;
    }
    if (!submissionForm.text.trim() && !submissionForm.file) {
      setError('Please provide submission text or attach a file');
      return;
    }

    setSubmitting(true);
    try {
      await submitAssignment(
        selectedAssignment.id,
        studentId,
        submissionForm.text,
        submissionForm.file
      );
      setSuccess('Assignment submitted successfully!');
      setSubmitDialogOpen(false);
      setSubmissionForm({ text: '', file: null });
      fetchData(); // Refresh assignments
    } catch (err) {
      const errorMessage = err.message.toLowerCase();
      if (errorMessage.includes('already submitted')) {
        setError('This assignment has already been submitted. You cannot submit it again.');
        setSubmitDialogOpen(false);
        fetchData(); // Refresh assignments to update status
      } else if (errorMessage.includes('http error! status: 500')) {
        setError('Assignment has already been submitted. Please refresh the page.');
        setSubmitDialogOpen(false);
        fetchData(); // Refresh assignments to update status
      } else {
        setError('Failed to submit assignment: ' + err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'submitted':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>Loading assignments...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: 600,
          fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
          mb: { xs: 2, sm: 3 }
        }}
      >
        My Assignments
      </Typography>

      {assignments.length === 0 ? (
        <Card sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: { xs: 2, sm: 3 },
          textAlign: 'center'
        }}>
          <Typography variant="h6" color="text.secondary">
            No assignments available at the moment.
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {assignments.map((assignment) => (
            <Grid item xs={12} sm={6} md={4} key={assignment.id}>
              <Card sx={{
                height: '100%',
                borderRadius: { xs: 2, sm: 3 },
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
                      }}
                    >
                      {assignment.title}
                    </Typography>
                    <Chip
                      label={assignment.status || 'Pending'}
                      color={getStatusColor(assignment.status)}
                      size="small"
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      lineHeight: 1.5
                    }}
                  >
                    {assignment.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        color: 'text.secondary'
                      }}
                    >
                      <strong>Subject:</strong> {assignment.subject}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        color: 'text.secondary'
                      }}
                    >
                      <strong>Due Date:</strong> {formatDate(assignment.dueDate)}
                    </Typography>
                  </Box>

                  <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 1, sm: 2 }
                  }}>
                    {assignment.fileUrl && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownload(assignment)}
                        sx={{
                          ...buttonStyles.secondary,
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}
                      >
                        Download
                      </Button>
                    )}

                    {assignment.hasSubmitted ? (
                      <Button
                        variant="outlined"
                        size="small"
                        disabled
                        sx={{
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          color: 'success.main',
                          borderColor: 'success.main',
                          '&.Mui-disabled': {
                            color: 'success.main',
                            borderColor: 'success.main',
                            opacity: 0.7
                          }
                        }}
                      >
                        ✓ Already Submitted
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<UploadIcon />}
                        onClick={() => handleSubmitAssignment(assignment)}
                        sx={{
                          ...buttonStyles.primary,
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}
                      >
                        Submit
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Submit Assignment Dialog */}
      <Dialog
        open={submitDialogOpen}
        onClose={() => setSubmitDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: { xs: 2, sm: 3 },
            m: { xs: 2, sm: 4 }
          }
        }}
      >
        <DialogTitle sx={{
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          fontWeight: 600
        }}>
          Submit Assignment: {selectedAssignment?.title}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={isMobile ? 4 : 6}
            label="Submission Text"
            value={submissionForm.text}
            onChange={(e) => setSubmissionForm(prev => ({ ...prev, text: e.target.value }))}
            sx={{ mb: 2, mt: 1 }}
          />
          <input
            accept=".pdf,.doc,.docx,.txt"
            style={{ display: 'none' }}
            id="file-upload"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<UploadIcon />}
              sx={{ mb: 2 }}
            >
              Upload File (Optional)
            </Button>
          </label>
          {submissionForm.file && (
            <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
              Selected file: {submissionForm.file.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, sm: 3 } }}>
          <Button
            onClick={() => setSubmitDialogOpen(false)}
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitSubmission}
            variant="contained"
            disabled={submitting || (!submissionForm.text.trim() && !submissionForm.file)}
            sx={{
              ...buttonStyles.primary,
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Assignment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default StudentAssignmentsSection; 