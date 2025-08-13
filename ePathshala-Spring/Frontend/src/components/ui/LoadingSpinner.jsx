import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

function LoadingSpinner({ message = "Loading...", size = "medium" }) {
  const spinnerSize = size === "small" ? 20 : size === "large" ? 60 : 40;
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        p: 2,
        gap: 2
      }}
    >
      <CircularProgress size={spinnerSize} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
}

export default React.memo(LoadingSpinner); 