import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const HoverTest = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Hover Test Component
      </Typography>
      <Paper 
        sx={{ 
          p: 3, 
          m: 2,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: 8,
            backgroundColor: 'primary.light',
            color: 'primary.contrastText'
          }
        }}
      >
        <Typography variant="h6" gutterBottom>
          Hover Effect Test
        </Typography>
        <Typography>
          This component is used for testing hover effects and animations.
          Hover over this card to see the effect.
        </Typography>
      </Paper>
    </Box>
  );
};

export default HoverTest;
