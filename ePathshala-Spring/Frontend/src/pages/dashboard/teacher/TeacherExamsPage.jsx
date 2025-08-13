import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import TeacherExamsSection from './TeacherExamsSection';

function TeacherExamsPage() {
  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Exam Management
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Create and manage exams for your students
        </Typography>
      </Paper>

      <Box>
        <TeacherExamsSection />
      </Box>
    </Box>
  );
}

export default TeacherExamsPage;
