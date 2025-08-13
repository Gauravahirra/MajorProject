import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getExamResult } from '../../../api/exams';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Grid, 
  Chip, 
  List, 
  ListItem, 
  ListItemText,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  CheckCircle as CheckIcon, 
  Cancel as CancelIcon, 
  Help as HelpIcon,
  Timer as TimerIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

export default function StudentExamResultPage() {
  const { examId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getExamResult(examId);
        setResult(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch result');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [examId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!result) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        No result found for this exam.
      </Alert>
    );
  }

  const getGradeColor = (grade) => {
    if (grade === 'A+' || grade === 'A') return 'success';
    if (grade === 'B+' || grade === 'B') return 'primary';
    if (grade === 'C+' || grade === 'C') return 'warning';
    return 'error';
  };

  const getStatusColor = (passed) => {
    return passed ? 'success' : 'error';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Exam Result
      </Typography>
      
      {/* Main Result Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {result.examTitle || result.title}
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssessmentIcon sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Score: {result.obtainedMarks} / {result.totalMarks}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Percentage: {result.percentage?.toFixed(2)}%
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Chip 
                  label={result.grade || 'N/A'} 
                  color={getGradeColor(result.grade)}
                  variant="outlined"
                  sx={{ mr: 1 }}
                />
                <Chip 
                  label={result.passed ? 'PASSED' : 'FAILED'} 
                  color={getStatusColor(result.passed)}
                  variant="filled"
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Student:</strong> {result.studentName}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Start Time:</strong> {result.startTime}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>End Time:</strong> {result.endTime}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Duration:</strong> {result.durationMinutes} minutes
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">{result.correctAnswers || 0}</Typography>
              <Typography variant="body2" color="text.secondary">Correct Answers</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CancelIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">{result.incorrectAnswers || 0}</Typography>
              <Typography variant="body2" color="text.secondary">Incorrect Answers</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <HelpIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">{result.unansweredQuestions || 0}</Typography>
              <Typography variant="body2" color="text.secondary">Unanswered</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TimerIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">{result.answeredQuestions || 0}</Typography>
              <Typography variant="body2" color="text.secondary">Total Answered</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Question Breakdown */}
      {result.questionResults && result.questionResults.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Question Breakdown
            </Typography>
            <List>
              {result.questionResults.map((question, index) => (
                <React.Fragment key={question.id || index}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1">
                            Q{index + 1}: {question.questionText}
                          </Typography>
                          {question.isCorrect ? (
                            <CheckIcon color="success" fontSize="small" />
                          ) : (
                            <CancelIcon color="error" fontSize="small" />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Your Answer:</strong> {question.selectedAnswer || 'Not answered'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Correct Answer:</strong> {question.correctAnswer}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Marks:</strong> {question.marksObtained || 0} / {question.marks}
                          </Typography>
                          {question.timeSpentSeconds && (
                            <Typography variant="body2" color="text.secondary">
                              <strong>Time Spent:</strong> {question.timeSpentSeconds} seconds
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < result.questionResults.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Performance Analytics */}
      {(result.topicPerformance || result.difficultyPerformance) && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Performance Analytics
            </Typography>
            
            {result.topicPerformance && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Topic Performance
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {Object.entries(result.topicPerformance).map(([topic, score]) => (
                    <Chip 
                      key={topic}
                      label={`${topic}: ${score}%`}
                      color={score >= 70 ? 'success' : score >= 50 ? 'warning' : 'error'}
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}
            
            {result.difficultyPerformance && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Difficulty Performance
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {Object.entries(result.difficultyPerformance).map(([difficulty, score]) => (
                    <Chip 
                      key={difficulty}
                      label={`${difficulty}: ${score}%`}
                      color={score >= 70 ? 'success' : score >= 50 ? 'warning' : 'error'}
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
