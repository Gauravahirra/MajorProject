import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  Paper
} from '@mui/material';
import {
  TrendingUp,
  School,
  Assignment,
  Grade
} from '@mui/icons-material';

const StudentProgressPage = () => {
  const [progressData, setProgressData] = useState({
    overallProgress: 75,
    subjects: [
      { name: 'Mathematics', progress: 85, grade: 'A' },
      { name: 'Science', progress: 78, grade: 'B+' },
      { name: 'English', progress: 92, grade: 'A+' },
      { name: 'History', progress: 70, grade: 'B' },
      { name: 'Computer Science', progress: 88, grade: 'A' }
    ],
    recentAssignments: [
      { name: 'Algebra Quiz', status: 'Completed', score: 95 },
      { name: 'Science Project', status: 'In Progress', score: null },
      { name: 'English Essay', status: 'Completed', score: 88 },
      { name: 'History Test', status: 'Pending', score: null }
    ]
  });

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'success';
      case 'B+':
      case 'B':
        return 'primary';
      case 'C+':
      case 'C':
        return 'warning';
      default:
        return 'error';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'warning';
      case 'Pending':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Progress
      </Typography>

      {/* Overall Progress */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">Overall Progress</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ flexGrow: 1, mr: 2 }}>
              <LinearProgress
                variant="determinate"
                value={progressData.overallProgress}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            <Typography variant="h6" color="primary">
              {progressData.overallProgress}%
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Subject Progress */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Subject Progress
          </Typography>
        </Grid>
        {progressData.subjects.map((subject, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">{subject.name}</Typography>
                  <Chip
                    label={subject.grade}
                    color={getGradeColor(subject.grade)}
                    size="small"
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ flexGrow: 1, mr: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={subject.progress}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {subject.progress}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Assignments */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Assignments
        </Typography>
        <Grid container spacing={2}>
          {progressData.recentAssignments.map((assignment, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        {assignment.name}
                      </Typography>
                      <Chip
                        label={assignment.status}
                        color={getStatusColor(assignment.status)}
                        size="small"
                      />
                    </Box>
                    {assignment.score && (
                      <Typography variant="h6" color="primary">
                        {assignment.score}%
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default StudentProgressPage;
