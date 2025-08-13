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
  FamilyRestroom as FamilyIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Quiz as QuizIcon,
  VideoCall as VideoCallIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Grade as GradeIcon,
  Book as BookIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useAuth } from '../../utils/auth';

function ParentProfile() {
  const { user } = useAuth();
  const [parentData, setParentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchParentData();
  }, []);

  const fetchParentData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      // Fetch parent's leave requests
      const leaveResponse = await fetch(`/api/parent/leave/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Fetch children's grades
      const gradesResponse = await fetch(`/api/parent/grades/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Fetch children's attendance
      const attendanceResponse = await fetch(`/api/parent/attendance/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      let leaveRequests = [];
      let childrenGrades = [];
      let childrenAttendance = [];

      if (leaveResponse.ok) {
        leaveRequests = await leaveResponse.json();
      }

      if (gradesResponse.ok) {
        childrenGrades = await gradesResponse.json();
      }

      if (attendanceResponse.ok) {
        childrenAttendance = await attendanceResponse.json();
      }

      setParentData({
        leaveRequests,
        childrenGrades,
        childrenAttendance
      });
    } catch (err) {
      setError(err.message);
      // Fallback data
      setParentData({
        leaveRequests: [],
        childrenGrades: [],
        childrenAttendance: []
      });
    } finally {
      setLoading(false);
    }
  };

  const getParentStats = () => {
    if (!parentData) return [];
    
    const totalChildren = 2; // Mock data
    const pendingLeaves = parentData.leaveRequests?.filter(l => l.status === 'PENDING')?.length || 0;
    const approvedLeaves = parentData.leaveRequests?.filter(l => l.status === 'APPROVED')?.length || 0;
    const averageGrade = parentData.childrenGrades?.length > 0 
      ? (parentData.childrenGrades.reduce((sum, grade) => sum + (grade.score || 0), 0) / parentData.childrenGrades.length).toFixed(1)
      : 0;
    const attendanceRate = parentData.childrenAttendance?.length > 0
      ? ((parentData.childrenAttendance.filter(a => a.present).length / parentData.childrenAttendance.length) * 100).toFixed(1)
      : 0;
    
    return [
      {
        title: 'Children',
        value: totalChildren,
        icon: <FamilyIcon />,
        color: 'primary',
        description: 'Enrolled children'
      },
      {
        title: 'Average Grade',
        value: `${averageGrade}%`,
        icon: <GradeIcon />,
        color: 'success',
        description: 'Children\'s performance'
      },
      {
        title: 'Attendance',
        value: `${attendanceRate}%`,
        icon: <CheckCircleIcon />,
        color: 'info',
        description: 'Children\'s attendance'
      },
      {
        title: 'Leave Requests',
        value: `${approvedLeaves}/${parentData.leaveRequests?.length || 0}`,
        icon: <CalendarIcon />,
        color: 'warning',
        description: 'Approved requests'
      },
      {
        title: 'Pending Approvals',
        value: pendingLeaves,
        icon: <NotificationsIcon />,
        color: 'error',
        description: 'Awaiting response'
      },
      {
        title: 'Online Classes',
        value: 5, // Mock data
        icon: <VideoCallIcon />,
        color: 'secondary',
        description: 'Children attended'
      }
    ];
  };

  const getQuickActions = () => [
    {
      title: 'Request Leave',
      description: 'Submit leave application',
      icon: <CalendarIcon />,
      color: 'primary',
      action: () => console.log('Request Leave')
    },
    {
      title: 'View Grades',
      description: 'Check children\'s progress',
      icon: <GradeIcon />,
      color: 'success',
      action: () => console.log('View Grades')
    },
    {
      title: 'Attendance Report',
      description: 'Monitor attendance',
      icon: <CheckCircleIcon />,
      color: 'warning',
      action: () => console.log('Attendance Report')
    },
    {
      title: 'Contact Teacher',
      description: 'Send message to teacher',
      icon: <NotificationsIcon />,
      color: 'info',
      action: () => console.log('Contact Teacher')
    }
  ];

  if (!user || user.role !== 'PARENT') {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Access denied. Parent privileges required.</Alert>
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
          Parent Profile
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={fetchParentData}
          variant="outlined"
        >
          Refresh Data
        </Button>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error} - Showing basic information.
        </Alert>
      )}

      {/* Parent Profile Header */}
      <Card elevation={3} sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'warning.main',
                fontSize: '1.5rem'
              }}
            >
              <FamilyIcon />
            </Avatar>
            
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" fontWeight="bold">
                {user.name || 'Parent Name'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Parent • Guardian of 2 children
              </Typography>
              <Chip
                label="PARENT"
                color="warning"
                icon={<FamilyIcon />}
                sx={{ mt: 1 }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Parent Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {getParentStats().map((stat, index) => (
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

        {/* Family Information */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Family Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List dense>
                <ListItem>
                  <ListItemIcon><FamilyIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Children" 
                    secondary="2 enrolled students" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><SchoolIcon color="success" /></ListItemIcon>
                  <ListItemText 
                    primary="Classes" 
                    secondary="Class 10A, Class 8B" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><GradeIcon color="warning" /></ListItemIcon>
                  <ListItemText 
                    primary="Average GPA" 
                    secondary="3.7/4.0" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CalendarIcon color="info" /></ListItemIcon>
                  <ListItemText 
                    primary="Member Since" 
                    secondary="January 2023" 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Children's Recent Grades */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Children's Recent Grades
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {parentData?.childrenGrades?.length > 0 ? (
                <List dense>
                  {parentData.childrenGrades.slice(0, 5).map((grade, index) => (
                    <ListItem key={index}>
                      <ListItemIcon><GradeIcon color="primary" /></ListItemIcon>
                      <ListItemText 
                        primary={grade.studentName || 'Child Name'} 
                        secondary={`${grade.subject || 'Subject'} - ${grade.score || 0}%`} 
                      />
                      <Chip 
                        label={`${grade.score || 0}%`} 
                        color={grade.score >= 80 ? 'success' : grade.score >= 60 ? 'warning' : 'error'}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No grades available yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Leave Requests */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Recent Leave Requests
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {parentData?.leaveRequests?.length > 0 ? (
                <List dense>
                  {parentData.leaveRequests.slice(0, 5).map((request, index) => (
                    <ListItem key={index}>
                      <ListItemIcon><CalendarIcon color="primary" /></ListItemIcon>
                      <ListItemText 
                        primary={request.studentName || 'Child Name'} 
                        secondary={request.reason || 'No reason provided'} 
                      />
                      <Chip 
                        label={request.status || 'PENDING'} 
                        color={request.status === 'APPROVED' ? 'success' : request.status === 'REJECTED' ? 'error' : 'warning'}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No leave requests yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Children's Performance Overview */}
        <Grid item xs={12}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Children's Performance Overview
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h3" color="success.main" fontWeight="bold">
                      87%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average Grade
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={87} 
                      color="success" 
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h3" color="primary.main" fontWeight="bold">
                      94%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Attendance Rate
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={94} 
                      color="primary" 
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h3" color="warning.main" fontWeight="bold">
                      82%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Assignment Completion
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={82} 
                      color="warning" 
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h3" color="info.main" fontWeight="bold">
                      90%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Exam Success Rate
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={90} 
                      color="info" 
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Leave Requests History */}
        <Grid item xs={12}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Leave Requests History
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Child Name</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell>From</TableCell>
                      <TableCell>To</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {parentData?.leaveRequests?.slice(0, 10).map((request, index) => (
                      <TableRow key={index}>
                        <TableCell>{request.studentName || 'N/A'}</TableCell>
                        <TableCell>{request.reason || 'N/A'}</TableCell>
                        <TableCell>{request.fromDate || 'N/A'}</TableCell>
                        <TableCell>{request.toDate || 'N/A'}</TableCell>
                        <TableCell>
                          <Chip 
                            label={request.status || 'PENDING'} 
                            color={request.status === 'APPROVED' ? 'success' : request.status === 'REJECTED' ? 'error' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{request.requestDate || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                    {(!parentData?.leaveRequests || parentData.leaveRequests.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                          No leave requests found
                        </TableCell>
                      </TableRow>
                    )}
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

export default ParentProfile;
