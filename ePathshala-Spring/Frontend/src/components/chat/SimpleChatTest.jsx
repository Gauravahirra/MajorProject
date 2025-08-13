import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, TextField, Typography, Paper, List, ListItem } from '@mui/material';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

function SimpleChatTest() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connected, setConnected] = useState(false);
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
        'userEmail': 'test@test.com',
        'userId': '1',
        'userName': 'Test User'
      }
    });

    stompClient.current.onConnect = (frame) => {
      console.log('Connected to WebSocket:', frame);
      setConnected(true);
      
      // Subscribe to test topic
      stompClient.current.subscribe('/topic/test', (message) => {
        const receivedMessage = JSON.parse(message.body);
        console.log('Received test message:', receivedMessage);
        setMessages(prev => [...prev, receivedMessage]);
      });
      
      // Subscribe to public messages
      stompClient.current.subscribe('/topic/public', (message) => {
        const receivedMessage = JSON.parse(message.body);
        console.log('Received public message:', receivedMessage);
        setMessages(prev => [...prev, receivedMessage]);
      });
    };

    stompClient.current.onStompError = (frame) => {
      console.error('STOMP Error:', frame);
      setConnected(false);
    };

    stompClient.current.activate();
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

    setNewMessage('');
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800 }}>
      <Typography variant="h4" gutterBottom>
        Simple Chat Test
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">
          Connection Status: {connected ? 'Connected' : 'Disconnected'}
        </Typography>
        <Button onClick={connectWebSocket} disabled={connected}>
          Connect
        </Button>
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
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index} sx={{ border: 1, borderColor: 'divider', mb: 1, borderRadius: 1 }}>
              <Box>
                <Typography variant="body1">
                  {msg.message || JSON.stringify(msg)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {msg.timestamp || new Date().toLocaleTimeString()}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

export default SimpleChatTest; 