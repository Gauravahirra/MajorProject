import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Box,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
  Fade,
  Avatar,
  Chip
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Forum as ForumIcon,
  Chat as ChatIcon,
  Notifications as NotificationsIcon,
  Quiz as QuizIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
  ContactSupport as ContactIcon,
  Info as InfoIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  People as PeopleIcon,
  Book as BookIcon,
  Grade as GradeIcon,
  Event as EventIcon,
  VideoCall as VideoCallIcon,
  Assessment as AssessmentIcon,
  Security as SecurityIcon,
  Business as BusinessIcon,
  FamilyRestroom as FamilyIcon,
  TrendingUp as TrendingIcon,
  Schedule as ScheduleIcon,
  NotificationsActive as NotificationsActiveIcon,
  Message as MessageIcon,
  FileCopy as FileCopyIcon,
  History as HistoryIcon,
  Star as StarIcon,
  Help as HelpIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../utils/auth';
import { useResponsive, spacing, typography } from '../../utils/responsive';
import { alpha } from '@mui/material/styles';
import Logo from '../common/Logo';

const SIDEBAR_COLLAPSED_WIDTH = 60;
const SIDEBAR_EXPANDED_WIDTH = 280;

// Role-specific menu configurations
const roleMenus = {
  ADMIN: {
    title: 'Admin Panel',
    icon: AdminIcon,
    sections: [
      {
        title: 'Dashboard',
        items: [
          { text: 'Overview', icon: DashboardIcon, path: '/admin' },
          { text: 'Summary', icon: TrendingIcon, path: '/admin/summary' },
        ]
      },
      {
        title: 'User Management',
        items: [
          { text: 'Add Student', icon: SchoolIcon, path: '/admin/add-student' },
          { text: 'Add Teacher', icon: PersonIcon, path: '/admin/add-teacher' },
          { text: 'Assign Teacher', icon: AssignmentIcon, path: '/admin/assign-teacher' },
        ]
      },
      {
        title: 'System Management',
        items: [
          { text: 'Academic Calendar', icon: CalendarIcon, path: '/admin/calendar' },
          { text: 'Online Classes', icon: VideoCallIcon, path: '/admin/online-classes' },
          { text: 'Session Management', icon: SecurityIcon, path: '/admin/sessions' },
          { text: 'Reset Password', icon: SettingsIcon, path: '/admin/reset-password' },
        ]
      },
      {
        title: 'Communication',
        items: [
          { text: 'Forum', icon: ForumIcon, path: '/forum' },
          { text: 'Notifications', icon: NotificationsIcon, path: '/notifications' },
        ]
      }
    ]
  },
  STUDENT: {
    title: 'Student Portal',
    icon: SchoolIcon,
    sections: [
      {
        title: 'Dashboard',
        items: [
          { text: 'Overview', icon: DashboardIcon, path: '/student' },
          { text: 'My Progress', icon: TrendingIcon, path: '/student/progress' },
        ]
      },
      {
        title: 'Academic',
        items: [
          { text: 'Exams', icon: QuizIcon, path: '/student/exams' },
          { text: 'Assignments', icon: AssignmentIcon, path: '/student/assignments' },
          { text: 'Grades', icon: GradeIcon, path: '/student/grades' },
          { text: 'Attendance', icon: ScheduleIcon, path: '/student/attendance' },
        ]
      },
      {
        title: 'Resources',
        items: [
          { text: 'Calendar', icon: CalendarIcon, path: '/student/calendar' },
          { text: 'Online Classes', icon: VideoCallIcon, path: '/student/online-classes' },
          { text: 'Leave Requests', icon: EventIcon, path: '/student/leave-requests' },
        ]
      },
      {
        title: 'Communication',
        items: [
          { text: 'Forum', icon: ForumIcon, path: '/forum' },
          { text: 'Notifications', icon: NotificationsIcon, path: '/notifications' },
          { text: 'Chat', icon: ChatIcon, path: '/chat' },
        ]
      }
    ]
  },
  TEACHER: {
    title: 'Teacher Portal',
    icon: PersonIcon,
    sections: [
      {
        title: 'Dashboard',
        items: [
          { text: 'Overview', icon: DashboardIcon, path: '/teacher' },
          { text: 'My Classes', icon: SchoolIcon, path: '/teacher/classes' },
        ]
      },
      {
        title: 'Academic Management',
        items: [
          { text: 'Exams', icon: QuizIcon, path: '/teacher/exams' },
          { text: 'Assignments', icon: AssignmentIcon, path: '/teacher/assignments' },
          { text: 'Grades', icon: GradeIcon, path: '/teacher/grades' },
          { text: 'Attendance', icon: ScheduleIcon, path: '/teacher/attendance' },
        ]
      },
      {
        title: 'Teaching Tools',
        items: [
          { text: 'Online Classes', icon: VideoCallIcon, path: '/teacher/online-classes' },
          { text: 'Calendar', icon: CalendarIcon, path: '/teacher/calendar' },
          { text: 'Leave Approvals', icon: EventIcon, path: '/teacher/leave-approvals' },
        ]
      },
      {
        title: 'Communication',
        items: [
          { text: 'Forum', icon: ForumIcon, path: '/forum' },
          { text: 'Notifications', icon: NotificationsIcon, path: '/notifications' },
          { text: 'Chat', icon: ChatIcon, path: '/chat' },
        ]
      }
    ]
  },
  PARENT: {
    title: 'Parent Portal',
    icon: FamilyIcon,
    sections: [
      {
        title: 'Dashboard',
        items: [
          { text: 'Overview', icon: DashboardIcon, path: '/parent' },
          { text: 'Child Progress', icon: TrendingIcon, path: '/parent/child-progress' },
        ]
      },
      {
        title: 'Child Information',
        items: [
          { text: 'Academic Calendar', icon: CalendarIcon, path: '/parent/calendar' },
          { text: 'Leave Approvals', icon: EventIcon, path: '/parent/leave-approvals' },
          { text: 'Notifications', icon: NotificationsIcon, path: '/notifications' },
        ]
      },
      {
        title: 'Communication',
        items: [
          { text: 'Forum', icon: ForumIcon, path: '/forum' },
          { text: 'Chat', icon: ChatIcon, path: '/chat' },
        ]
      }
    ]
  }
};

