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
  School as SchoolIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Quiz as QuizIcon,
  VideoCall as VideoCallIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Grade as GradeIcon,
  Book as BookIcon
} from '@mui/icons-material';
import { useAuth } from '../../utils/auth';

function TeacherProfile() {
  const { user } = useAuth();
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const className = user.assignedClass || 'default';
      
      // Fetch teacher's students
      const studentsResponse = await fetch(`/api/teacher/students/${className}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Fetch teacher's assignments
      const assignmentsResponse = await fetch(`/api/teacher/assignments/${className}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Fetch teacher's grades
      const gradesResponse = await fetch(`/api/teacher/grades/${className}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      let students = [];
      let assignments = [];
      let grades = [];

      if (studentsResponse.ok) {
        students = await studentsResponse.json();
      }

      if (assignmentsResponse.ok) {
        assignments = await assignmentsResponse.json();
      }

      if (gradesResponse.ok) {
        grades = await gradesResponse.json();
      }

      setTeacherData({
        students,
        assignments,
        grades,
        className
      });
    } catch (err) {
      setError(err.message);
      // Fallback data
      setTeacherData({
        students: [],
        assignments: [],
        grades: [],
        className: user.assignedClass || 'Not assigned'
      });
    } finally {
      setLoading(false);
    }
  };

  const getTeachingStats = () => {
    if (!teacherData) return [];
    
    return [
      {
        title: 'Students',
        value: teacherData.students?.length || 0,
        icon: <PeopleIcon />,
        color: 'primary',
        description: 'Enrolled students'
      },
      {
        title: 'Assignments',
        value: teacherData.assignments?.length || 0,
        icon: <AssignmentIcon />,
        color: 'success',
        description: 'Created assignments'
      },
      {
        title: 'Exams',
        value: 5, // Mock data
        icon: <QuizIcon />,
        color: 'warning',
        description: 'Active exams'
      },
      {
        title: 'Online Classes',
        value: 2, // Mock data
        icon: <VideoCallIcon />,
        color: 'info',
        description: 'Scheduled sessions'
      },
      {
        title: 'Average Grade',
        value: '85%', // Mock data
        icon: <GradeIcon />,
        color: 'secondary',
        description: 'Class performance'
      },
      {
        title: 'Attendance',
        value: '92%', // Mock data
        icon: <TrendingUpIcon />,
        color: 'error',
        description: 'Class attendance rate'
      }
    ];
  };

  const getQuickActions = () => [
    {
      title: 'Create Assignment',
      description: 'Upload new assignment',
      icon: <AssignmentIcon />,
      color: 'primary',
      action: () => console.log('Create Assignment')
    },
    {
      title: 'Schedule Exam',
      description: 'Create new exam',
      icon: <QuizIcon />,
      color: 'success',
      action: () => console.log('Schedule Exam')
    },
    {
      title: 'Start Online Class',
      description: 'Begin virtual session',
      icon: <VideoCallIcon />,
      color: 'warning',
      action: () => console.log('Start Online Class')
    },
    {
      title: 'Grade Submissions',
      description: 'Review student work',
      icon: <GradeIcon />,
      color: 'info',
      action: () => console.log('Grade Submissions')
    }
  ];

  if (!user || user.role !== 'TEACHER') {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Access denied. Teacher privileges required.</Alert>
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
          Teacher Profile
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={fetchTeacherData}
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

      {/* Teacher Profile Header */}
      <Card elevation={3} sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'primary.main',
                fontSize: '1.5rem'
              }}
            >
              <SchoolIcon />
            </Avatar>
            
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" fontWeight="bold">
                {user.name || 'Teacher Name'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Educator • {teacherData?.className || 'Not assigned to class'}
              </Typography>
              <Chip
                label="TEACHER"
                color="primary"
                icon={<SchoolIcon />}
                sx={{ mt: 1 }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Teaching Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {getTeachingStats().map((stat, index) => (
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

        {/* Class Information */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Class Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List dense>
                <ListItem>
                  <ListItemIcon><SchoolIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Assigned Class" 
                    secondary={teacherData?.className || 'Not assigned'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><PeopleIcon color="success" /></ListItemIcon>
                  <ListItemText 
                    primary="Total Students" 
                    secondary={teacherData?.students?.length || 0} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><AssignmentIcon color="warning" /></ListItemIcon>
                  <ListItemText 
                    primary="Active Assignments" 
                    secondary={teacherData?.assignments?.length || 0} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CalendarIcon color="info" /></ListItemIcon>
                  <ListItemText 
                    primary="Teaching Since" 
                    secondary="January 2024" 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Students */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Recent Students
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {teacherData?.students?.length > 0 ? (
                <List dense>
                  {teacherData.students.slice(0, 5).map((student, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                          {student.name?.charAt(0) || 'S'}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText 
                        primary={student.name || 'Student Name'} 
                        secondary={student.email || 'No email'} 
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No students assigned yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Assignments */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Recent Assignments
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {teacherData?.assignments?.length > 0 ? (
                <List dense>
                  {teacherData.assignments.slice(0, 5).map((assignment, index) => (
                    <ListItem key={index}>
                      <ListItemIcon><AssignmentIcon color="primary" /></ListItemIcon>
                      <ListItemText 
                        primary={assignment.title || 'Assignment Title'} 
                        secondary={assignment.dueDate || 'No due date'} 
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No assignments created yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Overview */}
        <Grid item xs={12}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Class Performance Overview
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h3" color="success.main" fontWeight="bold">
                      85%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average Grade
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={85} 
                      color="success" 
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h3" color="primary.main" fontWeight="bold">
                      92%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Attendance Rate
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={92} 
                      color="primary" 
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h3" color="warning.main" fontWeight="bold">
                      78%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Assignment Completion
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={78} 
                      color="warning" 
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default TeacherProfile;
