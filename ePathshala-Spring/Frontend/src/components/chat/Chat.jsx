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
  Drawer,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  School as SchoolIcon,
  Computer as ComputerIcon,
  Add as AddIcon,
  ExitToApp as ExitIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon
} from '@mui/icons-material';
import { useAuth } from '../../utils/auth';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { getToken } from '../../utils/auth';
import { alpha } from '@mui/material/styles';
import ChatHeader from './ChatHeader';
import ChatSidebar from './ChatSidebar';
import ChatMessages from './ChatMessages';
import ChatInputBar from './ChatInputBar';

function Chat() {
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState([]);
  const [chatRoomsPage, setChatRoomsPage] = useState(0);
  const [chatRoomsHasMore, setChatRoomsHasMore] = useState(true);
  const [chatRoomsLoading, setChatRoomsLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  
  // Dialog states
  const [joinRoomDialog, setJoinRoomDialog] = useState(false);
  const [selectedRoomToJoin, setSelectedRoomToJoin] = useState(null);
  
  const messagesEndRef = useRef(null);
  const stompClient = useRef(null);
  const reconnectTimeout = useRef(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const stored = localStorage.getItem('chatSidebarCollapsed');
    return stored === 'true';
  });
  const handleToggleSidebarCollapse = () => {
    setSidebarCollapsed((prev) => {
      localStorage.setItem('chatSidebarCollapsed', !prev);
      return !prev;
    });
  };

  useEffect(() => {
    loadChatRooms(0);
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
        console.log('Current messages before update:', messages);
        setMessages(prev => {
          const newMessages = [...prev, receivedMessage];
          console.log('New messages array:', newMessages);
          return newMessages;
        });
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
    console.log('Messages state changed:', messages.length, messages);
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

  const loadChatRooms = async (page = 0) => {
    setChatRoomsLoading(true);
    try {
      const token = (typeof getToken === 'function' ? getToken() : localStorage.getItem('token'));
      const response = await fetch(`/api/chat/rooms/paged?page=${page}&size=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 401 || response.status === 403) {
        setError('You are not authorized to view chat rooms. Please log in again.');
        setChatRooms([]);
        setChatRoomsHasMore(false);
        return;
      }
      if (response.ok) {
        const data = await response.json();
        const newRooms = data.content || [];
        setChatRooms(prev => page === 0 ? newRooms : [...prev, ...newRooms]);
        setChatRoomsPage(data.number);
        setChatRoomsHasMore(!data.last);
        if (page === 0 && newRooms.length > 0) {
          setSelectedRoom(newRooms[0]);
        }
      }
    } catch (error) {
      setError('Failed to load chat rooms');
    } finally {
      setChatRoomsLoading(false);
      setLoading(false);
    }
  };

  const loadMessages = async (roomId) => {
    try {
      const response = await fetch(`/api/chat/rooms/${roomId}/messages`);
      if (response.ok) {
        const data = await response.json();
        const historicalMessages = data.content || [];
        console.log('Loaded historical messages:', historicalMessages.length);
        setMessages(historicalMessages);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      setError('Failed to load messages');
    }
  };

  const joinRoom = (roomId) => {
    if (stompClient.current && stompClient.current.connected) {
      // Send join room message
      stompClient.current.publish({
        destination: '/app/chat.joinRoom',
        body: JSON.stringify({ roomId: roomId })
      });
    }
  };

  const leaveRoom = async (roomId) => {
    try {
      await fetch(`/api/chat/rooms/${roomId}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });
    } catch (error) {
      console.error('Failed to leave room:', error);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedRoom || !stompClient.current?.connected) return;

    const messageToSend = {
      message: newMessage.trim(),
      chatRoomId: selectedRoom.id,
      messageType: 'TEXT'
    };

    console.log('Sending message:', messageToSend);
    console.log('Selected room:', selectedRoom);
    console.log('WebSocket connected:', stompClient.current?.connected);

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

  // Sidebar toggle for mobile
  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading chat rooms...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      width: '100%',
      maxWidth: '100vw',
      height: '100%',
      minHeight: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: isMobile ? 'stretch' : 'center',
      p: { xs: 0, sm: 2 },
      boxSizing: 'border-box',
      bgcolor: theme.palette.background.default,
      overflowX: 'hidden',
    }}>
      <Paper elevation={4} sx={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        maxWidth: 1100,
        minWidth: 0,
        maxHeight: { xs: '100%', md: '80vh' },
        minHeight: { xs: '100%', sm: 400 },
        borderRadius: 4,
        boxShadow: 4,
        overflow: 'hidden',
        position: 'relative',
        bgcolor: 'background.paper',
      }}>
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
        {/* Sidebar (Drawer on mobile) */}
        {isMobile ? (
          <Drawer
            anchor="left"
            open={sidebarOpen}
            onClose={handleSidebarClose}
            PaperProps={{ sx: { width: 260, p: 1, maxWidth: '80vw', borderRadius: 0, boxShadow: 2, minWidth: 0, minHeight: 0, bgcolor: theme.palette.background.paper } }}
            transitionDuration={300}
          >
            <ChatSidebar
              chatRooms={chatRooms}
              selectedRoom={selectedRoom}
              onSelectRoom={setSelectedRoom}
              loading={chatRoomsLoading}
              hasMore={chatRoomsHasMore}
              onLoadMore={() => loadChatRooms(chatRoomsPage + 1)}
              sidebarCollapsed={false}
              onToggleCollapse={() => {}}
              showNewRoomButton={true}
            />
          </Drawer>
        ) : (
          <Box sx={{
            width: sidebarCollapsed ? 60 : 280,
            transition: 'width 0.3s',
            bgcolor: 'background.paper',
            borderRight: 1,
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            boxShadow: 2,
            zIndex: 1,
          }}>
            <ChatSidebar
              chatRooms={chatRooms}
              selectedRoom={selectedRoom}
              onSelectRoom={setSelectedRoom}
              loading={chatRoomsLoading}
              hasMore={chatRoomsHasMore}
              onLoadMore={() => loadChatRooms(chatRoomsPage + 1)}
              sidebarCollapsed={sidebarCollapsed}
              onToggleCollapse={handleToggleSidebarCollapse}
              showNewRoomButton={true}
            />
          </Box>
        )}
        {/* Main Chat Area */}
        <Box sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: 0,
          p: { xs: 0, sm: 2 },
          width: '100%',
          maxWidth: 820,
          bgcolor: 'background.default',
          borderRadius: 0,
          boxShadow: 0,
          transition: 'margin 0.3s',
        }}>
          <ChatHeader
            isMobile={isMobile}
            onSidebarOpen={handleSidebarOpen}
            selectedRoom={selectedRoom}
            connectionStatus={connectionStatus}
            getConnectionStatusIcon={getConnectionStatusIcon}
            connectWebSocket={connectWebSocket}
          />
          <Box sx={{
            flexGrow: 1,
            overflowY: 'auto',
            px: { xs: 1, sm: 2 },
            py: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            bgcolor: 'background.default',
          }}>
            <ChatMessages
              messages={messages}
              messagesEndRef={messagesEndRef}
              getMessageTypeColor={getMessageTypeColor}
              getCategoryIcon={getCategoryIcon}
              formatTime={formatTime}
            />
          </Box>
          <Paper elevation={2} sx={{
            p: { xs: 1, sm: 2 },
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            position: 'sticky',
            bottom: 0,
            zIndex: 2,
            borderRadius: 0,
          }}>
            <ChatInputBar
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              isConnected={isConnected}
              handleSendMessage={sendMessage}
              loading={loading}
            />
          </Paper>
      </Box>
      </Paper>
    </Box>
  );
}

export default Chat; 