import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, TextField, Typography, Paper, List, ListItem, Avatar, Chip } from '@mui/material';
import { Person as PersonIcon, Send as SendIcon } from '@mui/icons-material';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

function ChatDebug() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const [roomId, setRoomId] = useState(1);
  const stompClient = useRef(null);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, []);

  const connectWebSocket = () => {
    console.log('Connecting to WebSocket...');
    
    const socket = new SockJS('/ws');
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      connectHeaders: {
        'userEmail': 'admin@epathshala.com',
        'userId': '1',
        'userName': 'Admin User'
      }
    });

    stompClient.current.onConnect = (frame) => {
      console.log('Connected to WebSocket:', frame);
      setConnected(true);
      
      // Subscribe to room-specific messages
      stompClient.current.subscribe(`/topic/chat.${roomId}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        console.log('Received message:', receivedMessage);
        setMessages(prev => {
          const newMessages = [...prev, receivedMessage];
          console.log('Updated messages:', newMessages.length);
          return newMessages;
        });
      });
      
      // Send join room message
      stompClient.current.publish({
        destination: '/app/chat.joinRoom',
        body: JSON.stringify({ roomId: roomId })
      });
    };

    stompClient.current.activate();
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !stompClient.current?.connected) return;

    const messageToSend = {
      message: newMessage.trim(),
      chatRoomId: roomId,
      messageType: 'TEXT'
    };

    console.log('Sending message:', messageToSend);

    stompClient.current.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(messageToSend)
    });

    setNewMessage('');
  };

  const addTestMessage = () => {
    const testMessage = {
      id: Date.now(),
      message: `Test message ${Date.now()}`,
      authorName: 'Test User',
      timestamp: new Date().toISOString(),
      messageType: 'TEXT'
    };
    
    setMessages(prev => [...prev, testMessage]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800 }}>
      <Typography variant="h4" gutterBottom>
        Chat Debug Tool
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">
          Connection Status: {connected ? 'Connected' : 'Disconnected'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Room ID: {roomId} | Messages: {messages.length}
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

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Send Message
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button onClick={sendMessage} disabled={!connected}>
            <SendIcon />
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Messages ({messages.length})
        </Typography>
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          <List>
            {messages.length === 0 ? (
              <ListItem>
                <Typography variant="body2" color="text.secondary">
                  No messages yet. Start the conversation!
                </Typography>
              </ListItem>
            ) : (
              messages.map((message, index) => (
                <ListItem key={message.id || `msg-${index}-${message.timestamp}`} sx={{ 
                  flexDirection: 'column', 
                  alignItems: 'flex-start',
                  border: 1, 
                  borderColor: 'divider', 
                  mb: 1, 
                  borderRadius: 1
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, width: '100%' }}>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      <PersonIcon />
                    </Avatar>
                    <Typography variant="subtitle2">{message.authorName}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatTime(message.timestamp)}
                    </Typography>
                    {message.messageType !== 'TEXT' && (
                      <Chip
                        size="small"
                        label={message.messageType}
                        color="primary"
                        variant="outlined"
                      />
                    )}
                  </Box>
                  <Paper
                    sx={{
                      p: 1.5,
                      backgroundColor: message.messageType === 'SYSTEM' ? 'warning.light' : 'grey.100',
                      borderRadius: 2,
                      maxWidth: '80%',
                      wordBreak: 'break-word'
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {message.message}
                    </Typography>
                  </Paper>
                </ListItem>
              ))
            )}
          </List>
        </Box>
      </Paper>
    </Box>
  );
}

export default ChatDebug; 