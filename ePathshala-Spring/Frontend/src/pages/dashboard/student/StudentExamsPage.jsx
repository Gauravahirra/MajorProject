import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import StudentExamsSection from '../student/StudentExamsSection';

function StudentExamsPage() {
  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          My Exams
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Take exams and view your results
        </Typography>
      </Paper>

      <Box>
        <StudentExamsSection />
      </Box>
    </Box>
  );
}

export default StudentExamsPage;
