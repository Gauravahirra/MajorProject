import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

function EmptyState({ 
  title = "No data found", 
  message = "There's nothing to display here yet.", 
  actionText, 
  onAction,
  icon: Icon = AddIcon 
}) {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        p: 4,
        textAlign: 'center',
        minHeight: 200
      }}
    >
      <Icon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {message}
      </Typography>
      {actionText && onAction && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAction}
        >
          {actionText}
        </Button>
      )}
    </Box>
  );
}

export default React.memo(EmptyState); 