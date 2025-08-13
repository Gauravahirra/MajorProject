import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Backdrop,
  useTheme,
  alpha,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Grade as GradeIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  FamilyRestroom as ParentIcon,
  TrendingUp as TrendingIcon,
  CalendarToday as CalendarIcon,
  Settings as SettingsIcon,
  Assessment as AssessmentIcon,
  VideoCall as VideoCallIcon,
  Forum as ForumIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  // Unique icons for different functions
  PersonAdd as PersonAddIcon,
  GroupAdd as GroupAddIcon,
  PersonAddAlt as PersonAddAltIcon,
  Link as LinkIcon,
  EventNote as EventNoteIcon,
  VideoLibrary as VideoLibraryIcon,
  Security as SecurityIcon,
  Quiz as QuizIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../utils/auth';
import { useResponsive } from '../../utils/responsive';

const drawerWidth = 280;
const collapsedDrawerWidth = 70;

// Role-specific menu configurations with unique icons
const roleMenus = {
  ADMIN: {
    title: 'Admin Panel',
    icon: AdminIcon,
    color: '#d32f2f',
    sections: [
      {
        title: 'Dashboard',
        items: [
          { text: 'Overview', icon: DashboardIcon, path: '/admin/dashboard' },
          { text: 'Summary', icon: TrendingIcon, path: '/admin/summary' },
        ]
      },
      {
        title: 'User Management',
        items: [
          { text: 'Add Student', icon: PersonAddIcon, path: '/admin/add-student' },
          { text: 'Add Teacher', icon: GroupAddIcon, path: '/admin/add-teacher' },
          { text: 'Assign Teacher', icon: LinkIcon, path: '/admin/assign-teacher' },
        ]
      },
      {
        title: 'Academic',
        items: [
          { text: 'Academic Calendar', icon: EventNoteIcon, path: '/admin/academic-calendar' },
          { text: 'Online Classes', icon: VideoLibraryIcon, path: '/admin/online-classes' },
          { text: 'Session Management', icon: SecurityIcon, path: '/admin/session-management' },
        ]
      },
      {
        title: 'System',
        items: [
          { text: 'Reset Password', icon: SecurityIcon, path: '/admin/reset-password' },
        ]
      }
    ]
  },
  STUDENT: {
    title: 'Student Portal',
    icon: SchoolIcon,
    color: '#1976d2',
    sections: [
      {
        title: 'Dashboard',
        items: [
          { text: 'Overview', icon: DashboardIcon, path: '/student/dashboard' },
        ]
      },
      {
        title: 'Academic',
        items: [
          { text: 'Assignments', icon: AssignmentIcon, path: '/student/assignments' },
          { text: 'Exams', icon: QuizIcon, path: '/student/exams' },
          { text: 'Grades', icon: GradeIcon, path: '/student/grades' },
          { text: 'Attendance', icon: CheckCircleIcon, path: '/student/attendance' },
        ]
      },
      {
        title: 'Resources',
        items: [
          { text: 'Online Classes', icon: VideoCallIcon, path: '/student/online-classes' },
          { text: 'Calendar', icon: CalendarIcon, path: '/student/calendar' },
          { text: 'Forum', icon: ForumIcon, path: '/student/forum' },
        ]
      },
      {
        title: 'Requests',
        items: [
          { text: 'Leave Requests', icon: PendingIcon, path: '/student/leave-requests' },
        ]
      }
    ]
  },
  TEACHER: {
    title: 'Teacher Portal',
    icon: PersonIcon,
    color: '#388e3c',
    sections: [
      {
        title: 'Dashboard',
        items: [
          { text: 'Overview', icon: DashboardIcon, path: '/teacher/dashboard' },
        ]
      },
      {
        title: 'Teaching',
        items: [
          { text: 'Assignments', icon: AssignmentIcon, path: '/teacher/assignments' },
          { text: 'Exams', icon: QuizIcon, path: '/teacher/exams' },
          { text: 'Grades', icon: GradeIcon, path: '/teacher/grades' },
          { text: 'Attendance', icon: CheckCircleIcon, path: '/teacher/attendance' },
        ]
      },
      {
        title: 'Resources',
        items: [
          { text: 'Online Classes', icon: VideoCallIcon, path: '/teacher/online-classes' },
          { text: 'Calendar', icon: CalendarIcon, path: '/teacher/calendar' },
        ]
      },
      {
        title: 'Management',
        items: [
          { text: 'Leave Requests', icon: PendingIcon, path: '/teacher/leave-requests' },
        ]
      }
    ]
  },
  PARENT: {
    title: 'Parent Portal',
    icon: ParentIcon,
    color: '#f57c00',
    sections: [
      {
        title: 'Dashboard',
        items: [
          { text: 'Overview', icon: DashboardIcon, path: '/parent/dashboard' },
        ]
      },
      {
        title: 'Child Progress',
        items: [
          { text: 'Progress Tracking', icon: TrendingIcon, path: '/parent/child-progress' },
          { text: 'Calendar', icon: CalendarIcon, path: '/parent/calendar' },
        ]
      },
      {
        title: 'Management',
        items: [
          { text: 'Leave Approvals', icon: CheckCircleIcon, path: '/parent/leave-approvals' },
        ]
      }
    ]
  }
};

