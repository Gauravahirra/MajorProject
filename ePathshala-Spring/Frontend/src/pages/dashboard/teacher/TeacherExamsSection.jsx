import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Button, Alert, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Quiz as QuizIcon, Add as AddIcon, Assessment as AssessmentIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getFacultyExams, deleteExam } from '../../../api/exams';
import { useAuth } from '../../../utils/auth';

function TeacherExamsSection() {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const examsData = await getFacultyExams();
      setExams(Array.isArray(examsData) ? examsData : []);
    } catch (err) {
      setError('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateExam = () => {
    // Navigate to exam creation page
    window.location.href = '/teacher/exams/create';
  };

  const handleEditExam = (examId) => {
    // Navigate to exam editing page
    window.location.href = `/teacher/exams/${examId}/edit`;
  };

  const handleViewResults = (examId) => {
    // Navigate to exam results page
    window.location.href = `/teacher/exams/${examId}/results`;
  };

  const handleDeleteExam = (exam) => {
    setSelectedExam(exam);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteExam = async () => {
    if (!selectedExam) return;

    setDeleting(true);
    try {
      await deleteExam(selectedExam.id);
      setDeleteDialogOpen(false);
      setSelectedExam(null);
      fetchData(); // Refresh the list
    } catch (err) {
      setError('Failed to delete exam');
    } finally {
      setDeleting(false);
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'INACTIVE': return 'default';
      case 'DRAFT': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (isActive) => {
    return isActive ? 'Active' : 'Inactive';
  };

  return (
    <>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Exams
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateExam}
            >
              Create Exam
            </Button>
          </Box>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <List>
            {exams && exams.length > 0 ? (
              exams.map((exam, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={exam.title}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          Duration: {exam.durationMinutes} minutes | Total Marks: {exam.totalMarks}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.secondary">
                          Status: {getStatusText(exam.isActive)} | 
                          Questions: {exam.questionCount || 0} |
                          Created: {formatDateTime(exam.createdAt || new Date())}
                        </Typography>
                      </>
                    }
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditExam(exam.id)}
                      size="small"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<AssessmentIcon />}
                      onClick={() => handleViewResults(exam.id)}
                      size="small"
                    >
                      Results
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteExam(exam)}
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
                <ListItemText primary="No exams created yet" />
              </ListItem>
            )}
          </List>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              variant="text"
              onClick={handleCreateExam}
              sx={{ textTransform: 'none' }}
            >
              Manage Exams
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Exam</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the exam "{selectedExam?.title}"?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            This action cannot be undone. All exam data, questions, and student attempts will be permanently deleted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={confirmDeleteExam} 
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

export default React.memo(TeacherExamsSection); 