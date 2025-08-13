import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Help as HelpIcon,
  ExpandMore as ExpandMoreIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';

const ExamResultVisualization = ({ result }) => {
  if (!result) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No result data available
        </Typography>
      </Box>
    );
  }

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'IN_PROGRESS': return 'warning';
      case 'TIMED_OUT': return 'error';
      default: return 'default';
    }
  };

  const calculateAccuracy = () => {
    if (result.totalQuestions === 0) return 0;
    return ((result.correctAnswers / result.totalQuestions) * 100).toFixed(1);
  };

  const calculateTimeEfficiency = () => {
    if (result.durationMinutes === 0) return 0;
    const timeUsed = (new Date(result.endTime) - new Date(result.startTime)) / (1000 * 60);
    return ((timeUsed / result.durationMinutes) * 100).toFixed(1);
  };

  const getQuestionStatusIcon = (question) => {
    if (question.isCorrect) {
      return <CheckIcon color="success" fontSize="small" />;
    } else if (question.selectedAnswer) {
      return <CancelIcon color="error" fontSize="small" />;
    } else {
      return <HelpIcon color="warning" fontSize="small" />;
    }
  };

  const getQuestionStatusText = (question) => {
    if (question.isCorrect) return 'Correct';
    if (question.selectedAnswer) return 'Incorrect';
    return 'Unanswered';
  };

  const getQuestionStatusColor = (question) => {
    if (question.isCorrect) return 'success';
    if (question.selectedAnswer) return 'error';
    return 'warning';
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Header Summary */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Typography variant="h5" gutterBottom>
                {result.examTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Student: {result.studentName} ({result.studentEmail})
              </Typography>
            </Box>
            <Box display="flex" gap={1}>
              <Chip
                label={result.grade}
                color={getGradeColor(result.grade)}
                size="large"
              />
              <Chip
                label={result.status}
                color={getStatusColor(result.status)}
                size="small"
              />
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" color="primary">
                {result.obtainedMarks}/{result.totalMarks}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Marks Obtained
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" color="primary">
                {result.percentage}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Percentage
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" color="primary">
                {result.correctAnswers}/{result.totalQuestions}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Correct Answers
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" color="primary">
                {result.answeredQuestions}/{result.totalQuestions}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Questions Attempted
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Accuracy
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <LinearProgress
                  variant="determinate"
                  value={parseFloat(calculateAccuracy())}
                  sx={{ flexGrow: 1, height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" fontWeight="bold">
                  {calculateAccuracy()}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Time Efficiency
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <LinearProgress
                  variant="determinate"
                  value={parseFloat(calculateTimeEfficiency())}
                  sx={{ flexGrow: 1, height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" fontWeight="bold">
                  {calculateTimeEfficiency()}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Completion Rate
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <LinearProgress
                  variant="determinate"
                  value={(result.answeredQuestions / result.totalQuestions) * 100}
                  sx={{ flexGrow: 1, height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" fontWeight="bold">
                  {((result.answeredQuestions / result.totalQuestions) * 100).toFixed(1)}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Exam Details */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Exam Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2">
                <strong>Start Time:</strong> {formatDateTime(result.startTime)}
              </Typography>
              <Typography variant="body2">
                <strong>End Time:</strong> {formatDateTime(result.endTime)}
              </Typography>
              <Typography variant="body2">
                <strong>Duration:</strong> {formatDuration(result.durationMinutes)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2">
                <strong>Total Questions:</strong> {result.totalQuestions}
              </Typography>
              <Typography variant="body2">
                <strong>Answered:</strong> {result.answeredQuestions}
              </Typography>
              <Typography variant="body2">
                <strong>Unanswered:</strong> {result.unansweredQuestions || 0}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Question Analysis */}
      {result.questionResults && result.questionResults.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Question Analysis
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Q#</TableCell>
                    <TableCell>Question</TableCell>
                    <TableCell>Your Answer</TableCell>
                    <TableCell>Correct Answer</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Marks</TableCell>
                    <TableCell>Time Spent</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {result.questionResults.map((question, index) => (
                    <TableRow key={question.id || index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        <Typography variant="body2" noWrap>
                          {question.questionText}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {question.selectedAnswer || 'Not answered'}
                      </TableCell>
                      <TableCell>{question.correctAnswer}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          {getQuestionStatusIcon(question)}
                          <Chip
                            label={getQuestionStatusText(question)}
                            color={getQuestionStatusColor(question)}
                            size="small"
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        {question.marksObtained}/{question.marks}
                      </TableCell>
                      <TableCell>
                        {question.timeSpentSeconds ? `${question.timeSpentSeconds}s` : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Performance Analytics */}
      {(result.topicPerformance || result.difficultyPerformance) && (
        <Grid container spacing={3}>
          {result.topicPerformance && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Topic Performance
                  </Typography>
                  {Object.entries(result.topicPerformance).map(([topic, score]) => (
                    <Box key={topic} sx={{ mb: 2 }}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">{topic}</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {score}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={score}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          )}

          {result.difficultyPerformance && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Difficulty Performance
                  </Typography>
                  {Object.entries(result.difficultyPerformance).map(([difficulty, score]) => (
                    <Box key={difficulty} sx={{ mb: 2 }}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">{difficulty}</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {score}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={score}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      {/* Answer Distribution */}
      {result.answerDistribution && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Answer Distribution
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(result.answerDistribution).map(([option, count]) => (
                <Grid item xs={6} md={3} key={option}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {count}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Option {option}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ExamResultVisualization; 