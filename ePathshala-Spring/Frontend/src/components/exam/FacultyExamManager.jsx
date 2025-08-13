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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  PlayArrow as ActivateIcon,
  Stop as DeactivateIcon,
  ExpandMore as ExpandMoreIcon,
  Quiz as QuizIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { useAuth } from '../../utils/auth';
import {
  createExam,
  getFacultyExams,
  getExamDetails,
  getExamResults,
  activateExam,
  deactivateExam,
  deleteExam,
  addQuestions
} from '../../api/exams';

const FacultyExamManager = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showQuestionsDialog, setShowQuestionsDialog] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [examResults, setExamResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [examForm, setExamForm] = useState({
    title: '',
    description: '',
    durationMinutes: 60,
    startTime: '',
    endTime: '',
    totalMarks: 100,
    negativeMarking: false,
    negativeMarkingPercentage: 0,
    courseId: 1,
    courseName: '',
    isActive: true
  });

  const [questionsForm, setQuestionsForm] = useState([{
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    marks: 1,
    difficulty: 'EASY',
    topic: ''
  }]);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      setLoading(true);
      const examsData = await getFacultyExams();
      setExams(Array.isArray(examsData) ? examsData : []);
    } catch (error) {
      console.error('Error loading exams:', error);
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExam = async () => {
    try {
      setLoading(true);
      
      // Format dates properly for backend (full ISO format with timezone)
      const formatDateForBackend = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toISOString(); // Full ISO format: "2024-01-15T10:30:00.000Z"
      };
      
      const examData = {
        ...examForm,
        startTime: formatDateForBackend(examForm.startTime),
        endTime: formatDateForBackend(examForm.endTime),
        createdBy: user?.email || user?.username,
        // Questions are added in a separate API call after exam creation
      };
      
      console.log('Sending exam data:', examData); // Debug log
      
      const createdExam = await createExam(examData);
      console.log('Exam created successfully:', createdExam); // Debug log

      // Add questions to the created exam
      if (createdExam?.id && Array.isArray(questionsForm) && questionsForm.length > 0) {
        try {
          await addQuestions(createdExam.id, questionsForm);
          console.log('Questions added successfully for exam:', createdExam.id);
        } catch (addErr) {
          console.error('Error adding questions after exam creation:', addErr);
          // Surface a friendly message so the teacher knows why students cannot start the exam
          alert('Exam was created, but adding questions failed. Please try adding questions again.');
        }
      }
      
      setShowCreateDialog(false);
      setShowQuestionsDialog(false);
      resetForms();
      loadExams();
    } catch (error) {
      console.error('Error creating exam:', error);
      console.error('Error details:', error.response?.data || error.message);
      // You might want to show an error message to the user here
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestions = async () => {
    try {
      setLoading(true);
      await addQuestions(selectedExam.id, questionsForm);
      setShowQuestionsDialog(false);
      resetForms();
      loadExams();
    } catch (error) {
      console.error('Error adding questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivateExam = async (examId) => {
    try {
      await activateExam(examId);
      loadExams();
    } catch (error) {
      console.error('Error activating exam:', error);
    }
  };

  const handleDeactivateExam = async (examId) => {
    try {
      await deactivateExam(examId);
      loadExams();
    } catch (error) {
      console.error('Error deactivating exam:', error);
    }
  };

  const handleDeleteExam = async (examId) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await deleteExam(examId);
        loadExams();
      } catch (error) {
        console.error('Error deleting exam:', error);
      }
    }
  };

  const handleViewResults = async (examId) => {
    try {
      const results = await getExamResults(examId);
      setExamResults(Array.isArray(results) ? results : []);
      setCurrentTab(1);
    } catch (error) {
      console.error('Error loading exam results:', error);
    }
  };

  const resetForms = () => {
    setExamForm({
      title: '',
      description: '',
      durationMinutes: 60,
      startTime: '',
      endTime: '',
      totalMarks: 100,
      negativeMarking: false,
      negativeMarkingPercentage: 0,
      courseId: 1,
      courseName: '',
      isActive: true
    });
    setQuestionsForm([{
      questionText: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A',
      marks: 1,
      difficulty: 'EASY',
      topic: ''
    }]);
  };

  const addQuestion = () => {
    setQuestionsForm([...questionsForm, {
      questionText: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A',
      marks: 1,
      difficulty: 'EASY',
      topic: ''
    }]);
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questionsForm];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestionsForm(updatedQuestions);
  };

  const removeQuestion = (index) => {
    if (questionsForm.length > 1) {
      setQuestionsForm(questionsForm.filter((_, i) => i !== index));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'INACTIVE': return 'error';
      case 'UPCOMING': return 'warning';
      default: return 'default';
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Exam Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowCreateDialog(true)}
        >
          Create New Exam
        </Button>
      </Box>

      <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Exams" icon={<QuizIcon />} />
        <Tab label="Results" icon={<AssessmentIcon />} />
      </Tabs>

      {currentTab === 0 && (
        <Grid container spacing={3}>
          {exams.map((exam) => (
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
                      <strong>Duration:</strong> {exam.durationMinutes} minutes
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
                    <IconButton
                      size="small"
                      onClick={() => handleViewResults(exam.id)}
                      title="View Results"
                    >
                      <ViewIcon />
                    </IconButton>
                    
                    {exam.status === 'INACTIVE' && (
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleActivateExam(exam.id)}
                        title="Activate Exam"
                      >
                        <ActivateIcon />
                      </IconButton>
                    )}
                    
                    {exam.status === 'ACTIVE' && (
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => handleDeactivateExam(exam.id)}
                        title="Deactivate Exam"
                      >
                        <DeactivateIcon />
                      </IconButton>
                    )}
                    
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteExam(exam.id)}
                      title="Delete Exam"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {currentTab === 1 && (
        <Box>
          <Typography variant="h6" mb={2}>
            Exam Results
          </Typography>
          {examResults.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>End Time</TableCell>
                    <TableCell>Marks Obtained</TableCell>
                    <TableCell>Percentage</TableCell>
                    <TableCell>Grade</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {examResults.map((result) => (
                    <TableRow key={result.attemptId}>
                      <TableCell>{result.studentName}</TableCell>
                      <TableCell>{result.studentEmail}</TableCell>
                      <TableCell>{formatDateTime(result.startTime)}</TableCell>
                      <TableCell>{formatDateTime(result.endTime)}</TableCell>
                      <TableCell>{result.obtainedMarks}/{result.totalMarks}</TableCell>
                      <TableCell>{result.percentage}%</TableCell>
                      <TableCell>
                        <Chip
                          label={result.grade}
                          color={result.passed ? 'success' : 'error'}
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">No exam results available.</Alert>
          )}
        </Box>
      )}

      {/* Create Exam Dialog */}
      <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Exam</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Exam Title"
                value={examForm.title}
                onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Course Name"
                value={examForm.courseName}
                onChange={(e) => setExamForm({ ...examForm, courseName: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={examForm.description}
                onChange={(e) => setExamForm({ ...examForm, description: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                type="number"
                value={examForm.durationMinutes}
                onChange={(e) => setExamForm({ ...examForm, durationMinutes: parseInt(e.target.value) })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Total Marks"
                type="number"
                value={examForm.totalMarks}
                onChange={(e) => setExamForm({ ...examForm, totalMarks: parseInt(e.target.value) })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Start Time"
                type="datetime-local"
                value={examForm.startTime}
                onChange={(e) => setExamForm({ ...examForm, startTime: e.target.value })}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="End Time"
                type="datetime-local"
                value={examForm.endTime}
                onChange={(e) => setExamForm({ ...examForm, endTime: e.target.value })}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={examForm.negativeMarking}
                    onChange={(e) => setExamForm({ ...examForm, negativeMarking: e.target.checked })}
                  />
                }
                label="Negative Marking"
              />
            </Grid>
            {examForm.negativeMarking && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Negative Marking Percentage"
                  type="number"
                  value={examForm.negativeMarkingPercentage}
                  onChange={(e) => setExamForm({ ...examForm, negativeMarkingPercentage: parseFloat(e.target.value) })}
                  margin="normal"
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>Cancel</Button>
          <Button onClick={() => setShowQuestionsDialog(true)} variant="contained">
            Next: Add Questions
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Questions Dialog */}
      <Dialog open={showQuestionsDialog} onClose={() => setShowQuestionsDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Add Questions</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Button onClick={addQuestion} startIcon={<AddIcon />}>
              Add Question
            </Button>
          </Box>
          
          {questionsForm.map((question, index) => (
            <Accordion key={index} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Question {index + 1}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Question Text"
                      multiline
                      rows={3}
                      value={question.questionText}
                      onChange={(e) => updateQuestion(index, 'questionText', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Option A"
                      value={question.optionA}
                      onChange={(e) => updateQuestion(index, 'optionA', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Option B"
                      value={question.optionB}
                      onChange={(e) => updateQuestion(index, 'optionB', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Option C"
                      value={question.optionC}
                      onChange={(e) => updateQuestion(index, 'optionC', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Option D"
                      value={question.optionD}
                      onChange={(e) => updateQuestion(index, 'optionD', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Correct Answer</InputLabel>
                      <Select
                        value={question.correctAnswer}
                        onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                        label="Correct Answer"
                      >
                        <MenuItem value="A">A</MenuItem>
                        <MenuItem value="B">B</MenuItem>
                        <MenuItem value="C">C</MenuItem>
                        <MenuItem value="D">D</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Marks"
                      type="number"
                      value={question.marks}
                      onChange={(e) => updateQuestion(index, 'marks', parseInt(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Difficulty</InputLabel>
                      <Select
                        value={question.difficulty}
                        onChange={(e) => updateQuestion(index, 'difficulty', e.target.value)}
                        label="Difficulty"
                      >
                        <MenuItem value="EASY">Easy</MenuItem>
                        <MenuItem value="MEDIUM">Medium</MenuItem>
                        <MenuItem value="HARD">Hard</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Topic"
                      value={question.topic}
                      onChange={(e) => updateQuestion(index, 'topic', e.target.value)}
                    />
                  </Grid>
                  {questionsForm.length > 1 && (
                    <Grid item xs={12}>
                      <Button
                        color="error"
                        onClick={() => removeQuestion(index)}
                        startIcon={<DeleteIcon />}
                      >
                        Remove Question
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowQuestionsDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateExam} variant="contained" disabled={loading}>
            {loading ? 'Creating...' : 'Create Exam'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FacultyExamManager; 