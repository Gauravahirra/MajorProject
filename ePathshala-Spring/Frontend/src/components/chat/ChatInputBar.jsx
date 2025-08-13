import React from 'react';
import { Box, TextField, Button, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function ChatInputBar({ newMessage, setNewMessage, isConnected, handleSendMessage, loading }) {
  const theme = useTheme();
  return (
    <Paper elevation={1} sx={{ p: 1, borderRadius: 3, boxShadow: 1, bgcolor: theme.palette.grey[50] }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          placeholder={isConnected ? 'Type your message...' : 'Connecting...'}
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          disabled={!isConnected || loading}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          size="small"
          sx={{ borderRadius: 2, bgcolor: theme.palette.background.paper }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          disabled={!isConnected || loading || !newMessage.trim()}
          sx={{ minWidth: 90, borderRadius: 2, boxShadow: 0 }}
        >
          Send
        </Button>
      </Box>
    </Paper>
  );
}

export default ChatInputBar;
