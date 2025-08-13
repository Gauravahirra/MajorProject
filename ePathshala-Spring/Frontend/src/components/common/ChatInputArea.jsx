import React from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

function ChatInputArea({ inputMessage, setInputMessage, handleKeyPress, sendMessage, isLoading }) {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Type your message..."
        value={inputMessage}
        onChange={e => setInputMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
        size="small"
        inputProps={{ 'aria-label': 'Chat message input' }}
      />
      <IconButton
        color="primary"
        onClick={sendMessage}
        disabled={!inputMessage.trim() || isLoading}
        aria-label="Send message"
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
}

export default React.memo(ChatInputArea);