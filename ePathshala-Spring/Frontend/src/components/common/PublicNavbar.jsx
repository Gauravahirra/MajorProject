import React, { useState } from "react";
import { useAuth } from "../../utils/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  useTheme,
  useMediaQuery,
  Badge,
  Popover,
  Drawer,
  List as MUIList,
  ListItem as MUIListItem,
  ListItemText as MUIListItemText,
  Tooltip,
  Divider,
  alpha,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  SmartToy as BotIcon,
  Quiz as QuizIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Login as LoginIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  ContactSupport as ContactIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import Chatbot from './Chatbot';
import Logo from './Logo';
import {
  fetchUserNotifications,
  fetchUnreadNotificationCount,
  markAllNotificationsAsRead
} from '../../api/notifications';

const ROLE_COLORS = {
  ADMIN: '#d32f2f',
  STUDENT: '#1976d2',
  TEACHER: '#388e3c',
  PARENT: '#fbc02d',
};

const ROLE_ICONS = {
  ADMIN: <PersonIcon />,
  STUDENT: <QuizIcon />,
  TEACHER: <PersonIcon />,
  PARENT: <PersonIcon />,
};

const PUBLIC_LINKS = [
  { label: 'Home', path: '/', icon: <HomeIcon /> },
  { label: 'About Us', path: '/about', icon: <InfoIcon />, highlight: true },
  { label: 'Contact Us', path: '/contact', icon: <ContactIcon />, highlight: true },
];

const COMMON_LINKS = [
  { label: 'About Us', path: '/about', icon: <InfoIcon fontSize="small" /> },
  { label: 'Contact Us', path: '/contact', icon: <ContactIcon fontSize="small" /> },
];

function PublicNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifError, setNotifError] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Load notifications when user is authenticated
  React.useEffect(() => {
    if (user && user.role && ['ADMIN', 'STUDENT', 'TEACHER', 'PARENT'].includes(user.role)) {
      loadNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user || !user.role || !['ADMIN', 'STUDENT', 'TEACHER', 'PARENT'].includes(user.role)) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      setNotifLoading(true);
      const [notifData, countData] = await Promise.all([
        fetchUserNotifications(),
        fetchUnreadNotificationCount()
      ]);
      
      if (notifData.success) {
        setNotifications(notifData.data || []);
      }
      
      if (countData.success) {
        setUnreadCount(countData.data || 0);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifError('Failed to load notifications');
    } finally {
      setNotifLoading(false);
    }
  };

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => { 
    logout();
    setAnchorEl(null);
    navigate('/');
  };

  const handleProfile = () => { 
    setAnchorEl(null);
    if (user?.role) {
      navigate(`/${user.role.toLowerCase()}/profile`);
    }
  };

  const handleChatbotOpen = () => setIsChatbotOpen(true);
  const handleChatbotClose = () => setIsChatbotOpen(false);

  const handleNotifOpen = async (event) => { 
    setNotifAnchorEl(event.currentTarget);
    if (unreadCount > 0) {
      try {
        await markAllNotificationsAsRead();
        setUnreadCount(0);
      } catch (error) {
        console.error('Error marking notifications as read:', error);
      }
    }
  };

  const handleNotifClose = async () => { 
    setNotifAnchorEl(null);
  };

  const handleDrawerToggle = () => setDrawerOpen((prev) => !prev);

  const roleColor = user?.role ? ROLE_COLORS[user.role] : theme.palette.primary.main;
  const roleIcon = user?.role ? ROLE_ICONS[user.role] : <PersonIcon />;

  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`,
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          zIndex: theme.zIndex.appBar,
          left: 0,
          width: '100%',
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar sx={{
          height: { xs: '64px', sm: '72px' },
          minHeight: { xs: '64px', sm: '72px' },
          px: { xs: 2, sm: 3, md: 4 },
          py: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: { xs: 2, sm: 3 },
          maxWidth: '1400px',
          mx: 'auto',
          width: '100%',
        }}>
          {/* Logo Section */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            flexShrink: 0,
          }}>
            <Logo 
              variant="minimal"
              size={isMobile ? 'small' : 'medium'}
              sx={{ 
                color: theme.palette.primary.main,
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                fontWeight: 700,
                letterSpacing: 0.5,
                textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                }
              }}
            />
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              ml: 'auto',
            }}>
              {/* Public Links - Always visible on public pages */}
              <Box sx={{ display: 'flex', gap: 1, mr: 3 }}>
                {PUBLIC_LINKS.map(link => (
                  <Button
                    key={link.label}
                    color="inherit"
                    component={Link}
                    to={link.path}
                    startIcon={link.icon}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      px: 2.5,
                      py: 1.25,
                      borderRadius: 2,
                      fontWeight: 600,
                      color: link.highlight ? theme.palette.primary.main : theme.palette.text.primary,
                      backgroundColor: link.highlight ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                      border: link.highlight ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}` : 'none',
                      transition: 'all 0.2s ease',
                      '&:hover': { 
                        backgroundColor: alpha(theme.palette.primary.main, 0.15),
                        transform: 'translateY(-1px)',
                        color: theme.palette.primary.main,
                        borderColor: theme.palette.primary.main,
                      },
                      '&:active': {
                        transform: 'translateY(0px)',
                      },
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
              </Box>

              {/* User Actions */}
              {user ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {/* Common Links for Authenticated Users */}
                  <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
                    {COMMON_LINKS.map(link => (
                      <Button
                        key={link.label}
                        color="inherit"
                        component={Link}
                        to={link.path}
                        startIcon={link.icon}
                        sx={{
                          textTransform: 'none',
                          fontSize: '0.85rem',
                          px: 1.5,
                          py: 0.75,
                          borderRadius: 2,
                          fontWeight: 500,
                          transition: 'all 0.2s ease',
                          '&:hover': { 
                            backgroundColor: alpha(theme.palette.primary.main, 0.08),
                            transform: 'translateY(-1px)',
                          },
                        }}
                      >
                        {link.label}
                      </Button>
                    ))}
                  </Box>

                  {/* Notifications */}
                  {['ADMIN', 'STUDENT', 'TEACHER', 'PARENT'].includes(user.role) && (
                    <Tooltip title="Notifications">
                      <IconButton
                        color="inherit"
                        onClick={handleNotifOpen}
                        sx={{ 
                          p: 1,
                          transition: 'all 0.2s ease',
                          '&:hover': { 
                            backgroundColor: alpha(theme.palette.primary.main, 0.08),
                            transform: 'scale(1.05)',
                          } 
                        }}
                      >
                        <Badge badgeContent={unreadCount} color="error" max={99}>
                          <NotificationsIcon />
                        </Badge>
                      </IconButton>
                    </Tooltip>
                  )}

                  {/* Chatbot */}
                  <Tooltip title="AI Assistant">
                    <IconButton
                      color="inherit"
                      onClick={handleChatbotOpen}
                      sx={{ 
                        p: 1,
                        transition: 'all 0.2s ease',
                        '&:hover': { 
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                          transform: 'scale(1.05)',
                        } 
                      }}
                    >
                      <BotIcon />
                    </IconButton>
                  </Tooltip>

                  {/* User Menu */}
                  <Tooltip title="User Menu">
                    <IconButton
                      onClick={handleMenu}
                      sx={{ 
                        p: 1,
                        transition: 'all 0.2s ease',
                        '&:hover': { 
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                          transform: 'scale(1.05)',
                        } 
                      }}
                    >
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32,
                          bgcolor: roleColor,
                          fontSize: '0.875rem',
                          fontWeight: 600,
                        }}
                      >
                        {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                </Box>
              ) : (
                /* Sign In Button */
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  startIcon={<LoginIcon />}
                  sx={{
                    textTransform: 'none',
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: 600,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  Sign In
                </Button>
              )}
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={handleDrawerToggle}
              sx={{ 
                ml: 'auto',
                p: 1,
                transition: 'all 0.2s ease',
                '&:hover': { 
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  transform: 'scale(1.05)',
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Notifications Popover */}
      <Popover
        open={Boolean(notifAnchorEl)}
        anchorEl={notifAnchorEl}
        onClose={handleNotifClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ 
          sx: { 
            width: 320,
            maxHeight: 400,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          } 
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Notifications
            </Typography>
            <IconButton size="small" onClick={handleNotifClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {notifError && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {notifError}
            </Typography>
          )}
          {notifLoading ? (
            <Typography variant="body2" color="text.secondary">
              Loading notifications...
            </Typography>
          ) : (
            <MUIList dense sx={{ p: 0 }}>
              {notifications.length === 0 && !notifError && (
                <MUIListItem>
                  <MUIListItemText 
                    primary="No notifications" 
                    sx={{ textAlign: 'center', color: 'text.secondary' }}
                  />
                </MUIListItem>
              )}
              {notifications.map((notif) => (
                <MUIListItem 
                  key={notif.id} 
                  sx={{ 
                    borderRadius: 1,
                    mb: 0.5,
                    backgroundColor: !notif.read ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                  }}
                >
                  <MUIListItemText 
                    primary={notif.text || notif.content || notif.title}
                    secondary={new Date(notif.createdAt).toLocaleDateString()}
                    primaryTypographyProps={{ fontSize: '0.875rem' }}
                    secondaryTypographyProps={{ fontSize: '0.75rem' }}
                  />
                </MUIListItem>
              ))}
            </MUIList>
          )}
        </Box>
      </Popover>

      {/* User Menu */}
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ 
          sx: { 
            borderRadius: 2, 
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            minWidth: 200,
          } 
        }}
      >
        <Box sx={{ p: 1 }}>
          <MenuItem onClick={handleProfile} sx={{ borderRadius: 1, mb: 0.5 }}>
            <PersonIcon sx={{ mr: 2, color: 'text.secondary' }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Profile
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Manage your account
              </Typography>
            </Box>
            <Chip
              label={user?.role}
              size="small"
              sx={{ 
                bgcolor: roleColor, 
                color: 'white', 
                fontWeight: 600,
                fontSize: '0.625rem',
              }}
            />
          </MenuItem>
          <Divider sx={{ my: 1 }} />
          <MenuItem onClick={handleLogout} sx={{ borderRadius: 1 }}>
            <LogoutIcon sx={{ mr: 2, color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Logout
            </Typography>
          </MenuItem>
        </Box>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{ 
          sx: { 
            width: 280,
            borderRadius: '16px 0 0 16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          } 
        }}
      >
        <Box sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Logo 
              variant="minimal"
              size="small"
              sx={{ 
                color: theme.palette.primary.main,
                fontSize: '1.25rem',
                fontWeight: 700,
              }}
            />
            <IconButton onClick={handleDrawerToggle} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Navigation Links */}
          <MUIList sx={{ p: 0 }}>
            {user ? (
              <>
                {/* User Info */}
                <Box sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar 
                      sx={{ 
                        width: 40, 
                        height: 40,
                        bgcolor: roleColor,
                        mr: 2,
                      }}
                    >
                      {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {user.name || user.email}
                      </Typography>
                      <Chip
                        label={user.role}
                        size="small"
                        sx={{ 
                          bgcolor: roleColor, 
                          color: 'white', 
                          fontWeight: 600,
                          fontSize: '0.625rem',
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Dashboard Links */}
                <MUIListItem 
                  button 
                  component={Link} 
                  to={`/${user.role?.toLowerCase()}/`} 
                  onClick={handleDrawerToggle}
                  sx={{ 
                    borderRadius: 1, 
                    mb: 0.5,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    }
                  }}
                >
                  <QuizIcon />
                  <MUIListItemText 
                    primary="Dashboard" 
                    sx={{ ml: 2 }}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </MUIListItem>

                <Divider sx={{ my: 2 }} />

                {/* Public Links */}
                {PUBLIC_LINKS.map(link => (
                  <MUIListItem 
                    button 
                    key={link.label} 
                    component={Link} 
                    to={link.path} 
                    onClick={handleDrawerToggle}
                    sx={{ 
                      borderRadius: 1, 
                      mb: 0.5,
                      py: 1.5,
                      backgroundColor: link.highlight ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                      border: link.highlight ? `1px solid ${alpha(theme.palette.primary.main, 0.15)}` : 'none',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.12),
                        transform: 'translateX(4px)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {link.icon}
                    <MUIListItemText 
                      primary={link.label} 
                      sx={{ ml: 2 }}
                      primaryTypographyProps={{ 
                        fontWeight: 600,
                        fontSize: '1rem',
                        color: link.highlight ? theme.palette.primary.main : 'inherit',
                      }}
                    />
                  </MUIListItem>
                ))}

                <Divider sx={{ my: 2 }} />

                {/* User Actions */}
                <MUIListItem 
                  button 
                  onClick={() => { handleProfile(); handleDrawerToggle(); }}
                  sx={{ 
                    borderRadius: 1, 
                    mb: 0.5,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    }
                  }}
                >
                  <PersonIcon sx={{ mr: 2, color: 'text.secondary' }} />
                  <MUIListItemText 
                    primary="Profile" 
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </MUIListItem>

                <MUIListItem 
                  button 
                  onClick={() => { handleLogout(); handleDrawerToggle(); }}
                  sx={{ 
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.error.main, 0.08),
                    }
                  }}
                >
                  <LogoutIcon sx={{ mr: 2, color: 'error.main' }} />
                  <MUIListItemText 
                    primary="Logout" 
                    primaryTypographyProps={{ fontWeight: 500, color: 'error.main' }}
                  />
                </MUIListItem>
              </>
            ) : (
              <>
                {/* Public Links */}
                {PUBLIC_LINKS.map(link => (
                  <MUIListItem 
                    button 
                    key={link.label} 
                    component={Link} 
                    to={link.path} 
                    onClick={handleDrawerToggle}
                    sx={{ 
                      borderRadius: 1, 
                      mb: 0.5,
                      py: 1.5,
                      backgroundColor: link.highlight ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                      border: link.highlight ? `1px solid ${alpha(theme.palette.primary.main, 0.15)}` : 'none',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.12),
                        transform: 'translateX(4px)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {link.icon}
                    <MUIListItemText 
                      primary={link.label} 
                      sx={{ ml: 2 }}
                      primaryTypographyProps={{ 
                        fontWeight: 600,
                        fontSize: '1rem',
                        color: link.highlight ? theme.palette.primary.main : 'inherit',
                      }}
                    />
                  </MUIListItem>
                ))}

                <Divider sx={{ my: 2 }} />

                {/* Sign In Button */}
                <MUIListItem 
                  button 
                  component={Link} 
                  to="/login" 
                  onClick={handleDrawerToggle}
                  sx={{ 
                    borderRadius: 1,
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark,
                    }
                  }}
                >
                  <LoginIcon sx={{ mr: 2 }} />
                  <MUIListItemText 
                    primary="Sign In" 
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </MUIListItem>
              </>
            )}
          </MUIList>
        </Box>
      </Drawer>
      
      {/* Chatbot */}
      <Chatbot open={isChatbotOpen} onClose={handleChatbotClose} />
    </>
  );
}

export default PublicNavbar;
