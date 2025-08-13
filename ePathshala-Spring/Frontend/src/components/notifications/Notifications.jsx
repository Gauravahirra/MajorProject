import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Button,
  Paper,
  Divider,
  IconButton,
  Badge,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Announcement as AnnouncementIcon,
  Forum as ForumIcon,
  Chat as ChatIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Computer as ComputerIcon,
  CheckCircle as CheckCircleIcon,
  Clear as ClearIcon,
  Add as AddIcon,
  PriorityHigh as PriorityHighIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useAuth } from '../../utils/auth';
import { apiCall, get, post } from '../../utils/api';

function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  
  // Dialog states
  const [createAnnouncementDialog, setCreateAnnouncementDialog] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    targetRole: 'ALL'
  });

  useEffect(() => {
    loadNotifications();
    loadAnnouncements();
    loadUnreadCount();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await apiCall('/api/notifications/user');
      setNotifications(data.content || []);
    } catch (error) {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const loadAnnouncements = async () => {
    try {
      const data = await apiCall('/api/notifications/announcements');
      setAnnouncements(data);
    } catch (error) {
      setError('Failed to load announcements');
    }
  };

  const loadUnreadCount = async () => {
    try {
      const data = await apiCall('/api/notifications/user/unread/count');
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await post(`/api/notifications/mark-read/${notificationId}`);
      loadNotifications();
      loadUnreadCount();
    } catch (error) {
      setError('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await post('/api/notifications/mark-all-read');
      loadNotifications();
      loadUnreadCount();
    } catch (error) {
      setError('Failed to mark all notifications as read');
    }
  };

  const createAnnouncement = async () => {
    try {
      await post('/api/notifications/announcements', newAnnouncement);
      setCreateAnnouncementDialog(false);
      setNewAnnouncement({ title: '', content: '', targetRole: 'ALL' });
      loadAnnouncements();
    } catch (error) {
      setError('Failed to create announcement');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ANNOUNCEMENT': return <AnnouncementIcon />;
      case 'FORUM_THREAD': return <ForumIcon />;
      case 'FORUM_REPLY': return <ForumIcon />;
      case 'CHAT_MENTION': return <ChatIcon />;
      default: return <NotificationsIcon />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENT': return 'error';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'info';
      case 'LOW': return 'default';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'URGENT': return <PriorityHighIcon />;
      case 'HIGH': return <InfoIcon />;
      default: return <InfoIcon />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading notifications...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Notifications & Announcements
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
          {(user.role === 'ADMIN' || user.role === 'TEACHER') && (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setCreateAnnouncementDialog(true)}
            >
              Create Announcement
            </Button>
          )}
          <Button
            variant="outlined"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark All as Read
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="All Notifications" />
          <Tab label="Announcements" />
          <Tab label="Unread" />
        </Tabs>
      </Paper>

      {/* Notifications List */}
      {activeTab === 0 && (
        <List>
          {notifications.map((notification) => (
            <Card key={notification.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{notification.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {notification.senderName} • {formatDate(notification.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      size="small"
                      icon={getPriorityIcon(notification.priority)}
                      label={notification.priority}
                      color={getPriorityColor(notification.priority)}
                      variant="outlined"
                    />
                    {!notification.isRead && (
                      <Chip
                        size="small"
                        label="New"
                        color="error"
                      />
                    )}
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {notification.content}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => window.open(notification.actionUrl, '_blank')}
                  >
                    {notification.actionText}
                  </Button>
                  {!notification.isRead && (
                    <IconButton
                      size="small"
                      onClick={() => markAsRead(notification.id)}
                      color="primary"
                    >
                      <CheckCircleIcon />
                    </IconButton>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </List>
      )}

      {/* Announcements */}
      {activeTab === 1 && (
        <List>
          {announcements.map((announcement) => (
            <Card key={announcement.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: 'warning.main', mr: 1 }}>
                    <AnnouncementIcon />
                  </Avatar>
                  <Typography variant="h6">{announcement.title}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {formatDate(announcement.createdAt)}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {announcement.content}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    size="small"
                    label="Global"
                    color="warning"
                    variant="outlined"
                  />
                  <Chip
                    size="small"
                    label={announcement.targetRole}
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </List>
      )}

      {/* Unread Notifications */}
      {activeTab === 2 && (
        <List>
          {notifications.filter(n => !n.isRead).map((notification) => (
            <Card key={notification.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: 'error.main', mr: 1 }}>
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{notification.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {notification.senderName} • {formatDate(notification.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => markAsRead(notification.id)}
                    color="primary"
                  >
                    <CheckCircleIcon />
                  </IconButton>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {notification.content}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => window.open(notification.actionUrl, '_blank')}
                >
                  {notification.actionText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </List>
      )}

      {/* Create Announcement Dialog */}
      <Dialog open={createAnnouncementDialog} onClose={() => setCreateAnnouncementDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Global Announcement</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={newAnnouncement.title}
            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Target Role</InputLabel>
            <Select
              value={newAnnouncement.targetRole}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, targetRole: e.target.value })}
              label="Target Role"
            >
              <MenuItem value="ALL">All Users</MenuItem>
              <MenuItem value="ADMIN">Admins Only</MenuItem>
              <MenuItem value="TEACHER">Teachers Only</MenuItem>
              <MenuItem value="STUDENT">Students Only</MenuItem>
              <MenuItem value="PARENT">Parents Only</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Content"
            multiline
            rows={6}
            value={newAnnouncement.content}
            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateAnnouncementDialog(false)}>Cancel</Button>
          <Button
            onClick={createAnnouncement}
            variant="contained"
            disabled={!newAnnouncement.title || !newAnnouncement.content}
          >
            Create Announcement
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Notifications; 