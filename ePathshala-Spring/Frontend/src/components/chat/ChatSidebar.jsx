import React from 'react';
import { Box, List, Card, CardContent, Typography, Chip, Button, CircularProgress, Avatar, IconButton, Tooltip, Fade } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ChatIcon from '@mui/icons-material/Chat';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const SIDEBAR_COLLAPSED_WIDTH = 60;
const SIDEBAR_EXPANDED_WIDTH = 280;

function ChatSidebar({ chatRooms, selectedRoom, onSelectRoom, loading, hasMore, onLoadMore, sidebarCollapsed, onToggleCollapse }) {
  const theme = useTheme();
  return (
    <Box sx={{
      width: { sm: sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH },
      minWidth: 0,
      minHeight: 0,
      p: 1,
      overflowY: 'auto',
      bgcolor: theme.palette.grey[50],
      borderRight: 1,
      borderColor: 'divider',
      transition: 'width 0.3s',
      display: { xs: 'none', sm: 'block' },
    }}>
      {/* Collapse/Expand Button */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-end', mb: 2 }}>
        <Tooltip title={sidebarCollapsed ? 'Expand' : 'Collapse'}>
          <IconButton
            size="small"
            onClick={onToggleCollapse}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            sx={{
              transition: 'transform 0.3s',
              transform: sidebarCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Tooltip>
      </Box>
      <Fade in={!sidebarCollapsed} timeout={300} unmountOnExit>
        <Typography variant="h6" gutterBottom sx={{ px: 1, pt: 1 }}>
          Chat Rooms
        </Typography>
      </Fade>
      <List sx={{ p: 0 }}>
        {chatRooms.map((room) => (
          <Card
            key={room.id}
            sx={{
              mb: 2,
              cursor: 'pointer',
              border: 0,
              boxShadow: selectedRoom?.id === room.id ? 3 : 1,
              background: selectedRoom?.id === room.id ? theme.palette.action.selected : theme.palette.background.paper,
              transition: 'box-shadow 0.2s, background 0.2s',
              '&:hover': { boxShadow: 4, background: theme.palette.action.hover },
            }}
            onClick={() => onSelectRoom(room)}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}>
              <Tooltip title={room.name} placement="right">
                <Avatar sx={{ bgcolor: theme.palette.primary.light, color: theme.palette.primary.contrastText }}>
                  <ChatIcon />
                </Avatar>
              </Tooltip>
              <Fade in={!sidebarCollapsed} timeout={300} unmountOnExit>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600}>{room.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {room.description}
                  </Typography>
                </Box>
              </Fade>
              <Fade in={!sidebarCollapsed} timeout={300} unmountOnExit>
                <Box>
                  <Chip
                    size="small"
                    label={`${room.currentUsers}/${room.maxUsers}`}
                    color="primary"
                    variant="outlined"
                    sx={{ fontSize: '0.75rem', height: 22 }}
                  />
                  {room.isPrivate && (
                    <Chip size="small" label="Private" color="secondary" sx={{ ml: 1, fontSize: '0.75rem', height: 22 }} />
                  )}
                </Box>
              </Fade>
            </CardContent>
          </Card>
        ))}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        {hasMore && !loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <Button variant="outlined" onClick={onLoadMore}>
              Load More
            </Button>
          </Box>
        )}
      </List>
    </Box>
  );
}

export default ChatSidebar;
