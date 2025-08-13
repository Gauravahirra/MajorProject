import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import StudentCalendarSection from '../student/StudentCalendarSection';

function StudentCalendarPage() {
  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Academic Calendar
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          View academic events, holidays, and important dates
        </Typography>
      </Paper>

      <Box>
        <StudentCalendarSection />
      </Box>
    </Box>
  );
}

export default StudentCalendarPage;
