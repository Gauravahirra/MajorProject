import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import TeacherLeaveRequestsSection from './TeacherLeaveRequestsSection';

function TeacherLeaveRequestsPage() {
  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Leave Requests
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Review and approve student leave requests
        </Typography>
      </Paper>

      <Box>
        <TeacherLeaveRequestsSection />
      </Box>
    </Box>
  );
}

export default TeacherLeaveRequestsPage;
