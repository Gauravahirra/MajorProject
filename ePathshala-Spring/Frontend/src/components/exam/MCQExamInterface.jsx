import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  NavigateBefore,
  NavigateNext,
  Timer,
  Warning,
  CheckCircle
} from '@mui/icons-material';

const MCQExamInterface = ({ exam, questions, onSubmit, onTimeUp }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(exam.durationMinutes * 60);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        
        if (prev <= 300) { // 5 minutes warning
          setShowTimeWarning(true);
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeUp]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    setShowSubmitDialog(true);
  };

  const confirmSubmit = () => {
    setShowSubmitDialog(false);
    onSubmit(answers);
  };

  const getProgress = () => {
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              {exam.title}
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Chip
                icon={<Timer />}
                label={formatTime(timeRemaining)}
                color={timeRemaining <= 300 ? 'error' : 'primary'}
                size="large"
              />
              <Chip
                label={`${getAnsweredCount()}/${questions.length} Answered`}
                color="info"
                size="large"
              />
            </Box>
          </Box>
          
          <LinearProgress 
            variant="determinate" 
            value={getProgress()} 
            sx={{ height: 10, borderRadius: 5 }}
          />
          
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 500 }}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Typography>
        </CardContent>
      </Card>

      {/* Time Warning */}
      {showTimeWarning && (
        <Alert severity="warning" sx={{ mb: 2 }} icon={<Warning />}>
          Less than 5 minutes remaining! Please submit your exam soon.
        </Alert>
      )}

      {/* Question Card */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
            Question {currentQuestionIndex + 1}
          </Typography>
          
          <Typography variant="h6" paragraph sx={{ 
            fontSize: '1.2rem', 
            lineHeight: 1.6, 
            mb: 3,
            color: 'text.primary',
            fontWeight: 500
          }}>
            {currentQuestion.questionText}
          </Typography>

          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <RadioGroup
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            >
              <FormControlLabel
                value="A"
                control={<Radio size="large" />}
                label={
                  <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
                    A) {currentQuestion.optionA}
                  </Typography>
                }
                sx={{ 
                  mb: 2, 
                  p: 2, 
                  border: '1px solid #e0e0e0', 
                  borderRadius: 2,
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              />
              <FormControlLabel
                value="B"
                control={<Radio size="large" />}
                label={
                  <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
                    B) {currentQuestion.optionB}
                  </Typography>
                }
                sx={{ 
                  mb: 2, 
                  p: 2, 
                  border: '1px solid #e0e0e0', 
                  borderRadius: 2,
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              />
              <FormControlLabel
                value="C"
                control={<Radio size="large" />}
                label={
                  <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
                    C) {currentQuestion.optionC}
                  </Typography>
                }
                sx={{ 
                  mb: 2, 
                  p: 2, 
                  border: '1px solid #e0e0e0', 
                  borderRadius: 2,
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              />
              <FormControlLabel
                value="D"
                control={<Radio size="large" />}
                label={
                  <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
                    D) {currentQuestion.optionD}
                  </Typography>
                }
                sx={{ 
                  mb: 2, 
                  p: 2, 
                  border: '1px solid #e0e0e0', 
                  borderRadius: 2,
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              />
            </RadioGroup>
          </FormControl>

          {answers[currentQuestion.id] && (
            <Box display="flex" alignItems="center" gap={1} sx={{ mt: 3 }}>
              <CheckCircle color="success" fontSize="medium" />
              <Typography variant="body1" color="success.main" sx={{ fontWeight: 500 }}>
                Answered
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 3 }}>
        <Button
          variant="outlined"
          startIcon={<NavigateBefore />}
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          size="large"
          sx={{ 
            px: 4, 
            py: 1.5, 
            fontSize: '1.1rem',
            fontWeight: 500
          }}
        >
          Previous
        </Button>

        <Box display="flex" gap={2}>
          {currentQuestionIndex < questions.length - 1 ? (
            <Button
              variant="contained"
              endIcon={<NavigateNext />}
              onClick={handleNext}
              size="large"
              sx={{ 
                px: 4, 
                py: 1.5, 
                fontSize: '1.1rem',
                fontWeight: 500
              }}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              size="large"
              sx={{ 
                px: 4, 
                py: 1.5, 
                fontSize: '1.1rem',
                fontWeight: 500
              }}
            >
              Submit Exam
            </Button>
          )}
        </Box>
      </Box>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onClose={() => setShowSubmitDialog(false)}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to submit your exam? This action cannot be undone.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Answered: {getAnsweredCount()}/{questions.length} questions
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSubmitDialog(false)}>
            Cancel
          </Button>
          <Button onClick={confirmSubmit} variant="contained" color="success">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MCQExamInterface; 