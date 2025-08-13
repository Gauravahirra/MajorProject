import React, { useEffect, useState } from 'react';
import { useAuth } from '../../utils/auth';
import { getDashboardSummary } from '../../api/admin';
import { 
  Box, 
  Alert, 
  CircularProgress, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  Paper,
  Container,
  Fade,
  Slide,
  Grow,
  Zoom,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  FamilyRestroom as FamilyIcon,
  Event as EventIcon,
  TrendingUp as TrendingIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Assessment as AssessmentIcon,
  CalendarToday as CalendarIcon,
  VideoCall as VideoCallIcon,
  Forum as ForumIcon,
  Chat as ChatIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { useResponsive, typography, gridConfig, cardStyles } from '../../utils/responsive';

// Import modular components
import AdminSummary from './AdminSummary';
import AdminAddStudent from './AdminAddStudent';
import AdminAddTeacher from './AdminAddTeacher';

import AdminAssignTeacher from './AdminAssignTeacher';
import AdminResetPassword from './AdminResetPassword';
import AdminAcademicCalendar from './AdminAcademicCalendar';
import AdminOnlineClasses from './AdminOnlineClasses';
import AdminSessionManagement from './AdminSessionManagement';

// Quick Action Cards Component
const QuickActionCard = ({ title, description, icon: Icon, color, onClick, disabled = false }) => {
  const theme = useTheme();
  
  return (
    <Grow in={true} timeout={800}>
      <Card
        onClick={onClick}
        sx={{
          height: '100%',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease-in-out',
          background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
          color: 'white',
          '&:hover': {
            transform: disabled ? 'none' : 'translateY(-4px)',
            boxShadow: disabled ? theme.shadows[2] : theme.shadows[8],
            '& .MuiCardContent-root': {
              transform: 'scale(1.02)',
            }
          },
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <CardContent sx={{ 
          p: { xs: 2, sm: 3 },
          textAlign: 'center',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          transition: 'transform 0.3s ease-in-out'
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mb: 2,
            opacity: 0.9
          }}>
            <Icon sx={{ fontSize: { xs: 40, sm: 48, md: 56 } }} />
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              mb: 1,
              fontSize: { xs: '1rem', sm: '1.125rem' }
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              opacity: 0.9,
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Grow>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color, trend, subtitle }) => {
  const theme = useTheme();
  
  return (
    <Slide direction="up" in={true} timeout={600}>
      <Card sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.9)} 100%)`,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(45deg, transparent 30%, ${alpha('#fff', 0.1)} 50%, transparent 70%)`,
          transform: 'translateX(-100%)',
          transition: 'transform 0.6s ease-in-out',
        },
        '&:hover::before': {
          transform: 'translateX(100%)',
        }
      }}>
        <CardContent sx={{ 
          p: { xs: 2, sm: 3 },
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  mb: 1
                }}
              >
                {value}
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 500,
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                  mb: 0.5
                }}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    opacity: 0.8,
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: { xs: 48, sm: 56, md: 64 },
              height: { xs: 48, sm: 56, md: 64 },
              borderRadius: '50%',
              backgroundColor: alpha('#fff', 0.2),
              backdropFilter: 'blur(10px)'
            }}>
              <Icon sx={{ 
                fontSize: { xs: 24, sm: 28, md: 32 },
                opacity: 0.9
              }} />
            </Box>
          </Box>
          
          {trend && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mt: 2,
              opacity: 0.8
            }}>
              <TrendingIcon sx={{ mr: 0.5, fontSize: 16 }} />
              <Typography variant="caption">
                {trend}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Slide>
  );
};

