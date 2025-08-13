import React from 'react';
import { Alert, Box, Button, Typography } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

function ErrorMessage({ 
  error, 
  onRetry, 
  title = "Something went wrong", 
  showRetry = true 
}) {
  return (
    <Box sx={{ p: 2 }}>
      <Alert severity="error">
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {error?.message || 'An unexpected error occurred'}
        </Typography>
        {showRetry && onRetry && (
          <Button
            startIcon={<RefreshIcon />}
            onClick={onRetry}
            variant="outlined"
            size="small"
            color="inherit"
          >
            Try Again
          </Button>
        )}
      </Alert>
    </Box>
  );
}

export default React.memo(ErrorMessage); 