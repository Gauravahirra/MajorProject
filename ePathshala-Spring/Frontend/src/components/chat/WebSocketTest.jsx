import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

function WebSocketTest() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [testMessage, setTestMessage] = useState('');
  const [error, setError] = useState('');
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
    console.log('Attempting to connect WebSocket...');
    
    const socket = new SockJS('/ws');
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.current.onConnect = (frame) => {
      console.log('Connected to WebSocket:', frame);
      setConnected(true);
      setError('');
      
      // Subscribe to test topic
      stompClient.current.subscribe('/topic/test', (message) => {
        const receivedMessage = JSON.parse(message.body);
        setMessages(prev => [...prev, receivedMessage]);
      });
    };

    stompClient.current.onStompError = (frame) => {
      console.error('STOMP Error:', frame);
      setError('WebSocket connection error: ' + frame.headers.message);
      setConnected(false);
    };

    stompClient.current.onDisconnect = () => {
      console.log('Disconnected from WebSocket');
      setConnected(false);
    };

    stompClient.current.activate();
  };

  const sendTestMessage = () => {
    if (stompClient.current && stompClient.current.connected && testMessage.trim()) {
      stompClient.current.publish({
        destination: '/app/test',
        body: JSON.stringify({ message: testMessage })
      });
      setTestMessage('');
    }
  };

  const testBackendConnection = async () => {
    try {
      const response = await fetch('/api/ws-test');
      const data = await response.json();
      setMessages(prev => [...prev, { type: 'HTTP', ...data }]);
    } catch (error) {
      setError('Backend connection failed: ' + error.message);
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 600 }}>
      <Typography variant="h5" gutterBottom>
        WebSocket Test
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Connection Status: {connected ? 'Connected' : 'Disconnected'}
        </Typography>
        
        <Button 
          variant="contained" 
          onClick={connectWebSocket}
          disabled={connected}
          sx={{ mr: 1 }}
        >
          Connect
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={testBackendConnection}
        >
          Test Backend
        </Button>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Send Test Message
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Enter test message"
            onKeyPress={(e) => e.key === 'Enter' && sendTestMessage()}
          />
          <Button 
            variant="contained" 
            onClick={sendTestMessage}
            disabled={!connected || !testMessage.trim()}
          >
            Send
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Messages ({messages.length})
        </Typography>
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {messages.map((msg, index) => (
            <Box key={index} sx={{ mb: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {msg.timestamp || new Date().toLocaleTimeString()}
              </Typography>
              <Typography variant="body1">
                {msg.message || JSON.stringify(msg)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}

export default WebSocketTest; 