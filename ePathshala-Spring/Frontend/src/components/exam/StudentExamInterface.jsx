import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Alert,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  Visibility as ViewIcon,
  History as HistoryIcon,
  Quiz as QuizIcon,
  Assessment as AssessmentIcon,
  Timer as TimerIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useAuth } from '../../utils/auth';
import {
  getAvailableExams,
  getExamHistory,
  startExam,
  submitExam,
  getExamResult,
  getExamQuestions,
  getExamTimer
} from '../../api/exams';
import MCQExamInterface from './MCQExamInterface';
import ExamResultVisualization from './ExamResultVisualization';

const StudentExamInterface = () => {
  const { user } = useAuth();
  const { examId } = useParams();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const [availableExams, setAvailableExams] = useState([]);
  const [examHistory, setExamHistory] = useState([]);
  const [currentExam, setCurrentExam] = useState(null);
  const [examQuestions, setExamQuestions] = useState([]);
  const [examResult, setExamResult] = useState(null);
  const [showExamDialog, setShowExamDialog] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [availableData, historyData] = await Promise.all([
        getAvailableExams(),
        getExamHistory()
      ]);
      
      setAvailableExams(Array.isArray(availableData) ? availableData : []);
      setExamHistory(Array.isArray(historyData) ? historyData : []);
    } catch (error) {
      console.error('Error loading exam data:', error);
      setAvailableExams([]);
      setExamHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = async (examId) => {
    try {
      setLoading(true);
      const examData = await startExam(examId);
      const questionsData = await getExamQuestions(examId);
      
      console.log('Exam data:', examData);
      console.log('Questions data:', questionsData);
      
      setCurrentExam(examData);
      // The backend now returns questions directly in the exam data
      const questions = questionsData.questions || [];
      setExamQuestions(Array.isArray(questions) ? questions : []);
      setShowExamDialog(true);
    } catch (error) {
      console.error('Error starting exam:', error);
      
      // Show user-friendly error message
      let errorMessage = 'Failed to start exam.';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitExam = async (answers) => {
    try {
      setLoading(true);
      const result = await submitExam(currentExam.id, answers);
      setExamResult(result);
      setShowExamDialog(false);
      setShowResultDialog(true);
      loadData(); // Refresh exam history
    } catch (error) {
      console.error('Error submitting exam:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewResult = async (examId) => {
    try {
      setLoading(true);
      const result = await getExamResult(examId);
      setExamResult(result);
      setShowResultDialog(true);
    } catch (error) {
      console.error('Error loading exam result:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeUp = () => {
    // Auto-submit when time is up
    handleSubmitExam({});
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'UPCOMING': return 'warning';
      case 'COMPLETED': return 'info';
      default: return 'default';
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString();
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getGradeColor = (grade) => {
    if (grade === 'A' || grade === 'A+') return 'success';
    if (grade === 'B' || grade === 'B+') return 'primary';
    if (grade === 'C' || grade === 'C+') return 'warning';
    return 'error';
  };

  // If routed with :examId, show exam detail page instead of the generic center
  const selectedExam = useMemo(() => {
    if (!examId) return null;
    return availableExams.find((e) => String(e.id) === String(examId)) || null;
  }, [availableExams, examId]);

  if (examId) {
    return (
      <Box sx={{ p: 3 }}>
        <Button variant="text" onClick={() => navigate('/student/exams')} sx={{ mb: 2 }}>
          ← Back to Exams
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          {selectedExam ? selectedExam.title : 'Exam Details'}
        </Typography>

        {!selectedExam ? (
          loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <Alert severity="warning">Exam not found or not available.</Alert>
          )
        ) : (
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Chip label={selectedExam.status} color={getStatusColor(selectedExam.status)} size="small" />
              </Box>
              <Typography variant="body1" paragraph>{selectedExam.description}</Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2"><strong>Course:</strong> {selectedExam.courseName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2"><strong>Duration:</strong> {formatDuration(selectedExam.durationMinutes)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2"><strong>Total Marks:</strong> {selectedExam.totalMarks}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2"><strong>Questions:</strong> {selectedExam.questionCount || 0}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary"><strong>Start:</strong> {formatDateTime(selectedExam.startTime)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary"><strong>End:</strong> {formatDateTime(selectedExam.endTime)}</Typography>
                </Grid>
              </Grid>

              {selectedExam.negativeMarking && (
                <Chip label={`Negative Marking: ${selectedExam.negativeMarkingPercentage}%`} color="error" size="small" sx={{ mb: 2 }} />
              )}

              {selectedExam.status === 'ACTIVE' ? (
                <Button
                  variant="contained"
                  startIcon={<StartIcon />}
                  onClick={() => handleStartExam(selectedExam.id)}
                  disabled={loading}
                >
                  Start Exam
                </Button>
              ) : (
                <Alert severity={selectedExam.status === 'UPCOMING' ? 'info' : 'warning'}>
                  {selectedExam.status === 'UPCOMING' ? 'This exam is not active yet.' : 'This exam is no longer active.'}
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Exam Interface Dialog */}
        <Dialog 
          open={showExamDialog} 
          onClose={() => setShowExamDialog(false)} 
          maxWidth="lg" 
          fullWidth
          disableEscapeKeyDown
        >
          <DialogTitle>
            {currentExam?.title}
          </DialogTitle>
          <DialogContent>
            {currentExam && examQuestions.length > 0 ? (
              <MCQExamInterface
                exam={currentExam}
                questions={examQuestions}
                onSubmit={handleSubmitExam}
                onTimeUp={handleTimeUp}
              />
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  Loading exam questions...
                </Typography>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Exam Center
      </Typography>

      <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Available Exams" icon={<QuizIcon />} />
        <Tab label="Exam History" icon={<HistoryIcon />} />
      </Tabs>

      {currentTab === 0 && (
        <Box>
          <Typography variant="h6" mb={2}>
            Available Exams
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : availableExams.length > 0 ? (
            <Grid container spacing={3}>
              {availableExams.map((exam) => (
                <Grid item xs={12} md={6} lg={4} key={exam.id}>
                  <Card>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Typography variant="h6" component="h2">
                          {exam.title}
                        </Typography>
                        <Chip
                          label={exam.status}
                          color={getStatusColor(exam.status)}
                          size="small"
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary" paragraph>
                        {exam.description}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2">
                          <strong>Course:</strong> {exam.courseName}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Duration:</strong> {formatDuration(exam.durationMinutes)}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Total Marks:</strong> {exam.totalMarks}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Questions:</strong> {exam.questionCount || 0}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Start:</strong> {formatDateTime(exam.startTime)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>End:</strong> {formatDateTime(exam.endTime)}
                        </Typography>
                      </Box>

                      {exam.negativeMarking && (
                        <Chip
                          label={`Negative Marking: ${exam.negativeMarkingPercentage}%`}
                          color="error"
                          size="small"
                          sx={{ mb: 1 }}
                        />
                      )}

                      <Box display="flex" gap={1} flexWrap="wrap">
                        {exam.status === 'ACTIVE' && (
                          <Button
                            variant="contained"
                            startIcon={<StartIcon />}
                            onClick={() => navigate(`/student/exams/${exam.id}`)}
                            disabled={loading}
                          >
                            Go to Exam
                          </Button>
                        )}
                        
                        {exam.status === 'UPCOMING' && (
                          <Button
                            variant="outlined"
                            startIcon={<TimerIcon />}
                            disabled
                          >
                            Coming Soon
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">No available exams at the moment.</Alert>
          )}
        </Box>
      )}

      {currentTab === 1 && (
        <Box>
          <Typography variant="h6" mb={2}>
            Exam History
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : examHistory.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Exam</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>End Time</TableCell>
                    <TableCell>Marks Obtained</TableCell>
                    <TableCell>Percentage</TableCell>
                    <TableCell>Grade</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {examHistory.map((result) => (
                    <TableRow key={result.attemptId}>
                      <TableCell>{result.examTitle}</TableCell>
                      <TableCell>{formatDateTime(result.startTime)}</TableCell>
                      <TableCell>{formatDateTime(result.endTime)}</TableCell>
                      <TableCell>{result.obtainedMarks}/{result.totalMarks}</TableCell>
                      <TableCell>{result.percentage}%</TableCell>
                      <TableCell>
                        <Chip
                          label={result.grade}
                          color={getGradeColor(result.grade)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={result.status}
                          color={result.status === 'COMPLETED' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          startIcon={<ViewIcon />}
                          onClick={() => navigate(`/student/exams/${result.examId}/result`)}
                        >
                          View Result
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">No exam history available.</Alert>
          )}
        </Box>
      )}

      {/* Exam Interface Dialog for generic listing view */}
      <Dialog 
        open={showExamDialog} 
        onClose={() => setShowExamDialog(false)} 
        maxWidth="lg" 
        fullWidth
        disableEscapeKeyDown
      >
        <DialogTitle>
          {currentExam?.title}
        </DialogTitle>
        <DialogContent>
          {currentExam && examQuestions.length > 0 ? (
            <MCQExamInterface
              exam={currentExam}
              questions={examQuestions}
              onSubmit={handleSubmitExam}
              onTimeUp={handleTimeUp}
            />
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                Loading exam questions...
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Result Dialog */}
      <Dialog 
        open={showResultDialog} 
        onClose={() => setShowResultDialog(false)} 
        maxWidth="lg" 
        fullWidth
      >
        <DialogTitle>
          Exam Result
        </DialogTitle>
        <DialogContent>
          {examResult && (
            <ExamResultVisualization result={examResult} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResultDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentExamInterface; 