import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
  Collapse,
  Tooltip,
  IconButton,
  Fade,
  Chip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon,
  Forum as ForumIcon,
  Chat as ChatIcon,
  FamilyRestroom as FamilyIcon,
  ExpandLess,
  ExpandMore,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../utils/auth';
import { useResponsive, spacing, typography } from '../../utils/responsive';

const SIDEBAR_COLLAPSED_WIDTH = 60;
const SIDEBAR_EXPANDED_WIDTH = 280;

const parentMenuItems = [
  {
    text: 'Dashboard Overview',
    icon: DashboardIcon,
    path: '/parent',
    description: 'Main dashboard view'
  },
  {
    text: 'Child Progress',
    icon: PersonIcon,
    path: '/parent/child-progress',
    description: 'Monitor child academic progress'
  },
  {
    text: 'Leave Approvals',
    icon: ScheduleIcon,
    path: '/parent/leave-approvals',
    description: 'Approve child leave requests'
  },
  {
    text: 'Academic Calendar',
    icon: EventIcon,
    path: '/parent/calendar',
    description: 'View academic events and schedules'
  }
];

const communicationItems = [
  {
    text: 'Forum',
    icon: ForumIcon,
    path: '/parent/forum',
    description: 'Participate in discussions'
  },
  {
    text: 'Chat',
    icon: ChatIcon,
    path: '/parent/chat',
    description: 'Real-time messaging'
  },
  {
    text: 'Notifications',
    icon: NotificationsIcon,
    path: '/parent/notifications',
    description: 'View system notifications'
  }
];

function ParentSidebar({ open, onClose, collapsed, onCollapse }) {
  const theme = useTheme();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [expanded, setExpanded] = useState({ communication: false });

  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile && !collapsed) {
      onCollapse?.();
    }
  }, [isMobile, collapsed, onCollapse]);

  const handleDrawerClose = () => {
    if (isMobile) {
      onClose?.();
    }
  };

  const handleItemClick = (path) => {
    navigate(path);
    handleDrawerClose();
  };

  const handleExpandClick = (section) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderMenuItem = (item, index) => {
    const isActive = location.pathname === item.path;
    
    const menuItem = (
      <ListItem
        key={item.text}
        disablePadding
        sx={{
          mb: { xs: 0.5, sm: 1 },
          mx: { xs: 0.5, sm: 1 },
          borderRadius: { xs: 1, sm: 2 },
          overflow: 'hidden',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.04)',
          },
        }}
      >
        <ListItemButton
          onClick={() => handleItemClick(item.path)}
          sx={{
            minHeight: { xs: 48, sm: 56 },
            px: { xs: 1, sm: 2 },
            borderRadius: { xs: 1, sm: 2 },
            backgroundColor: isActive ? 'primary.main' : 'transparent',
            color: isActive ? 'primary.contrastText' : 'inherit',
            '&:hover': {
              backgroundColor: isActive ? 'primary.dark' : 'rgba(0,0,0,0.04)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: { xs: 36, sm: 40 },
              color: isActive ? 'primary.contrastText' : 'inherit',
            }}
          >
            <item.icon />
          </ListItemIcon>
          {!collapsed && (
            <ListItemText
              primary={item.text}
              secondary={item.description}
              sx={{
                '& .MuiTypography-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  fontWeight: isActive ? 600 : 400,
                },
                '& .MuiListItemText-secondary': {
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  color: isActive ? 'primary.contrastText' : 'text.secondary',
                },
              }}
            />
          )}
        </ListItemButton>
      </ListItem>
    );

    return collapsed ? (
      <Tooltip title={item.text} placement="right" key={item.text}>
        {menuItem}
      </Tooltip>
    ) : menuItem;
  };

  const renderSection = (title, items, sectionKey) => (
    <Box key={sectionKey}>
      {!collapsed && (
        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            py: { xs: 1, sm: 1.5 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.02)',
            },
          }}
          onClick={() => handleExpandClick(sectionKey)}
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
            {title}
          </Typography>
          {expanded[sectionKey] ? <ExpandLess /> : <ExpandMore />}
        </Box>
      )}
      <Collapse in={!collapsed || expanded[sectionKey]} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {items.map((item, index) => renderMenuItem(item, index))}
        </List>
      </Collapse>
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
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          p: { xs: 1.5, sm: 2 },
          borderBottom: 1,
          borderColor: 'divider',
          minHeight: { xs: 64, sm: 72 },
        }}
      >
        {!collapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              sx={{
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
                bgcolor: 'primary.main',
              }}
            >
              <FamilyIcon />
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  fontWeight: 600,
                  lineHeight: 1.2,
                }}
              >
                ePathshala
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  color: 'text.secondary',
                }}
              >
                Parent Portal
              </Typography>
            </Box>
          </Box>
        )}
        
        <IconButton
          onClick={onCollapse}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.04)',
            },
          }}
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      {/* Navigation Items */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
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
        }}
      >
        {renderSection('Parent Dashboard', parentMenuItems, 'dashboard')}
        {renderSection('Communication', communicationItems, 'communication')}
      </Box>

      {/* Footer */}
      {!collapsed && user && (
        <Box
          sx={{
            p: { xs: 1.5, sm: 2 },
            borderTop: 1,
            borderColor: 'divider',
            backgroundColor: 'background.paper',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Avatar
              sx={{
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
                bgcolor: 'primary.main',
              }}
            >
              {user.name?.charAt(0) || 'P'}
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
                {user.name || 'Parent'}
              </Typography>
              <Chip
                label="Parent"
                size="small"
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  height: { xs: 20, sm: 24 },
                }}
              />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );

  if (isMobile) {
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

export default ParentSidebar;
