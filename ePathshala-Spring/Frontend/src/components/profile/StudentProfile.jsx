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
  Person as PersonIcon,
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
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useAuth } from '../../utils/auth';

function StudentProfile() {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      // Fetch student details
      const detailsResponse = await fetch(`/api/student/details/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Fetch student grades
      const gradesResponse = await fetch(`/api/student/grades/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Fetch student attendance
      const attendanceResponse = await fetch(`/api/student/attendance/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Fetch student assignments
      const assignmentsResponse = await fetch(`/api/student/assignments/${user.assignedClass || 'default'}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      let details = {};
      let grades = [];
      let attendance = [];
      let assignments = [];

      if (detailsResponse.ok) {
        details = await detailsResponse.json();
      }

      if (gradesResponse.ok) {
        grades = await gradesResponse.json();
      }

      if (attendanceResponse.ok) {
        attendance = await attendanceResponse.json();
      }

      if (assignmentsResponse.ok) {
        assignments = await assignmentsResponse.json();
      }

      setStudentData({
        details,
        grades,
        attendance,
        assignments
      });
    } catch (err) {
      setError(err.message);
      // Fallback data
      setStudentData({
        details: {},
        grades: [],
        attendance: [],
        assignments: []
      });
    } finally {
      setLoading(false);
    }
  };

  const getAcademicStats = () => {
    if (!studentData) return [];
    
    const totalAssignments = studentData.assignments?.length || 0;
    const completedAssignments = studentData.assignments?.filter(a => a.submitted)?.length || 0;
    const averageGrade = studentData.grades?.length > 0 
      ? (studentData.grades.reduce((sum, grade) => sum + (grade.score || 0), 0) / studentData.grades.length).toFixed(1)
      : 0;
    const attendanceRate = studentData.attendance?.length > 0
      ? ((studentData.attendance.filter(a => a.present).length / studentData.attendance.length) * 100).toFixed(1)
      : 0;
    
    return [
      {
        title: 'Average Grade',
        value: `${averageGrade}%`,
        icon: <GradeIcon />,
        color: 'success',
        description: 'Overall academic performance'
      },
      {
        title: 'Attendance',
        value: `${attendanceRate}%`,
        icon: <CheckCircleIcon />,
        color: 'primary',
        description: 'Class attendance rate'
      },
      {
        title: 'Assignments',
        value: `${completedAssignments}/${totalAssignments}`,
        icon: <AssignmentIcon />,
        color: 'warning',
        description: 'Completed assignments'
      },
      {
        title: 'Exams Taken',
        value: studentData.grades?.length || 0,
        icon: <QuizIcon />,
        color: 'info',
        description: 'Total exams completed'
      },
      {
        title: 'Online Classes',
        value: 3, // Mock data
        icon: <VideoCallIcon />,
        color: 'secondary',
        description: 'Attended sessions'
      },
      {
        title: 'Study Hours',
        value: '45h', // Mock data
        icon: <ScheduleIcon />,
        color: 'error',
        description: 'This week'
      }
    ];
  };

  const getQuickActions = () => [
    {
      title: 'View Assignments',
      description: 'Check pending work',
      icon: <AssignmentIcon />,
      color: 'primary',
      action: () => console.log('View Assignments')
    },
    {
      title: 'Take Exam',
      description: 'Available exams',
      icon: <QuizIcon />,
      color: 'success',
      action: () => console.log('Take Exam')
    },
    {
      title: 'Join Class',
      description: 'Online sessions',
      icon: <VideoCallIcon />,
      color: 'warning',
      action: () => console.log('Join Class')
    },
    {
      title: 'View Grades',
      description: 'Academic progress',
      icon: <GradeIcon />,
      color: 'info',
      action: () => console.log('View Grades')
    }
  ];

  if (!user || user.role !== 'STUDENT') {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Access denied. Student privileges required.</Alert>
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
          Student Profile
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={fetchStudentData}
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

      {/* Student Profile Header */}
      <Card elevation={3} sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'success.main',
                fontSize: '1.5rem'
              }}
            >
              <PersonIcon />
            </Avatar>
            
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" fontWeight="bold">
                {user.name || 'Student Name'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Student • {user.assignedClass || 'Not assigned to class'}
              </Typography>
              <Chip
                label="STUDENT"
                color="success"
                icon={<PersonIcon />}
                sx={{ mt: 1 }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Academic Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {getAcademicStats().map((stat, index) => (
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

        {/* Academic Information */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Academic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List dense>
                <ListItem>
                  <ListItemIcon><SchoolIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Class" 
                    secondary={user.assignedClass || 'Not assigned'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><PersonIcon color="success" /></ListItemIcon>
                  <ListItemText 
                    primary="Student ID" 
                    secondary={studentData?.details?.id || user.accountNumber} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><GradeIcon color="warning" /></ListItemIcon>
                  <ListItemText 
                    primary="Current GPA" 
                    secondary="3.8/4.0" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CalendarIcon color="info" /></ListItemIcon>
                  <ListItemText 
                    primary="Enrolled Since" 
                    secondary="September 2023" 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Grades */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Recent Grades
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {studentData?.grades?.length > 0 ? (
                <List dense>
                  {studentData.grades.slice(0, 5).map((grade, index) => (
                    <ListItem key={index}>
                      <ListItemIcon><GradeIcon color="primary" /></ListItemIcon>
                      <ListItemText 
                        primary={grade.subject || 'Subject'} 
                        secondary={`${grade.score || 0}% - ${grade.examTitle || 'Exam'}`} 
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

        {/* Recent Assignments */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Recent Assignments
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {studentData?.assignments?.length > 0 ? (
                <List dense>
                  {studentData.assignments.slice(0, 5).map((assignment, index) => (
                    <ListItem key={index}>
                      <ListItemIcon><AssignmentIcon color="primary" /></ListItemIcon>
                      <ListItemText 
                        primary={assignment.title || 'Assignment Title'} 
                        secondary={assignment.dueDate || 'No due date'} 
                      />
                      <Chip 
                        label={assignment.submitted ? 'Submitted' : 'Pending'} 
                        color={assignment.submitted ? 'success' : 'warning'}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No assignments available
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
                Academic Performance Overview
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h3" color="success.main" fontWeight="bold">
                      85%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Overall Grade
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={85} 
                      color="success" 
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={3}>
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
                
                <Grid item xs={12} md={3}>
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

                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h3" color="info.main" fontWeight="bold">
                      95%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Exam Success Rate
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={95} 
                      color="info" 
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Attendance History */}
        <Grid item xs={12}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Attendance History
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {studentData?.attendance?.slice(0, 10).map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>{record.date || 'N/A'}</TableCell>
                        <TableCell>{record.subject || 'N/A'}</TableCell>
                        <TableCell>
                          <Chip 
                            label={record.present ? 'Present' : 'Absent'} 
                            color={record.present ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{record.time || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                    {(!studentData?.attendance || studentData.attendance.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={4} sx={{ textAlign: 'center' }}>
                          No attendance records available
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

export default StudentProfile;
