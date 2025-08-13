import React from 'react';
import { Box, List, ListItem, Paper, Typography, Avatar } from '@mui/material';
import { SmartToy as BotIcon, Person as PersonIcon } from '@mui/icons-material';

function ChatMessageList({ messages, isLoading, messagesEndRef }) {
  const formatTime = (timestamp) => new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <List sx={{ width: '100%' }}>
      {messages.map((msg, index) => (
        <ListItem key={index} sx={{ flexDirection: 'column', alignItems: msg.isUserMessage ? 'flex-end' : 'flex-start', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, maxWidth: '80%' }}>
            {!msg.isUserMessage && (
              <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}><BotIcon /></Avatar>
            )}
            <Paper elevation={1} sx={{ p: 1.5, backgroundColor: msg.isUserMessage ? 'primary.main' : 'grey.100', color: msg.isUserMessage ? 'white' : 'text.primary', borderRadius: 2, maxWidth: '100%', wordBreak: 'break-word' }}>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{msg.message}</Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.7 }}>{formatTime(msg.timestamp)}</Typography>
            </Paper>
            {msg.isUserMessage && (
              <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}><PersonIcon /></Avatar>
            )}
          </Box>
        </ListItem>
      ))}
      {isLoading && (
        <ListItem sx={{ justifyContent: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}><BotIcon /></Avatar>
            <Paper elevation={1} sx={{ p: 1.5, backgroundColor: 'grey.100', borderRadius: 2 }}>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>Typing...</Typography>
            </Paper>
          </Box>
        </ListItem>
      )}
      <div ref={messagesEndRef} />
    </List>
  );
}

export default React.memo(ChatMessageList);