import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import StudentAssignmentsSection from '../student/StudentAssignmentsSection';

function StudentAssignmentsPage() {
  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          My Assignments
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          View and submit your assignments
        </Typography>
      </Paper>

      <Box>
        <StudentAssignmentsSection />
      </Box>
    </Box>
  );
}

export default StudentAssignmentsPage;
