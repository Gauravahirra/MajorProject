import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  Button,
  Paper,
  Divider,
  Chip,
  IconButton,
  Badge,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  School as SchoolIcon,
  Computer as ComputerIcon,
  ExitToApp as ExitIcon,
  Notifications as NotificationsIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon
} from '@mui/icons-material';
import { useAuth } from '../../utils/auth';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

function RealTimeChat() {
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  
  const messagesEndRef = useRef(null);
  const stompClient = useRef(null);
  const reconnectTimeout = useRef(null);

  useEffect(() => {
    loadChatRooms();
    return () => {
      disconnectWebSocket();
    };
  }, []);

  useEffect(() => {
    if (selectedRoom && isConnected) {
      loadMessages(selectedRoom.id);
      joinRoom(selectedRoom.id);
    }
  }, [selectedRoom, isConnected]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const connectWebSocket = () => {
    if (stompClient.current && stompClient.current.connected) {
      return;
    }

    setConnectionStatus('connecting');
    
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
      setIsConnected(true);
      setConnectionStatus('connected');
      setError('');
      
      // Subscribe to public messages
      stompClient.current.subscribe('/topic/public', (message) => {
        const receivedMessage = JSON.parse(message.body);
        setMessages(prev => [...prev, receivedMessage]);
      });

      // Subscribe to room-specific messages
      if (selectedRoom) {
        stompClient.current.subscribe(`/topic/chat.${selectedRoom.id}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages(prev => [...prev, receivedMessage]);
        });
      }

      // Subscribe to user-specific messages
      stompClient.current.subscribe('/user/queue/errors', (message) => {
        const error = JSON.parse(message.body);
        setError(error.error || 'An error occurred');
      });

      // Send user join message
      stompClient.current.publish({
        destination: '/app/chat.addUser',
        body: JSON.stringify({
          message: `${user.name} joined the chat`,
          messageType: 'SYSTEM'
        })
      });
    };

    stompClient.current.onStompError = (frame) => {
      console.error('STOMP Error:', frame);
      setError('WebSocket connection error: ' + frame.headers.message);
      setConnectionStatus('error');
      setIsConnected(false);
    };

    stompClient.current.onDisconnect = () => {
      console.log('Disconnected from WebSocket');
      setIsConnected(false);
      setConnectionStatus('disconnected');
      
      // Attempt to reconnect after 5 seconds
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      reconnectTimeout.current = setTimeout(() => {
        if (!stompClient.current.connected) {
          connectWebSocket();
        }
      }, 5000);
    };

    stompClient.current.activate();
  };

  const disconnectWebSocket = () => {
    if (stompClient.current) {
      stompClient.current.deactivate();
    }
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }
  };

  const loadChatRooms = async () => {
    try {
      const response = await fetch('/api/chat/rooms');
      if (response.ok) {
        const data = await response.json();
        setChatRooms(data);
        if (data.length > 0) {
          setSelectedRoom(data[0]);
        }
      }
    } catch (error) {
      setError('Failed to load chat rooms');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (roomId) => {
    try {
      const response = await fetch(`/api/chat/rooms/${roomId}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.content || []);
      }
    } catch (error) {
      setError('Failed to load messages');
    }
  };

  const joinRoom = (roomId) => {
    if (stompClient.current && stompClient.current.connected) {
      // Subscribe to room-specific messages
      stompClient.current.subscribe(`/topic/chat.${roomId}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        setMessages(prev => [...prev, receivedMessage]);
      });

      // Send join room message
      stompClient.current.publish({
        destination: '/app/chat.joinRoom',
        body: JSON.stringify({ roomId: roomId })
      });
    }
  };

  const leaveRoom = (roomId) => {
    if (stompClient.current && stompClient.current.connected) {
      stompClient.current.publish({
        destination: '/app/chat.leaveRoom',
        body: JSON.stringify({ roomId: roomId })
      });
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedRoom || !stompClient.current?.connected) return;

    const messageToSend = {
      message: newMessage.trim(),
      chatRoomId: selectedRoom.id,
      messageType: 'TEXT'
    };

    stompClient.current.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(messageToSend)
    });

    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Academic': return <SchoolIcon />;
      case 'Technology': return <ComputerIcon />;
      case 'General': return <ChatIcon />;
      default: return <GroupIcon />;
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageTypeColor = (messageType) => {
    switch (messageType) {
      case 'SYSTEM': return 'warning';
      case 'TEXT': return 'primary';
      default: return 'default';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <WifiIcon color="success" />;
      case 'connecting':
        return <CircularProgress size={20} />;
      case 'error':
        return <WifiOffIcon color="error" />;
      default:
        return <WifiOffIcon color="disabled" />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 200px)', display: 'flex' }}>
      {/* Connection Status */}
      <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
        <Chip
          icon={getConnectionStatusIcon()}
          label={connectionStatus}
          color={connectionStatus === 'connected' ? 'success' : 'default'}
          variant="outlined"
          onClick={connectionStatus === 'disconnected' ? connectWebSocket : undefined}
        />
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ position: 'absolute', top: 60, right: 10, zIndex: 1000 }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      {/* Chat Rooms Sidebar */}
      <Box sx={{ width: 300, mr: 3 }}>
        <Typography variant="h6" gutterBottom>
          Chat Rooms
        </Typography>
        
        <List>
          {chatRooms.map((room) => (
            <Card
              key={room.id}
              sx={{
                mb: 2,
                cursor: 'pointer',
                border: selectedRoom?.id === room.id ? 2 : 1,
                borderColor: selectedRoom?.id === room.id ? 'primary.main' : 'divider'
              }}
              onClick={() => setSelectedRoom(room)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
                    {getCategoryIcon(room.category)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{room.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {room.description}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    size="small"
                    label={`${room.currentUsers}/${room.maxUsers} users`}
                    color="primary"
                    variant="outlined"
                  />
                  {room.isPrivate && (
                    <Chip size="small" label="Private" color="secondary" />
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </List>
      </Box>

      {/* Chat Messages */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <Paper sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6">{selectedRoom.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedRoom.description}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Chip
                    size="small"
                    label={`${selectedRoom.currentUsers} online`}
                    color="success"
                  />
                  <IconButton
                    size="small"
                    onClick={() => leaveRoom(selectedRoom.id)}
                    color="error"
                  >
                    <ExitIcon />
                  </IconButton>
                </Box>
              </Box>
            </Paper>

            {/* Messages */}
            <Paper sx={{ flexGrow: 1, mb: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                <List>
                  {messages.map((message, index) => (
                    <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
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
                            color={getMessageTypeColor(message.messageType)}
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
                  ))}
                  <div ref={messagesEndRef} />
                </List>
              </Box>
            </Paper>

            {/* Message Input */}
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  placeholder={isConnected ? "Type your message..." : "Connecting..."}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  multiline
                  maxRows={3}
                  disabled={!isConnected}
                />
                <IconButton
                  color="primary"
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || !isConnected}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Paper>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography variant="h6" color="text.secondary">
              Select a chat room to start messaging
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default RealTimeChat; 