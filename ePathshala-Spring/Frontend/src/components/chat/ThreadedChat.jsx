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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Badge,
  Alert,
  CircularProgress,
  Collapse,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  School as SchoolIcon,
  Computer as ComputerIcon,
  Add as AddIcon,
  ExitToApp as ExitIcon,
  Notifications as NotificationsIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Reply as ReplyIcon,
  ExpandMore as ExpandMoreIcon,
  Create as CreateIcon,
  Flag as FlagIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useAuth } from '../../utils/auth';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

function ThreadedChat() {
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [threads, setThreads] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  
  // Dialog states
  const [createThreadDialog, setCreateThreadDialog] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadCategory, setNewThreadCategory] = useState('General');
  const [moderationDialog, setModerationDialog] = useState(false);
  const [selectedMessageForModeration, setSelectedMessageForModeration] = useState(null);
  
  const messagesEndRef = useRef(null);
  const stompClient = useRef(null);
  const reconnectTimeout = useRef(null);

  useEffect(() => {
    loadChatRooms();
    connectWebSocket();
    return () => {
      disconnectWebSocket();
    };
  }, []);

  useEffect(() => {
    if (selectedRoom && isConnected) {
      loadMessages(selectedRoom.id);
      joinRoom(selectedRoom.id);
      
      // Subscribe to room-specific messages
      const subscription = stompClient.current.subscribe(`/topic/chat.${selectedRoom.id}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        console.log('Received room message:', receivedMessage);
        setMessages(prev => [...prev, receivedMessage]);
      });
      
      // Store subscription for cleanup
      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
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
      connectHeaders: {
        'userEmail': user?.email || 'admin@epathshala.com',
        'userId': user?.id || '1',
        'userName': user?.name || 'Admin User'
      }
    });

    stompClient.current.onConnect = (frame) => {
      console.log('Connected to WebSocket:', frame);
      setIsConnected(true);
      setConnectionStatus('connected');
      setError('');
      
      // Send user information to set up session
      if (user) {
        stompClient.current.publish({
          destination: '/app/chat.addUser',
          body: JSON.stringify({
            userEmail: user.email,
            userId: user.id,
            userName: user.name
          })
        });
      }
      
      // Subscribe to user-specific messages
      stompClient.current.subscribe('/user/queue/errors', (message) => {
        const error = JSON.parse(message.body);
        setError(error.error || 'An error occurred');
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
    if (stompClient.current?.connected) {
      stompClient.current.publish({
        destination: '/app/chat.joinRoom',
        body: JSON.stringify({ roomId })
      });
    }
  };

  const leaveRoom = async (roomId) => {
    if (stompClient.current?.connected) {
      stompClient.current.publish({
        destination: '/app/chat.leaveRoom',
        body: JSON.stringify({ roomId })
      });
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedRoom || !stompClient.current?.connected) return;

    const messageToSend = {
      message: newMessage.trim(),
      chatRoomId: selectedRoom.id,
      messageType: 'TEXT',
      replyTo: replyTo?.id || null,
      threadId: replyTo?.threadId || null
    };

    console.log('Sending message:', messageToSend);

    stompClient.current.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(messageToSend)
    });

    setNewMessage('');
    setReplyTo(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startReply = (message) => {
    setReplyTo(message);
  };

  const cancelReply = () => {
    setReplyTo(null);
  };

  const createThread = () => {
    if (!newThreadTitle.trim()) return;

    const threadData = {
      title: newThreadTitle.trim(),
      category: newThreadCategory,
      roomId: selectedRoom.id,
      createdBy: user.id
    };

    // Send thread creation message
    const messageToSend = {
      message: `New thread created: ${newThreadTitle}`,
      chatRoomId: selectedRoom.id,
      messageType: 'THREAD_CREATE',
      threadData: threadData
    };

    stompClient.current.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(messageToSend)
    });

    setCreateThreadDialog(false);
    setNewThreadTitle('');
    setNewThreadCategory('General');
  };

  const moderateMessage = (message, action) => {
    if (!user || user.role !== 'ADMIN') return;

    const moderationData = {
      messageId: message.id,
      action: action, // 'delete', 'edit', 'flag'
      moderatorId: user.id
    };

    stompClient.current.publish({
      destination: '/app/chat.moderate',
      body: JSON.stringify(moderationData)
    });

    setModerationDialog(false);
    setSelectedMessageForModeration(null);
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
      case 'THREAD_CREATE': return 'success';
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

  const canModerate = user?.role === 'ADMIN';

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading chat rooms...</Typography>
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
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    size="small"
                    label={`${selectedRoom.currentUsers} online`}
                    color="success"
                  />
                  <IconButton
                    size="small"
                    onClick={() => setCreateThreadDialog(true)}
                    color="primary"
                  >
                    <CreateIcon />
                  </IconButton>
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

            {/* Reply Preview */}
            {replyTo && (
              <Paper sx={{ p: 1, mb: 1, bgcolor: 'primary.light', color: 'white' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">
                    Replying to: {replyTo.authorName} - {replyTo.message.substring(0, 50)}...
                  </Typography>
                  <IconButton size="small" onClick={cancelReply} color="inherit">
                    <ExitIcon />
                  </IconButton>
                </Box>
              </Paper>
            )}

            {/* Messages */}
            <Paper sx={{ flexGrow: 1, mb: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="caption" color="text.secondary">
                  Messages: {messages.length}
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                <List>
                  {messages.map((message, index) => (
                    <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
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
                            color={getMessageTypeColor(message.messageType)}
                            variant="outlined"
                          />
                        )}
                        <Box sx={{ flexGrow: 1 }} />
                        <IconButton
                          size="small"
                          onClick={() => startReply(message)}
                          color="primary"
                        >
                          <ReplyIcon />
                        </IconButton>
                        {canModerate && (
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedMessageForModeration(message);
                              setModerationDialog(true);
                            }}
                            color="warning"
                          >
                            <FlagIcon />
                          </IconButton>
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
                        {message.replyTo && (
                          <Box sx={{ mt: 1, p: 1, bgcolor: 'grey.200', borderRadius: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Replying to: {message.replyTo.authorName}
                            </Typography>
                          </Box>
                        )}
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

      {/* Create Thread Dialog */}
      <Dialog open={createThreadDialog} onClose={() => setCreateThreadDialog(false)}>
        <DialogTitle>Create New Thread</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Thread Title"
            value={newThreadTitle}
            onChange={(e) => setNewThreadTitle(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={newThreadCategory}
              onChange={(e) => setNewThreadCategory(e.target.value)}
              label="Category"
            >
              <MenuItem value="General">General</MenuItem>
              <MenuItem value="Academic">Academic</MenuItem>
              <MenuItem value="Technology">Technology</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateThreadDialog(false)}>Cancel</Button>
          <Button onClick={createThread} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Moderation Dialog */}
      <Dialog open={moderationDialog} onClose={() => setModerationDialog(false)}>
        <DialogTitle>Moderate Message</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Message: {selectedMessageForModeration?.message}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Author: {selectedMessageForModeration?.authorName}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModerationDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => moderateMessage(selectedMessageForModeration, 'flag')}
            color="warning"
          >
            Flag
          </Button>
          <Button 
            onClick={() => moderateMessage(selectedMessageForModeration, 'edit')}
            color="info"
          >
            Edit
          </Button>
          <Button 
            onClick={() => moderateMessage(selectedMessageForModeration, 'delete')}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ThreadedChat; 