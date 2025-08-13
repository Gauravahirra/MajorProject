import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import StudentAttendanceSection from '../student/StudentAttendanceSection';

function StudentAttendancePage() {
  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          My Attendance
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Check your attendance records and statistics
        </Typography>
      </Paper>

      <Box>
        <StudentAttendanceSection />
      </Box>
    </Box>
  );
}

export default StudentAttendancePage;
