import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../utils/auth';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Fab,
  Drawer,
  AppBar,
  Toolbar,
  Button,
  Chip,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import {
  Send as SendIcon,
  Chat as ChatIcon,
  Close as CloseIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import ChatHeader from './ChatHeader';
import ChatMessageList from './ChatMessageList';
import ChatInputArea from './ChatInputArea';
import PredefinedQuestionSelector from './PredefinedQuestionSelector';

const PREDEFINED_QUESTIONS = [
  "What is the academic calendar?",
  "How to check attendance?",
  "How to request leave?",
  "How to view grades?",
  "How to submit assignments?",
  "How to contact support?"
];

function Chatbot({ open, onClose }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          message: "Hello! I'm the ePathshala Assistant. How can I help you today?",
          isUserMessage: false,
          timestamp: new Date()
        }
      ]);
    }
  }, [open]);

  const sendPredefinedQuestion = async (question) => {
    if (isLoading || !user) return;
    setIsLoading(true);
    setSelectedQuestion('');
    // Add user question to chat
    const newUserMessage = {
      message: question,
      isUserMessage: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);
    try {
      const response = await fetch('/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          message: question,
          sessionId: sessionId,
          userRole: user.role,
          userEmail: `${user.name}@epathshala.com`
        })
      });
      if (response.ok) {
        const data = await response.json();
        setSessionId(data.sessionId);
        const botMessage = {
          message: data.response,
          isUserMessage: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        const errorText = await response.text();
        setMessages(prev => [...prev, {
          message: `Sorry, I'm having trouble responding right now. (${response.status}: ${errorText})`,
          isUserMessage: false,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        message: `Sorry, I'm having trouble responding right now. Error: ${error.message}`,
        isUserMessage: false,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    if (sessionId && user) {
      try {
        await fetch(`/api/chatbot/clear/${sessionId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
      } catch (error) {}
    }
    setMessages([]);
    setSessionId(null);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!user) return null;

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 380, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper', boxShadow: 6, borderRadius: 0 } }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BotIcon color="primary" />
          <Typography variant="h6" fontWeight={700}>ePathshala Assistant</Typography>
        </Box>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </Box>
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2, bgcolor: 'background.default', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {messages.map((msg, idx) => (
          <Box key={idx} sx={{
            display: 'flex',
            flexDirection: msg.isUserMessage ? 'row-reverse' : 'row',
            alignItems: 'flex-end',
            gap: 1,
          }}>
            <Avatar sx={{ bgcolor: msg.isUserMessage ? 'primary.main' : 'secondary.main', width: 28, height: 28 }}>
              {msg.isUserMessage ? <PersonIcon /> : <BotIcon />}
            </Avatar>
            <Paper elevation={2} sx={{
              p: 1.2,
              px: 2,
              borderRadius: 3,
              bgcolor: msg.isUserMessage ? 'primary.light' : 'grey.100',
              color: msg.isUserMessage ? 'primary.contrastText' : 'text.primary',
              maxWidth: '75%',
              minWidth: 40,
              wordBreak: 'break-word',
              boxShadow: msg.isUserMessage ? 2 : 1,
            }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{msg.message}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', float: 'right', mt: 0.5 }}>{formatTime(msg.timestamp)}</Typography>
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button size="small" startIcon={<ClearIcon />} onClick={clearChat} variant="outlined">Clear Chat</Button>
        </Box>
        <FormControl fullWidth disabled={isLoading}>
          <InputLabel id="chatbot-question-label">Choose a question...</InputLabel>
          <Select
            labelId="chatbot-question-label"
            value={selectedQuestion}
            label="Choose a question..."
            onChange={e => {
              setSelectedQuestion(e.target.value);
              sendPredefinedQuestion(e.target.value);
            }}
            sx={{ borderRadius: 2, bgcolor: 'background.default', fontWeight: 500 }}
          >
            {PREDEFINED_QUESTIONS.map((q) => (
              <MenuItem key={q} value={q}>{q}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {isLoading && <Typography align="center" sx={{ mt: 1 }}><span role="img" aria-label="loading">⏳</span> Waiting for response...</Typography>}
      </Box>
    </Drawer>
  );
}

export default Chatbot; 