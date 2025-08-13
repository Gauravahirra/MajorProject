import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Fade
} from '@mui/material';
import {
  SmartToy as ChatbotIcon
} from '@mui/icons-material';
import Chatbot from '../components/common/Chatbot';

function ChatbotPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in timeout={500}>
        <Box>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <ChatbotIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            </Box>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              AI Assistant
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                fontSize: { xs: '1rem', sm: '1.125rem' },
                maxWidth: 'md',
                mx: 'auto',
              }}
            >
              Get instant help and answers to your questions about ePathshala
            </Typography>
          </Box>

          {/* Chatbot Component */}
          <Paper
            elevation={4}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Chatbot open={true} onClose={() => {}} />
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
}

export default ChatbotPage;
