import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton,
  Chip,
  Alert,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  VideoCall as VideoCallIcon,
  Close as CloseIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  ScreenShare as ScreenShareIcon,
  Chat as ChatIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useAuth } from '../../utils/auth';

function JitsiMeet({ isOpen, onClose, roomName, userRole, userName }) {
  const jitsiContainerRef = useRef(null);
  const [api, setApi] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && roomName) {
      initializeJitsiMeet();
    }
    
    return () => {
      if (api) {
        api.dispose();
      }
    };
  }, [isOpen, roomName]);

  const initializeJitsiMeet = () => {
    try {
      // Load Jitsi Meet external API
      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = () => {
        createJitsiMeet();
      };
      document.head.appendChild(script);
    } catch (error) {
      setError('Failed to load Jitsi Meet');
    }
  };

  const createJitsiMeet = () => {
    try {
      const domain = 'meet.jit.si';
      const options = {
        roomName: roomName,
        width: '100%',
        height: '100%',
        parentNode: jitsiContainerRef.current,
        userInfo: {
          displayName: userName,
          email: `${userName}@epathshala.com`
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          prejoinPageEnabled: false,
          disableModeratorIndicator: true,
          enableClosePage: false,
          toolbarButtons: [
            'microphone',
            'camera',
            'desktop',
            'chat',
            'raisehand',
            'settings',
            'hangup'
          ]
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone',
            'camera',
            'desktop',
            'chat',
            'raisehand',
            'settings',
            'hangup'
          ],
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_POWERED_BY: false,
          SHOW_BRAND_WATERMARK: false,
          AUTHENTICATION_ENABLE: false,
          TOOLBAR_ALWAYS_VISIBLE: true,
          TOOLBAR_BUTTONS_ALWAYS_VISIBLE: true,
          SHOW_PROMOTIONAL_CLOSE_PAGE: false
        }
      };

      const jitsiApi = new window.JitsiMeetExternalAPI(domain, options);
      setApi(jitsiApi);

      // Event listeners
      jitsiApi.addEventListeners({
        readyToClose: handleClose,
        participantJoined: handleParticipantJoined,
        participantLeft: handleParticipantLeft,
        audioMuteStatusChanged: handleAudioMuteStatusChanged,
        videoMuteStatusChanged: handleVideoMuteStatusChanged,
        screenSharingStatusChanged: handleScreenSharingStatusChanged,
        raiseHandUpdated: handleRaiseHandUpdated
      });

      setIsJoined(true);
    } catch (error) {
      setError('Failed to create Jitsi Meet session');
    }
  };

  const handleClose = () => {
    setIsJoined(false);
    onClose();
  };

  const handleParticipantJoined = (participant) => {
    setParticipants(prev => [...prev, participant]);
  };

  const handleParticipantLeft = (participant) => {
    setParticipants(prev => prev.filter(p => p.id !== participant.id));
  };

  const handleAudioMuteStatusChanged = (isMuted) => {
    setIsAudioEnabled(!isMuted);
  };

  const handleVideoMuteStatusChanged = (isMuted) => {
    setIsVideoEnabled(!isMuted);
  };

  const handleScreenSharingStatusChanged = (isSharing) => {
    setIsScreenSharing(isSharing);
  };

  const handleRaiseHandUpdated = (participant, isRaised) => {
    // Handle raise hand functionality
  };

  const toggleAudio = () => {
    if (api) {
      api.executeCommand('toggleAudio');
    }
  };

  const toggleVideo = () => {
    if (api) {
      api.executeCommand('toggleVideo');
    }
  };

  const toggleScreenShare = () => {
    if (api) {
      api.executeCommand('toggleShareScreen');
    }
  };

  const raiseHand = () => {
    if (api) {
      api.executeCommand('raiseHand');
    }
  };

  const openChat = () => {
    if (api) {
      api.executeCommand('toggleChat');
    }
  };

  const openSettings = () => {
    if (api) {
      api.executeCommand('openSettings');
    }
  };

  const leaveMeeting = () => {
    if (api) {
      api.executeCommand('hangup');
    }
    handleClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <VideoCallIcon color="primary" />
          <Typography variant="h6">
            Online Class - {roomName}
          </Typography>
          <Chip 
            label={`${participants.length + 1} participants`} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
        </Box>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, position: 'relative' }}>
        {error && (
          <Alert severity="error" sx={{ position: 'absolute', top: 10, left: 10, right: 10, zIndex: 1000 }}>
            {error}
          </Alert>
        )}

        {/* Jitsi Meet Container */}
        <Box
          ref={jitsiContainerRef}
          sx={{
            width: '100%',
            height: '100%',
            minHeight: '500px',
            backgroundColor: '#000'
          }}
        />

        {/* Custom Controls Overlay */}
        {isJoined && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 1,
              backgroundColor: 'rgba(0,0,0,0.7)',
              borderRadius: 2,
              padding: 1
            }}
          >
            <IconButton
              onClick={toggleAudio}
              sx={{ 
                backgroundColor: isAudioEnabled ? 'success.main' : 'error.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: isAudioEnabled ? 'success.dark' : 'error.dark'
                }
              }}
            >
              {isAudioEnabled ? <MicIcon /> : <MicOffIcon />}
            </IconButton>

            <IconButton
              onClick={toggleVideo}
              sx={{ 
                backgroundColor: isVideoEnabled ? 'success.main' : 'error.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: isVideoEnabled ? 'success.dark' : 'error.dark'
                }
              }}
            >
              {isVideoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>

            <IconButton
              onClick={toggleScreenShare}
              sx={{ 
                backgroundColor: isScreenSharing ? 'warning.main' : 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: isScreenSharing ? 'warning.dark' : 'primary.dark'
                }
              }}
            >
              <ScreenShareIcon />
            </IconButton>

            <IconButton
              onClick={openChat}
              sx={{ 
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark'
                }
              }}
            >
              <ChatIcon />
            </IconButton>

            <IconButton
              onClick={openSettings}
              sx={{ 
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark'
                }
              }}
            >
              <SettingsIcon />
            </IconButton>

            <Button
              variant="contained"
              color="error"
              onClick={leaveMeeting}
              startIcon={<CloseIcon />}
            >
              Leave
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default JitsiMeet; 