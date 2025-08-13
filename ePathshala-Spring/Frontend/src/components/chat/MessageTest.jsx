import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, List, ListItem } from '@mui/material';

function MessageTest() {
  const [messages, setMessages] = useState([]);
  const [testCount, setTestCount] = useState(0);

  const addTestMessage = () => {
    const newMessage = {
      id: testCount + 1,
      message: `Test message ${testCount + 1}`,
      authorName: 'Test User',
      timestamp: new Date().toISOString(),
      messageType: 'TEXT'
    };
    
    setMessages(prev => [...prev, newMessage]);
    setTestCount(prev => prev + 1);
  };

  const clearMessages = () => {
    setMessages([]);
    setTestCount(0);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800 }}>
      <Typography variant="h4" gutterBottom>
        Message Display Test
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">
          Messages: {messages.length}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Button onClick={addTestMessage} sx={{ mr: 1 }}>
            Add Test Message
          </Button>
          <Button onClick={clearMessages} variant="outlined">
            Clear Messages
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Message List
        </Typography>
        <List>
          {messages.map((message, index) => (
            <ListItem key={index} sx={{ 
              border: 1, 
              borderColor: 'divider', 
              mb: 1, 
              borderRadius: 1,
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}>
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle2">
                  {message.authorName} - {new Date(message.timestamp).toLocaleTimeString()}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {message.message}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

export default MessageTest; 