import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import TeacherAssignmentsSection from './TeacherAssignmentsSection';

function TeacherAssignmentsPage() {
  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Assignment Management
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Create and manage assignments for your students
        </Typography>
      </Paper>

      <Box>
        <TeacherAssignmentsSection />
      </Box>
    </Box>
  );
}

export default TeacherAssignmentsPage;