// Common menu items for all roles
const commonMenuItems = [
  { text: 'Home', icon: HomeIcon, path: '/home' },
  { text: 'About Us', icon: InfoIcon, path: '/about' },
  { text: 'Contact Us', icon: ContactIcon, path: '/contact' },
];

// Help section with chatbot
const helpSection = {
  title: 'Help & Support',
  items: [
    { text: 'Help Center', icon: HelpIcon, path: '/help' },
    { text: 'AI Chatbot', icon: ChatIcon, path: '/chatbot' },
  ]
};

function Sidebar({ open, onClose, collapsed, onCollapse, isMobile }) {
  const theme = useTheme();
  const responsive = useResponsive();
  const isMobileDevice = isMobile || responsive.isMobile;
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [expanded, setExpanded] = useState({});

  // Get role-specific menu configuration
  const getRoleMenu = () => {
    if (!user?.role) return null;
    return roleMenus[user.role] || roleMenus.ADMIN;
  };

  const roleMenu = getRoleMenu();

  // Initialize expanded state for all sections
  useEffect(() => {
    if (roleMenu) {
      const initialExpanded = {};
      roleMenu.sections.forEach(section => {
        initialExpanded[section.title] = true;
      });
      setExpanded(initialExpanded);
    }
  }, [roleMenu]);

  const handleDrawerClose = () => {
    if (isMobileDevice) {
      onClose?.();
    }
  };

  const handleItemClick = (path) => {
    navigate(path);
    // Only close drawer on mobile, don't change collapsed state
    if (isMobileDevice) {
      handleDrawerClose();
    }
  };

  const handleExpandClick = (section) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleLogout = () => {
    logout();
    handleDrawerClose();
  };

  const renderMenuItem = (item, index, isCollapsed) => {
    const isActive = location.pathname === item.path;
    
    const menuItem = (
      <ListItem
        key={item.text}
        disablePadding
        sx={{
          mb: { xs: 0.5, sm: 1 },
          mx: isCollapsed ? 0.5 : { xs: 0.5, sm: 1 },
          borderRadius: { xs: 1, sm: 2 },
          overflow: 'hidden',
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
          },
        }}
      >
        <ListItemButton
          onClick={() => handleItemClick(item.path)}
          sx={{
            minHeight: isCollapsed ? 48 : { xs: 48, sm: 56 },
            px: isCollapsed ? 1 : { xs: 1, sm: 2 },
            py: isCollapsed ? 1.5 : 1,
            borderRadius: { xs: 1, sm: 2 },
            backgroundColor: isActive ? 'primary.main' : 'transparent',
            color: isActive ? 'primary.contrastText' : 'inherit',
            '&:hover': {
              backgroundColor: isActive ? 'primary.dark' : alpha(theme.palette.primary.main, 0.12),
              transform: isCollapsed ? 'scale(1.05)' : 'none',
            },
            transition: 'all 0.2s ease-in-out',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            position: 'relative',
            // Add visual indicator when collapsed and active
            '&::after': isCollapsed && isActive ? {
              content: '""',
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 3,
              height: '60%',
              backgroundColor: 'primary.contrastText',
              borderRadius: '2px 0 0 2px'
            } : {},
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: isCollapsed ? 'auto' : { xs: 36, sm: 40 },
              mr: isCollapsed ? 0 : 1,
              color: isActive ? 'primary.contrastText' : 'text.primary',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '& .MuiSvgIcon-root': {
                fontSize: isCollapsed ? 20 : { xs: 20, sm: 24 },
                transition: 'all 0.2s ease-in-out',
              },
            }}
          >
            <item.icon />
          </ListItemIcon>
          {!isCollapsed && (
            <ListItemText
              primary={item.text}
              sx={{
                '& .MuiTypography-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'primary.contrastText' : 'text.primary',
                },
              }}
            />
          )}
        </ListItemButton>
      </ListItem>
    );

    return isCollapsed ? (
      <Tooltip 
        title={item.text} 
        placement="right" 
        key={item.text}
        arrow
        enterDelay={300}
        leaveDelay={100}
        slotProps={{
          tooltip: {
            sx: {
              bgcolor: 'grey.800',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: 500,
              '& .MuiTooltip-arrow': {
                color: 'grey.800',
              },
            },
          },
        }}
      >
        {menuItem}
      </Tooltip>
    ) : menuItem;
  };

  const renderSection = (section, isCollapsed) => (
    <Box key={section.title}>
      {!isCollapsed && (
        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            py: { xs: 1, sm: 1.5 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            borderRadius: 1,
            mx: 1,
            '&:hover': {
              backgroundColor: alpha(theme.palette.action.hover, 0.5),
            },
            transition: 'background-color 0.2s ease-in-out'
          }}
          onClick={() => handleExpandClick(section.title)}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              fontWeight: 600,
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            {section.title}
          </Typography>
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            {expanded[section.title] ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
      )}
      
      {/* Show divider when collapsed */}
      {isCollapsed && (
        <Divider sx={{ my: 1, mx: 1 }} />
      )}
      
      <Collapse in={!isCollapsed || expanded[section.title]} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ py: isCollapsed ? 1 : 0 }}>
          {section.items.map((item, index) =>
            renderMenuItem(item, index, isCollapsed)
          )}
        </List>
      </Collapse>
    </Box>
  );

  const renderCommonMenuItems = (isCollapsed) => (
    <Box>
      {!isCollapsed && (
        <Typography
          variant="subtitle2"
          sx={{
            px: { xs: 2, sm: 3 },
            py: { xs: 1, sm: 1.5 },
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            fontWeight: 600,
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          General
        </Typography>
      )}
      
      {/* Show divider when collapsed */}
      {isCollapsed && (
        <Divider sx={{ my: 1, mx: 1 }} />
      )}
      
      <List component="div" disablePadding sx={{ py: isCollapsed ? 1 : 0 }}>
        {commonMenuItems.map((item, index) =>
          renderMenuItem(item, index, isCollapsed)
        )}
      </List>

      {/* Help & Support Section */}
      {!isCollapsed && (
        <Typography
          variant="subtitle2"
          sx={{
            px: { xs: 2, sm: 3 },
            py: { xs: 1, sm: 1.5 },
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            fontWeight: 600,
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          Help & Support
        </Typography>
      )}
      
      <List component="div" disablePadding sx={{ py: isCollapsed ? 1 : 0 }}>
        {helpSection.items.map((item, index) =>
          renderMenuItem(item, index, isCollapsed)
        )}
      </List>
    </Box>
  );

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH,
        transition: 'width 0.3s ease-in-out',
        overflow: 'hidden',
        position: 'relative',
        zIndex: theme.zIndex.drawer
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          p: collapsed ? { xs: 1, sm: 1.5 } : { xs: 1.5, sm: 2 },
          borderBottom: 1,
          borderColor: 'divider',
          minHeight: collapsed ? 64 : { xs: 64, sm: 72 },
          position: 'sticky',
          top: 0,
          backgroundColor: 'background.paper',
          zIndex: 1,
          transition: 'all 0.3s ease-in-out'
        }}
      >
        {/* Logo/Role icon when collapsed */}
        {collapsed && roleMenu && (
          <Tooltip title={roleMenu.title} placement="right" arrow>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <roleMenu.icon 
                sx={{ 
                  color: theme.palette.primary.main,
                  fontSize: 28,
                }} 
              />
            </Box>
          </Tooltip>
        )}
        
        {/* Role title when expanded */}
        {!collapsed && roleMenu && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
            <roleMenu.icon 
              sx={{ 
                color: theme.palette.primary.main,
                fontSize: { xs: 24, sm: 28 },
              }} 
            />
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '1rem', sm: '1.25rem' },
                fontWeight: 600,
                lineHeight: 1.2,
                color: theme.palette.primary.main,
              }}
            >
              {roleMenu.title}
            </Typography>
          </Box>
        )}
        
        {/* Expand/Collapse button */}
        {!collapsed && (
          <IconButton
            onClick={onCollapse}
            sx={{
              color: 'text.secondary',
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                color: theme.palette.primary.main,
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease-in-out',
              width: { xs: 32, sm: 36 },
              height: { xs: 32, sm: 36 },
              minWidth: { xs: 32, sm: 36 },
              minHeight: { xs: 32, sm: 36 },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>
      
      {/* Expand button when collapsed - positioned at bottom of header */}
      {collapsed && (
        <Box sx={{ position: 'absolute', top: 8, right: -12, zIndex: 2 }}>
          <IconButton
            onClick={onCollapse}
            size="small"
            sx={{
              color: 'white',
              backgroundColor: theme.palette.primary.main,
              boxShadow: 2,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease-in-out',
              width: 24,
              height: 24,
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Navigation Items */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0,0,0,0.2) transparent',
          '&::-webkit-scrollbar': {
            width: 6,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: 3,
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'rgba(0,0,0,0.3)',
          },
          px: { xs: 0.5, sm: 1 },
          py: { xs: 1, sm: 1.5 }
        }}
      >
        {/* Role-specific sections */}
        {roleMenu && roleMenu.sections.map(section => 
          renderSection(section, collapsed)
        )}
        
        {/* Divider */}
        {roleMenu && (
          <Divider sx={{ my: { xs: 1, sm: 2 }, mx: { xs: 1, sm: 2 } }} />
        )}
        
        {/* Common menu items */}
        {renderCommonMenuItems(collapsed)}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: collapsed ? 1 : { xs: 1.5, sm: 2 },
          borderTop: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          position: 'sticky',
          bottom: 0,
          zIndex: 1,
          transition: 'all 0.3s ease-in-out'
        }}
      >
        {!collapsed && user && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Avatar
                sx={{
                  width: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 },
                  bgcolor: 'primary.main',
                }}
              >
                {user.name?.charAt(0) || 'U'}
              </Avatar>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user.name || 'User'}
                </Typography>
                <Chip
                  label={user.role || 'User'}
                  size="small"
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    height: { xs: 20, sm: 24 },
                  }}
                />
              </Box>
            </Box>
            
            {/* Logout button */}
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 1,
                color: 'error.main',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </>
        )}
        
        {/* Collapsed footer */}
        {collapsed && user && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Tooltip title={`${user.name || 'User'} (${user.role})`} placement="right" arrow>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'primary.main',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                  transition: 'transform 0.2s ease-in-out'
                }}
              >
                {user.name?.charAt(0) || 'U'}
              </Avatar>
            </Tooltip>
            
            <Tooltip title="Logout" placement="right" arrow>
              <IconButton
                onClick={handleLogout}
                size="small"
                sx={{
                  color: 'error.main',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Box>
  );

  if (isMobileDevice) {
    // Mobile: Overlay drawer
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: SIDEBAR_EXPANDED_WIDTH,
            border: 'none',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            zIndex: theme.zIndex.modal + 1,
            backgroundColor: 'background.paper',
            overflowY: 'auto'
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  // Desktop: Static sidebar
  return (
    <Box
      sx={{
        width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH,
        flexShrink: 0,
        transition: 'width 0.3s ease-in-out',
        height: '100vh',
        position: 'sticky',
        top: 0,
        backgroundColor: 'background.paper',
        borderRight: `1px solid ${theme.palette.divider}`,
        boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
        zIndex: theme.zIndex.drawer,
        overflow: 'hidden'
      }}
    >
      {drawerContent}
    </Box>
  );
}

export default Sidebar; 