const UnifiedNavigation = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isMobile } = useResponsive();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem('unifiedNavCollapsed');
    return stored === 'true';
  });
  const [hoverExpanded, setHoverExpanded] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const currentRole = user?.role || 'STUDENT';
  const roleConfig = roleMenus[currentRole] || roleMenus.STUDENT;
  const effectiveCollapsed = collapsed && !hoverExpanded;

  // Handle sidebar collapse
  const handleCollapse = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    localStorage.setItem('unifiedNavCollapsed', newCollapsed.toString());
  };

  // Handle sidebar hover
  const handleSidebarMouseEnter = () => {
    if (collapsed && !isMobile) {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        setHoverTimeout(null);
      }
      setHoverExpanded(true);
    }
  };

  const handleSidebarMouseLeave = () => {
    if (collapsed && !isMobile) {
      const timeout = setTimeout(() => {
        setHoverExpanded(false);
      }, 300);
      setHoverTimeout(timeout);
    }
  };

  // Handle mobile drawer toggle
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Handle user menu
  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    handleUserMenuClose();
  };

  // Check if item is active
  const isActiveItem = (path) => {
    return location.pathname === path;
  };

  // Fetch notifications
  useEffect(() => {
    if (user) {
      fetch('/api/notifications/user')
        .then(res => res.json())
        .then(data => setNotifications(data.filter(n => !n.read)))
        .catch(err => console.error('Failed to fetch notifications:', err));
    }
  }, [user]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  // Drawer content
  const drawerContent = (
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: hoverExpanded && collapsed ? alpha(roleConfig.color, 0.02) : 'transparent',
        transition: 'background-color 0.2s ease-in-out',
        cursor: 'default'
      }}
      onMouseEnter={handleSidebarMouseEnter}
      onMouseLeave={handleSidebarMouseLeave}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: effectiveCollapsed ? 'center' : 'flex-start',
          p: effectiveCollapsed ? 1 : 2,
          minHeight: 64,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          backgroundColor: alpha(roleConfig.color, 0.08),
          borderLeft: `4px solid ${roleConfig.color}`,
          position: 'relative',
          zIndex: 1000,
          width: '100%'
        }}
      >
        {/* Expand Button - Only visible when collapsed */}
        {effectiveCollapsed && (
          <IconButton
            onClick={handleCollapse}
            sx={{
              color: roleConfig.color,
              backgroundColor: alpha(roleConfig.color, 0.1),
              border: `1px solid ${alpha(roleConfig.color, 0.2)}`,
              '&:hover': {
                backgroundColor: alpha(roleConfig.color, 0.2),
                borderColor: roleConfig.color,
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease-in-out',
              width: 28,
              height: 28,
              minWidth: 28,
              minHeight: 28,
            }}
            title="Expand Sidebar"
          >
            <ChevronRightIcon sx={{ fontSize: 16 }} />
          </IconButton>
        )}

        {/* User info when expanded */}
        {!effectiveCollapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flex: 1 }}>
            <Box sx={{ minWidth: 0, flex: 1, maxWidth: '100%' }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: roleConfig.color,
                  fontSize: '1rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  mb: 0.5,
                  lineHeight: 1.2
                }}
              >
                {roleConfig.title}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'block',
                  lineHeight: 1.2
                }}
              >
                {user?.name || user?.email}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <List sx={{ p: 0 }}>
          {roleConfig.sections && roleConfig.sections.map((section, sectionIndex) => (
            <React.Fragment key={section.title}>
              {sectionIndex > 0 && <Divider sx={{ my: 1 }} />}
              
              {/* Section Header */}
              {!effectiveCollapsed && (
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={section.title}
                    primaryTypographyProps={{
                      variant: 'caption',
                      sx: {
                        fontWeight: 600,
                        color: 'text.secondary',
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                </ListItem>
              )}

              {/* Section Items */}
              {section.items.map((item) => {
                const isActive = isActiveItem(item.path);
                const IconComponent = item.icon;

                const menuItem = (
                  <ListItem key={item.text} disablePadding>
                    <ListItemButton
                      onClick={() => handleNavigation(item.path)}
                      sx={{
                        minHeight: 48,
                        px: effectiveCollapsed ? 1.5 : 2,
                        py: 1,
                        mx: effectiveCollapsed ? 0.5 : 1,
                        borderRadius: 1,
                        backgroundColor: isActive ? alpha(roleConfig.color, 0.1) : 'transparent',
                        color: isActive ? roleConfig.color : 'text.primary',
                        cursor: 'pointer',
                        width: '100%',
                        '&:hover': {
                          backgroundColor: isActive 
                            ? alpha(roleConfig.color, 0.15) 
                            : alpha(theme.palette.action.hover, 0.1),
                          transform: 'translateX(2px)',
                        },
                        '& .MuiListItemIcon-root': {
                          color: isActive ? roleConfig.color : 'text.secondary',
                        },
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: effectiveCollapsed ? 0 : 40,
                          mr: effectiveCollapsed ? 0 : 1,
                          display: 'flex',
                          justifyContent: effectiveCollapsed ? 'center' : 'flex-start',
                          alignItems: 'center'
                        }}
                      >
                        <IconComponent fontSize="small" />
                      </ListItemIcon>
                      
                      {!effectiveCollapsed && (
                        <ListItemText
                          primary={item.text}
                          primaryTypographyProps={{
                            variant: 'body2',
                            sx: {
                              fontWeight: isActive ? 600 : 400,
                              fontSize: '0.875rem'
                            }
                          }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                );

                return effectiveCollapsed ? (
                  <Tooltip 
                    key={item.text}
                    title={item.text} 
                    placement="right"
                    arrow
                    enterDelay={300}
                    leaveDelay={0}
                  >
                    {menuItem}
                  </Tooltip>
                ) : menuItem;
              })}
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        {effectiveCollapsed ? (
          <Tooltip title="Logout" placement="right" arrow>
                      <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 1,
              color: 'error.main',
              cursor: 'pointer',
              justifyContent: 'center',
              width: '100%',
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.1),
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
              <ListItemIcon sx={{ color: 'error.main', minWidth: 0 }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
            </ListItemButton>
          </Tooltip>
        ) : (
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 1,
              color: 'error.main',
              cursor: 'pointer',
              width: '100%',
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.1),
                transform: 'translateX(2px)',
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <ListItemIcon sx={{ color: 'error.main', minWidth: 40 }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                variant: 'body2',
                sx: { fontWeight: 500 }
              }}
            />
          </ListItemButton>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: '100%',
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderBottom: `2px solid ${alpha(roleConfig.color, 0.1)}`,
          zIndex: theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Left Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Role Title - Only show on mobile or when sidebar is collapsed */}
            {(isMobile || effectiveCollapsed) && (
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                minWidth: 0,
                flexShrink: 0
              }}>
                <roleConfig.icon 
                  sx={{ 
                    color: roleConfig.color,
                    fontSize: { xs: 24, sm: 28 },
                    mr: 1
                  }} 
                />
                <Typography
                  variant={isMobile ? 'h6' : 'h5'}
                  component="div"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                    color: roleConfig.color,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {roleConfig.title}
                </Typography>
              </Box>
            )}

            {/* Empty space when sidebar is expanded on desktop */}
            {!isMobile && !effectiveCollapsed && (
              <Box sx={{ flexGrow: 1 }} />
            )}
          </Box>

          {/* Right Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton
                sx={{ 
                  position: 'relative',
                  color: 'text.secondary',
                  '&:hover': {
                    color: roleConfig.color,
                    backgroundColor: alpha(roleConfig.color, 0.1),
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* User Menu */}
            <Tooltip title="User Menu">
              <IconButton
                onClick={handleUserMenuOpen}
                sx={{
                  p: 0.5,
                  border: `2px solid ${alpha(roleConfig.color, 0.3)}`,
                  backgroundColor: alpha(roleConfig.color, 0.05),
                  '&:hover': {
                    borderColor: roleConfig.color,
                    backgroundColor: alpha(roleConfig.color, 0.1),
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: roleConfig.color,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    boxShadow: `0 2px 8px ${alpha(roleConfig.color, 0.3)}`
                  }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { md: effectiveCollapsed ? collapsedDrawerWidth : drawerWidth },
          flexShrink: { md: 0 },
          position: 'fixed',
          top: 64, // Height of AppBar
          left: 0,
          height: 'calc(100vh - 64px)',
          zIndex: 1000,
          overflow: 'hidden'
        }}
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
      >
        {/* Mobile Drawer */}
        {isMobile && (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                backgroundColor: 'background.paper',
                borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              },
            }}
          >
            {drawerContent}
          </Drawer>
        )}

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: effectiveCollapsed ? collapsedDrawerWidth : drawerWidth,
              backgroundColor: 'background.paper',
              borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              transition: theme.transitions.create(['width'], {
                duration: theme.transitions.duration.standard,
              }),
              overflow: 'hidden',
              position: 'fixed',
              top: 64,
              left: 0,
              height: 'calc(100vh - 64px)',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { md: `${effectiveCollapsed ? collapsedDrawerWidth : drawerWidth}px` },
          transition: theme.transitions.create(['margin-left'], {
            duration: theme.transitions.duration.standard,
          }),
          width: { md: `calc(100% - ${effectiveCollapsed ? collapsedDrawerWidth : drawerWidth}px)` },
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Box sx={{ p: 3, minHeight: 'calc(100vh - 64px)', width: '100%' }}>
          {children}
        </Box>
      </Box>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleUserMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            borderRadius: 2,
          }
        }}
      >
        <MenuItem onClick={handleUserMenuClose}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleUserMenuClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Mobile Backdrop */}
      {isMobile && mobileOpen && (
        <Backdrop
          sx={{
            zIndex: theme.zIndex.drawer - 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}
          open={mobileOpen}
          onClick={handleDrawerToggle}
        />
      )}

      {/* Floating Collapse Button - Fixed positioning */}
      <Box
        sx={{
          position: 'fixed',
          left: effectiveCollapsed ? collapsedDrawerWidth + 5 : drawerWidth + 5,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: theme.zIndex.drawer + 1,
          display: { xs: 'none', md: 'block' },
          transition: theme.transitions.create(['left'], {
            duration: theme.transitions.duration.standard,
          }),
          pointerEvents: 'auto',
        }}
      >
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: '50%',
            padding: '6px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
            border: `3px solid ${roleConfig.color}`,
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(1)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                borderColor: roleConfig.color,
              },
              '50%': {
                transform: 'scale(1.1)',
                boxShadow: `0 8px 25px ${alpha(roleConfig.color, 0.7)}`,
                borderColor: roleConfig.color,
              },
              '100%': {
                transform: 'scale(1)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                borderColor: roleConfig.color,
              },
            },
          }}
        >
          <IconButton
            onClick={handleCollapse}
            sx={{
              color: 'white',
              backgroundColor: roleConfig.color,
              border: `2px solid white`,
              '&:hover': {
                backgroundColor: roleConfig.color,
                color: 'white',
                transform: 'scale(1.15)',
                boxShadow: `0 8px 20px ${alpha(roleConfig.color, 0.8)}`,
              },
              transition: 'all 0.3s ease-in-out',
              width: 40,
              height: 40,
              minWidth: 40,
              minHeight: 40,
              cursor: 'pointer',
              boxShadow: `0 4px 15px ${alpha(roleConfig.color, 0.6)}`,
              fontWeight: 'bold',
            }}
            title={effectiveCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {effectiveCollapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default UnifiedNavigation;