// Activity Feed Component
const ActivityFeed = ({ activities = [] }) => {
  return (
    <Fade in={true} timeout={1000}>
      <Paper sx={{ 
        p: { xs: 2, sm: 3 },
        height: '100%',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <NotificationsIcon />
          Recent Activity
        </Typography>
        
        <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <Box 
                key={index}
                sx={{ 
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                  {activity.title}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  {activity.time}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" sx={{ opacity: 0.7, textAlign: 'center', py: 4 }}>
              No recent activity
            </Typography>
          )}
        </Box>
      </Paper>
    </Fade>
  );
};

function AdminDashboard() {
  const { user } = useAuth();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const theme = useTheme();
  
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock activities for demo
  const activities = [
    { title: 'New student registered: John Doe', time: '2 minutes ago' },
    { title: 'Teacher assignment updated for Class 10A', time: '15 minutes ago' },
    { title: 'New online class scheduled for tomorrow', time: '1 hour ago' },
    { title: 'Academic calendar updated', time: '2 hours ago' },
    { title: 'Password reset for teacher@school.com', time: '3 hours ago' }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const summaryData = await getDashboardSummary();
        setDashboardSummary(summaryData);
        setLoading(false);
      } catch (error) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    // Reload data
    setTimeout(() => setLoading(false), 1000);
  };

  const quickActions = [
    {
      title: 'Add Student',
      description: 'Register new student',
      icon: SchoolIcon,
      color: '#667eea',
      onClick: () => setActiveTab('add-student')
    },
    {
      title: 'Add Teacher',
      description: 'Register new teacher',
      icon: PersonIcon,
      color: '#f093fb',
      onClick: () => setActiveTab('add-teacher')
    },

    {
      title: 'Assign Teacher',
      description: 'Assign teacher to class',
      icon: AssessmentIcon,
      color: '#43e97b',
      onClick: () => setActiveTab('assign-teacher')
    },
    {
      title: 'Reset Password',
      description: 'Reset user password',
      icon: SecurityIcon,
      color: '#fa709a',
      onClick: () => setActiveTab('reset-password')
    },
    {
      title: 'Calendar',
      description: 'Manage academic calendar',
      icon: CalendarIcon,
      color: '#a8edea',
      onClick: () => setActiveTab('calendar')
    }
  ];

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ opacity: 0.7 }}>
          Loading Admin Dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {message && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      {/* Header Section */}
      <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ 
              bgcolor: 'primary.main',
              width: { xs: 48, sm: 56 },
              height: { xs: 48, sm: 56 }
            }}>
              <AdminIcon />
            </Avatar>
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Admin Dashboard
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  opacity: 0.7,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Welcome back, {user?.name || 'Administrator'}
              </Typography>
            </Box>
          </Box>
          
          <Tooltip title="Refresh Dashboard">
            <IconButton 
              onClick={handleRefresh}
              sx={{ 
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Stats Overview */}
      {dashboardSummary && (
        <Box sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600,
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <DashboardIcon />
            Dashboard Overview
          </Typography>
          
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            <Grid item xs={6} sm={3}>
              <StatsCard
                title="Students"
                value={dashboardSummary.totalStudents || 0}
                icon={SchoolIcon}
                color="#667eea"
                trend="+12% this month"
                subtitle="Active students"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatsCard
                title="Teachers"
                value={dashboardSummary.totalTeachers || 0}
                icon={PersonIcon}
                color="#f093fb"
                trend="+5% this month"
                subtitle="Active teachers"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatsCard
                title="Parents"
                value={dashboardSummary.totalParents || 0}
                icon={FamilyIcon}
                color="#4facfe"
                trend="+8% this month"
                subtitle="Registered parents"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatsCard
                title="Events"
                value={dashboardSummary.totalEvents || 0}
                icon={EventIcon}
                color="#43e97b"
                trend="+3 this week"
                subtitle="Upcoming events"
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Quick Actions */}
      <Box sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <AddIcon />
          Quick Actions
        </Typography>
        
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {quickActions.map((action, index) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
              <QuickActionCard {...action} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Main Content Area */}
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {/* Left Column - Main Components */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ mb: 4 }}>
            {activeTab === 'overview' && <AdminSummary />}
            {activeTab === 'add-student' && <AdminAddStudent />}
            {activeTab === 'add-teacher' && <AdminAddTeacher />}

            {activeTab === 'assign-teacher' && <AdminAssignTeacher />}
            {activeTab === 'reset-password' && <AdminResetPassword />}
            {activeTab === 'calendar' && <AdminAcademicCalendar />}
            {activeTab === 'online-classes' && <AdminOnlineClasses />}
            {activeTab === 'sessions' && <AdminSessionManagement />}
          </Box>
        </Grid>

        {/* Right Column - Activity Feed & Quick Stats */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ActivityFeed activities={activities} />
            </Grid>
            
            <Grid item xs={12}>
              <Fade in={true} timeout={1200}>
                <Paper sx={{ 
                  p: { xs: 2, sm: 3 },
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white'
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <AssessmentIcon />
                    System Status
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Database</Typography>
                      <Chip label="Online" size="small" color="success" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">WebSocket</Typography>
                      <Chip label="Connected" size="small" color="success" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">API Services</Typography>
                      <Chip label="Healthy" size="small" color="success" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">File Storage</Typography>
                      <Chip label="Available" size="small" color="success" />
                    </Box>
                  </Box>
                </Paper>
              </Fade>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AdminDashboard;