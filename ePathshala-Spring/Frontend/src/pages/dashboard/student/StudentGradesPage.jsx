import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import StudentGradesSection from '../student/StudentGradesSection';

function StudentGradesPage() {
  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          My Grades
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          View your academic performance and grades
        </Typography>
      </Paper>

      <Box>
        <StudentGradesSection />
      </Box>
    </Box>
  );
}

export default StudentGradesPage;
