import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import TeacherAttendanceSection from './TeacherAttendanceSection';

function TeacherAttendancePage() {
  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Attendance Management
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Mark and view student attendance records
        </Typography>
      </Paper>

      <Box>
        <TeacherAttendanceSection />
      </Box>
    </Box>
  );
}

export default TeacherAttendancePage;
