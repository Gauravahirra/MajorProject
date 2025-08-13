import React from 'react';
import { Box, Typography, Button } from '@mui/material';

function SimpleTest() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Simple Test Component
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        This is a simple test component to verify the app renders correctly.
      </Typography>
      <Button variant="contained" color="primary">
        Test Button
      </Button>
    </Box>
  );
}

export default SimpleTest; 