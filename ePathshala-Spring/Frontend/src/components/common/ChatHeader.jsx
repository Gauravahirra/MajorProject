import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { SmartToy as BotIcon, Close as CloseIcon } from '@mui/icons-material';

function ChatHeader({ onClose }) {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <BotIcon sx={{ mr: 1 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ePathshala Assistant
        </Typography>
        <IconButton edge="end" color="inherit" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default React.memo(ChatHeader);