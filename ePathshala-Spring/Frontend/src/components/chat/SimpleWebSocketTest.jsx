import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Typography, Alert, Paper } from '@mui/material';

function SimpleWebSocketTest() {
  const [status, setStatus] = useState('disconnected');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const wsRef = useRef(null);

  const connect = () => {
    try {
      console.log('🔌 Attempting to connect to WebSocket...');
      setStatus('connecting');
      setError('');

      // Create a simple WebSocket connection
      const ws = new WebSocket('ws://localhost:3000/ws');
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ WebSocket connected');
        setStatus('connected');
        setMessages(prev => [...prev, `Connected at ${new Date().toLocaleTimeString()}`]);
      };

      ws.onmessage = (event) => {
        console.log('📨 Received message:', event.data);
        setMessages(prev => [...prev, `Received: ${event.data} at ${new Date().toLocaleTimeString()}`]);
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setStatus('error');
        setError('WebSocket connection error');
      };

      ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        setStatus('disconnected');
        setMessages(prev => [...prev, `Disconnected at ${new Date().toLocaleTimeString()}`]);
      };

    } catch (error) {
      console.error('❌ Error creating WebSocket:', error);
      setError(`Failed to create WebSocket: ${error.message}`);
      setStatus('error');
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
  };

  const sendTestMessage = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log('📤 Sending test message...');
      wsRef.current.send('Hello from frontend!');
      setMessages(prev => [...prev, `Sent: Hello from frontend! at ${new Date().toLocaleTimeString()}`]);
    } else {
      setError('WebSocket not connected');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Simple WebSocket Test
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Button 
          variant="contained" 
          onClick={connect}
          disabled={status === 'connecting'}
          sx={{ mr: 1 }}
        >
          {status === 'connecting' ? 'Connecting...' : 'Connect'}
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={disconnect}
          disabled={status === 'disconnected'}
          sx={{ mr: 1 }}
        >
          Disconnect
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={sendTestMessage}
          disabled={status !== 'connected'}
        >
          Send Test Message
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Status: {status}</Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}
      </Paper>

      <Paper sx={{ p: 2, maxHeight: 300, overflow: 'auto' }}>
        <Typography variant="h6" gutterBottom>Messages:</Typography>
        {messages.map((msg, index) => (
          <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
            {msg}
          </Typography>
        ))}
      </Paper>
    </Box>
  );
}

export default SimpleWebSocketTest; 