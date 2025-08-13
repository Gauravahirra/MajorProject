import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Button, Alert, Box } from '@mui/material';
import { PlayArrow as PlayIcon, Assessment as AssessmentIcon, Warning as WarningIcon } from '@mui/icons-material';
import { getAvailableExams, getExamHistory } from '../../../api/exams';
import { useAuth } from '../../../utils/auth';

function StudentExamsSection() {
  const { user } = useAuth();
  const [availableExams, setAvailableExams] = useState([]);
  const [examHistory, setExamHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Removed confirm/start flow; clicking Start now navigates to exam page

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [availableData, historyData] = await Promise.all([
        getAvailableExams(),
        getExamHistory()
      ]);
      setAvailableExams(Array.isArray(availableData) ? availableData : []);
      setExamHistory(Array.isArray(historyData) ? historyData : []);
    } catch (err) {
      setError('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStartExam = (exam) => {
    // Redirect to exam page without starting it
    window.location.href = `/student/exams/${exam.id}`;
  };

  // Removed confirmStartExam; navigation happens immediately on click

  const handleViewResult = (examId) => {
    // Navigate to exam result page
    window.location.href = `/student/exams/${examId}/result`;
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString();
  };

  const formatDuration = (minutes) => {
    return `${minutes} minutes`;
  };

  const isExamOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            My Exams
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
            Available Exams
          </Typography>
          <List>
            {availableExams && availableExams.length > 0 ? (
              availableExams.map((exam, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {exam.title}
                        {isExamOverdue(exam.endTime) && (
                          <WarningIcon color="warning" fontSize="small" />
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          Duration: {formatDuration(exam.durationMinutes)} | Total Marks: {exam.totalMarks}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.secondary">
                          Questions: {exam.questionCount || 0}
                          {isExamOverdue(exam.endTime) && (
                            <span style={{ color: '#f57c00', fontWeight: 'bold' }}> | OVERDUE</span>
                          )}
                        </Typography>
                      </>
                    }
                  />
                  <Button
                    variant="contained"
                    startIcon={<PlayIcon />}
                    onClick={() => handleStartExam(exam)}
                    color={isExamOverdue(exam.endTime) ? "warning" : "primary"}
                    disabled={isExamOverdue(exam.endTime)}
                  >
                    {isExamOverdue(exam.endTime) ? 'Overdue' : 'Start Exam'}
                  </Button>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No available exams" />
              </ListItem>
            )}
          </List>

          <Typography variant="subtitle1" sx={{ mt: 4, mb: 2 }}>
            Exam History
          </Typography>
          <List>
            {examHistory && examHistory.length > 0 ? (
              examHistory.map((exam, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={exam.examTitle}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          Completed: {formatDateTime(exam.endTime)} | Score: {exam.obtainedMarks}/{exam.totalMarks}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.secondary">
                          Percentage: {exam.percentage?.toFixed(2)}%
                        </Typography>
                      </>
                    }
                  />
                  <Button
                    variant="outlined"
                    startIcon={<AssessmentIcon />}
                    onClick={() => handleViewResult(exam.examId)}
                    size="small"
                  >
                    View Result
                  </Button>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No exam history" />
              </ListItem>
            )}
          </List>
        </CardContent>
      </Card>

      {/* Confirmation dialog removed: direct navigation on Start click */}
    </>
  );
}

export default React.memo(StudentExamsSection); 