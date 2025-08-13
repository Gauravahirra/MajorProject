import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import StudentLeaveSection from '../student/StudentLeaveSection';

function StudentLeaveRequestsPage() {
  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Leave Requests
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Submit and track your leave requests
        </Typography>
      </Paper>

      <Box>
        <StudentLeaveSection />
      </Box>
    </Box>
  );
}

export default StudentLeaveRequestsPage;
