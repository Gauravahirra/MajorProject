import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, TextField, Typography, Paper, List, ListItem, Alert } from '@mui/material';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

function WebSocketDebug() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');
  const stompClient = useRef(null);

  useEffect(() => {
    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, []);

  const connectWebSocket = () => {
    console.log('Attempting to connect to WebSocket...');
    setError('');
    
    const socket = new SockJS('/ws');
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log('STOMP Debug:', str);
        setMessages(prev => [...prev, { type: 'debug', message: str, timestamp: new Date() }]);
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
      setMessages(prev => [...prev, { 
        type: 'success', 
        message: 'Connected to WebSocket successfully', 
        timestamp: new Date() 
      }]);
      
      // Subscribe to test topic
      stompClient.current.subscribe('/topic/test', (message) => {
        const receivedMessage = JSON.parse(message.body);
        console.log('Received test message:', receivedMessage);
        setMessages(prev => [...prev, { 
          type: 'received', 
          message: `Test message: ${JSON.stringify(receivedMessage)}`, 
          timestamp: new Date() 
        }]);
      });
      
      // Subscribe to public messages
      stompClient.current.subscribe('/topic/public', (message) => {
        const receivedMessage = JSON.parse(message.body);
        console.log('Received public message:', receivedMessage);
        setMessages(prev => [...prev, { 
          type: 'received', 
          message: `Public message: ${JSON.stringify(receivedMessage)}`, 
          timestamp: new Date() 
        }]);
      });

      // Subscribe to room-specific messages
      stompClient.current.subscribe('/topic/chat.1', (message) => {
        const receivedMessage = JSON.parse(message.body);
        console.log('Received room message:', receivedMessage);
        setMessages(prev => [...prev, { 
          type: 'received', 
          message: `Room message: ${JSON.stringify(receivedMessage)}`, 
          timestamp: new Date() 
        }]);
      });
    };

    stompClient.current.onStompError = (frame) => {
      console.error('STOMP Error:', frame);
      setConnected(false);
      setError(`WebSocket Error: ${frame.headers.message || 'Unknown error'}`);
      setMessages(prev => [...prev, { 
        type: 'error', 
        message: `STOMP Error: ${frame.headers.message || 'Unknown error'}`, 
        timestamp: new Date() 
      }]);
    };

    stompClient.current.onWebSocketError = (error) => {
      console.error('WebSocket Error:', error);
      setConnected(false);
      setError(`WebSocket Error: ${error.message}`);
      setMessages(prev => [...prev, { 
        type: 'error', 
        message: `WebSocket Error: ${error.message}`, 
        timestamp: new Date() 
      }]);
    };

    stompClient.current.activate();
  };

  const disconnectWebSocket = () => {
    if (stompClient.current) {
      stompClient.current.deactivate();
      setConnected(false);
      setMessages(prev => [...prev, { 
        type: 'info', 
        message: 'Disconnected from WebSocket', 
        timestamp: new Date() 
      }]);
    }
  };

  const sendTestMessage = () => {
    if (!newMessage.trim() || !stompClient.current?.connected) return;

    const messageToSend = {
      message: newMessage.trim()
    };

    console.log('Sending test message:', messageToSend);

    stompClient.current.publish({
      destination: '/app/test',
      body: JSON.stringify(messageToSend)
    });

    setMessages(prev => [...prev, { 
      type: 'sent', 
      message: `Sent test message: ${newMessage.trim()}`, 
      timestamp: new Date() 
    }]);

    setNewMessage('');
  };

  const sendChatMessage = () => {
    if (!newMessage.trim() || !stompClient.current?.connected) return;

    const messageToSend = {
      message: newMessage.trim(),
      chatRoomId: 1,
      messageType: 'TEXT'
    };

    console.log('Sending chat message:', messageToSend);

    stompClient.current.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(messageToSend)
    });

    setMessages(prev => [...prev, { 
      type: 'sent', 
      message: `Sent chat message: ${newMessage.trim()}`, 
      timestamp: new Date() 
    }]);

    setNewMessage('');
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const getMessageColor = (type) => {
    switch (type) {
      case 'error': return 'error.main';
      case 'success': return 'success.main';
      case 'sent': return 'primary.main';
      case 'received': return 'secondary.main';
      case 'debug': return 'text.secondary';
      default: return 'text.primary';
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1000 }}>
      <Typography variant="h4" gutterBottom>
        WebSocket Debug Tool
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">
          Connection Status: {connected ? 'Connected' : 'Disconnected'}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Button onClick={connectWebSocket} disabled={connected} sx={{ mr: 1 }}>
            Connect
          </Button>
          <Button onClick={disconnectWebSocket} disabled={!connected} sx={{ mr: 1 }}>
            Disconnect
          </Button>
          <Button onClick={clearMessages} variant="outlined">
            Clear Messages
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Send Messages
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <TextField
            fullWidth
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && sendTestMessage()}
          />
          <Button onClick={sendTestMessage} disabled={!connected}>
            Send Test
          </Button>
          <Button onClick={sendChatMessage} disabled={!connected}>
            Send Chat
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Messages ({messages.length})
        </Typography>
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          <List>
            {messages.map((msg, index) => (
              <ListItem key={index} sx={{ 
                border: 1, 
                borderColor: 'divider', 
                mb: 1, 
                borderRadius: 1,
                backgroundColor: msg.type === 'debug' ? 'grey.50' : 'white'
              }}>
                <Box sx={{ width: '100%' }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: getMessageColor(msg.type),
                      fontFamily: msg.type === 'debug' ? 'monospace' : 'inherit',
                      fontSize: msg.type === 'debug' ? '0.75rem' : 'inherit'
                    }}
                  >
                    {msg.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {msg.timestamp.toLocaleTimeString()}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>
    </Box>
  );
}

export default WebSocketDebug; 