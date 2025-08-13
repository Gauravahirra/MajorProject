import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';
import { useAuth } from '../../utils/auth';

const SessionWarning = () => {
  const { sessionWarning, sessionExpired, refreshSession, autoLogout, getTokenInfo } = useAuth();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (sessionWarning) {
      setShowDialog(true);
      setTimeLeft(300); // Reset to 5 minutes
    } else {
      setShowDialog(false);
    }
  }, [sessionWarning]);

  useEffect(() => {
    if (!showDialog) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          autoLogout('Session timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showDialog, autoLogout]);

  const handleExtendSession = () => {
    refreshSession();
    setShowDialog(false);
  };

  const handleLogout = () => {
    autoLogout('User chose to logout');
    setShowDialog(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressValue = ((300 - timeLeft) / 300) * 100;

  if (!showDialog) return null;

  return (
    <Dialog
      open={showDialog}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      disableBackdropClick
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        color: 'warning.main',
        pb: 1
      }}>
        <WarningIcon color="warning" />
        Session Expiring Soon
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Your session will expire in <strong>{formatTime(timeLeft)}</strong>. 
            To continue working, please extend your session.
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <TimerIcon color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              Time remaining: {formatTime(timeLeft)}
            </Typography>
          </Box>
          
          <LinearProgress 
            variant="determinate" 
            value={progressValue} 
            color="warning"
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
        
        <Alert severity="warning" sx={{ mb: 2 }}>
          Any unsaved work will be lost if your session expires.
        </Alert>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={handleLogout}
          variant="outlined"
          color="error"
        >
          Logout Now
        </Button>
        <Button 
          onClick={handleExtendSession}
          variant="contained"
          color="primary"
          autoFocus
        >
          Extend Session
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionWarning;
