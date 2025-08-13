import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Grid
} from '@mui/material';
import {
  AccessTime,
  School,
  Assignment,
  PlayArrow,
  Visibility
} from '@mui/icons-material';

const ExamCard = ({ exam, onStartExam, onViewResult, onViewDetails }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'UPCOMING':
        return 'warning';
      case 'ACTIVE':
        return 'success';
      case 'COMPLETED':
        return 'info';
      default:
        return 'default';
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

  return (
    <Card sx={{ minWidth: 275, mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography variant="h6" component="h2" gutterBottom>
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

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <AccessTime fontSize="small" color="action" />
              <Typography variant="body2">
                Duration: {formatDuration(exam.durationMinutes)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <Assignment fontSize="small" color="action" />
              <Typography variant="body2">
                Questions: {exam.questionCount}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <School fontSize="small" color="action" />
              <Typography variant="body2">
                Course: {exam.courseName}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              Total Marks: {exam.totalMarks}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Start Time:</strong> {formatDateTime(exam.startTime)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>End Time:</strong> {formatDateTime(exam.endTime)}
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
      </CardContent>

      <CardActions>
        {exam.status === 'ACTIVE' && (
          <Button
            size="small"
            startIcon={<PlayArrow />}
            variant="contained"
            color="primary"
            onClick={() => onStartExam(exam.id)}
          >
            Start Exam
          </Button>
        )}
        
        {exam.status === 'UPCOMING' && (
          <Button
            size="small"
            startIcon={<Visibility />}
            variant="outlined"
            onClick={() => onViewDetails(exam.id)}
          >
            View Details
          </Button>
        )}
        
        {exam.status === 'COMPLETED' && exam.result && (
          <Button
            size="small"
            startIcon={<Visibility />}
            variant="outlined"
            onClick={() => onViewResult(exam.id)}
          >
            View Result
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default ExamCard; 