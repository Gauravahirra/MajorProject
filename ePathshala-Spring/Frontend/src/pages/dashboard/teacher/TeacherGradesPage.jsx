import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import TeacherGradesSection from './TeacherGradesSection';

function TeacherGradesPage() {
  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Grade Management
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Enter and manage student grades and performance
        </Typography>
      </Paper>

      <Box>
        <TeacherGradesSection />
      </Box>
    </Box>
  );
}

export default TeacherGradesPage;
