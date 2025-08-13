import React from 'react';
import { Box, Typography, IconButton, Chip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';

function ChatHeader({ isMobile, onSidebarOpen, selectedRoom, connectionStatus, getConnectionStatusIcon, connectWebSocket }) {
  const theme = useTheme();
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      mb: 2,
      p: { xs: 1.5, sm: 2 },
      borderBottom: 1,
      borderColor: 'divider',
      bgcolor: theme.palette.grey[100],
      boxShadow: 0,
      position: 'sticky',
      top: 0,
      zIndex: 2,
    }}>
      {isMobile && (
        <IconButton onClick={onSidebarOpen} sx={{ mr: 1 }}>
          <MenuIcon />
        </IconButton>
      )}
      <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ flexGrow: 1, fontWeight: 700, color: theme.palette.text.primary }}>
        {selectedRoom ? selectedRoom.name : 'Chat'}
      </Typography>
      <Chip
        icon={getConnectionStatusIcon()}
        label={connectionStatus}
        color={connectionStatus === 'connected' ? 'success' : 'default'}
        variant="outlined"
        onClick={connectionStatus === 'disconnected' ? connectWebSocket : undefined}
        sx={{ ml: 1, fontSize: { xs: '0.7rem', sm: '0.9rem' }, height: 32, bgcolor: theme.palette.grey[200] }}
      />
    </Box>
  );
}

export default ChatHeader;
