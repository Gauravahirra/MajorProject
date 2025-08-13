import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import TeacherOnlineClassesSection from './TeacherOnlineClassesSection';

function TeacherOnlineClassesPage() {
  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Online Classes
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Manage online class sessions and virtual meetings
        </Typography>
      </Paper>

      <Box>
        <TeacherOnlineClassesSection />
      </Box>
    </Box>
  );
}

export default TeacherOnlineClassesPage;
