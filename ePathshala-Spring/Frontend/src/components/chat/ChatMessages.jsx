import React from 'react';
import { List, ListItem, Avatar, Typography, Paper, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function ChatMessages({ messages, messagesEndRef, getMessageTypeColor, getCategoryIcon, formatTime }) {
  const theme = useTheme();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  return (
    <List sx={{ p: 0 }}>
      {messages.length === 0 ? (
        <ListItem>
          <Typography variant="body2" color="text.secondary">
            No messages yet. Start the conversation!
          </Typography>
        </ListItem>
      ) : (
        messages.map((message, index) => {
          const isUser = message.authorId === currentUser.id;
          return (
            <ListItem
              key={message.id || `msg-${index}-${message.timestamp}`}
              sx={{
                flexDirection: isUser ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                mb: 1.5,
                px: 0,
              }}
            >
              <Avatar sx={{ width: 32, height: 32, ml: isUser ? 2 : 0, mr: isUser ? 0 : 2 }}>
                {getCategoryIcon(message.category)}
              </Avatar>
              <Box sx={{ maxWidth: '70%', width: 'auto' }}>
                <Paper
                  sx={{
                    p: 1.5,
                    backgroundColor: isUser ? theme.palette.primary.main : theme.palette.grey[100],
                    color: isUser ? theme.palette.common.white : theme.palette.text.primary,
                    borderRadius: 3,
                    boxShadow: 1,
                    mb: 0.5,
                    wordBreak: 'break-word',
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {message.message}
                  </Typography>
                </Paper>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {message.authorName || 'User'}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    {formatTime(message.timestamp)}
                  </Typography>
                </Box>
              </Box>
            </ListItem>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </List>
  );
}

export default ChatMessages;
