import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Divider,
  Grid,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Forum as ForumIcon,
  VideoCall as VideoCallIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../../utils/auth';

function AdminProfile() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/dashboard-summary', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.status}`);
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      setError(err.message);
      // Fallback data
      setDashboardData({
        totalUsers: 150,
        totalTeachers: 25,
        totalStudents: 120,
        totalParents: 100,
        activeClasses: 8,
        totalAssignments: 45,
        totalExams: 12,
        activeOnlineClasses: 3
      });
    } finally {
      setLoading(false);
    }
  };

  const getSystemStats = () => {
    if (!dashboardData) return [];
    
    return [
      {
        title: 'Total Users',
        value: dashboardData.totalUsers || 0,
        icon: <PeopleIcon />,
        color: 'primary',
        description: 'All registered users'
      },
      {
        title: 'Teachers',
        value: dashboardData.totalTeachers || 0,
        icon: <SchoolIcon />,
        color: 'success',
        description: 'Active teaching staff'
      },
      {
        title: 'Students',
        value: dashboardData.totalStudents || 0,
        icon: <PeopleIcon />,
        color: 'info',
        description: 'Enrolled students'
      },
      {
        title: 'Parents',
        value: dashboardData.totalParents || 0,
        icon: <PeopleIcon />,
        color: 'warning',
        description: 'Registered parents'
      },
      {
        title: 'Active Classes',
        value: dashboardData.activeClasses || 0,
        icon: <SchoolIcon />,
        color: 'secondary',
        description: 'Currently running classes'
      },
      {
        title: 'Online Classes',
        value: dashboardData.activeOnlineClasses || 0,
        icon: <VideoCallIcon />,
        color: 'error',
        description: 'Live online sessions'
      }
    ];
  };

  const getQuickActions = () => [
    {
      title: 'Add Teacher',
      description: 'Register new teaching staff',
      icon: <SchoolIcon />,
      color: 'primary',
      action: () => console.log('Add Teacher')
    },
    {
      title: 'Add Student',
      description: 'Enroll new students',
      icon: <PeopleIcon />,
      color: 'success',
      action: () => console.log('Add Student')
    },
    {
      title: 'System Settings',
      description: 'Configure system parameters',
      icon: <SettingsIcon />,
      color: 'warning',
      action: () => console.log('System Settings')
    },
    {
      title: 'Security Audit',
      description: 'Review system security',
      icon: <SecurityIcon />,
      color: 'error',
      action: () => console.log('Security Audit')
    }
  ];

  if (!user || user.role !== 'ADMIN') {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Access denied. Admin privileges required.</Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Admin Dashboard
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={fetchDashboardData}
          variant="outlined"
        >
          Refresh Data
        </Button>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error} - Showing sample data.
        </Alert>
      )}

      {/* Admin Profile Header */}
      <Card elevation={3} sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'error.main',
                fontSize: '1.5rem'
              }}
            >
              <AdminIcon />
            </Avatar>
            
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" fontWeight="bold">
                {user.name || 'Administrator'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                System Administrator • Full Access
              </Typography>
              <Chip
                label="ADMIN"
                color="error"
                icon={<AdminIcon />}
                sx={{ mt: 1 }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* System Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {getSystemStats().map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: `${stat.color}.main` }}>
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color={`${stat.color}.main`}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {stat.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Quick Actions
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                {getQuickActions().map((action, index) => (
                  <Grid item xs={6} key={index}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={action.icon}
                      onClick={action.action}
                      sx={{ 
                        p: 2, 
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                        height: 'auto'
                      }}
                    >
                      <Typography variant="body2" fontWeight="bold">
                        {action.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {action.description}
                      </Typography>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* System Health */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                System Health
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List dense>
                <ListItem>
                  <ListItemIcon><TrendingUpIcon color="success" /></ListItemIcon>
                  <ListItemText 
                    primary="System Status" 
                    secondary="All systems operational" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><SecurityIcon color="success" /></ListItemIcon>
                  <ListItemText 
                    primary="Security Status" 
                    secondary="No security threats detected" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><NotificationsIcon color="info" /></ListItemIcon>
                  <ListItemText 
                    primary="Active Sessions" 
                    secondary={`${dashboardData?.totalUsers || 0} users online`} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><VideoCallIcon color="warning" /></ListItemIcon>
                  <ListItemText 
                    primary="Online Classes" 
                    secondary={`${dashboardData?.activeOnlineClasses || 0} live sessions`} 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Recent System Activity
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Action</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>User Login</TableCell>
                      <TableCell>teacher@school.com</TableCell>
                      <TableCell>2 minutes ago</TableCell>
                      <TableCell>
                        <Chip label="Success" color="success" size="small" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Assignment Upload</TableCell>
                      <TableCell>student@school.com</TableCell>
                      <TableCell>5 minutes ago</TableCell>
                      <TableCell>
                        <Chip label="Success" color="success" size="small" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Exam Creation</TableCell>
                      <TableCell>admin@school.com</TableCell>
                      <TableCell>10 minutes ago</TableCell>
                      <TableCell>
                        <Chip label="Success" color="success" size="small" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminProfile;
