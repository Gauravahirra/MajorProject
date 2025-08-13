import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Avatar
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useAuth } from '../../utils/auth';

function ChildProgress() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [childData, setChildData] = useState({
    attendance: [],
    grades: [],
    assignments: [],
    leaveRequests: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadChildData();
  }, []);

  const loadChildData = async () => {
    try {
      setLoading(true);
      
      const [attendanceRes, gradesRes, assignmentsRes, leaveRes] = await Promise.all([
        fetch(`/api/parent/attendance/${user?.id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`/api/parent/grades/${user?.id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`/api/parent/assignments/${user?.id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`/api/parent/leave/${user?.id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      if (attendanceRes.ok) {
        const attendanceData = await attendanceRes.json();
        setChildData(prev => ({ ...prev, attendance: attendanceData }));
      }

      if (gradesRes.ok) {
        const gradesData = await gradesRes.json();
        setChildData(prev => ({ ...prev, grades: gradesData }));
      }

      if (assignmentsRes.ok) {
        const assignmentsData = await assignmentsRes.json();
        setChildData(prev => ({ ...prev, assignments: assignmentsData }));
      }

      if (leaveRes.ok) {
        const leaveData = await leaveRes.json();
        setChildData(prev => ({ ...prev, leaveRequests: leaveData }));
      }
    } catch (error) {
      setError('Failed to load child data');
    } finally {
      setLoading(false);
    }
  };

  const calculateAttendancePercentage = () => {
    if (childData.attendance.length === 0) return 0;
    const present = childData.attendance.filter(a => a.status === 'Present').length;
    return Math.round((present / childData.attendance.length) * 100);
  };

  const calculateAverageGrade = () => {
    if (childData.grades.length === 0) return 0;
    const total = childData.grades.reduce((sum, grade) => sum + grade.marks, 0);
    return Math.round(total / childData.grades.length);
  };

  const getGradeColor = (marks) => {
    if (marks >= 90) return 'success';
    if (marks >= 80) return 'primary';
    if (marks >= 70) return 'warning';
    return 'error';
  };

  const getAttendanceColor = (status) => {
    switch (status) {
      case 'Present': return 'success';
      case 'Absent': return 'error';
      case 'Late': return 'warning';
      default: return 'default';
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Child Progress</Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Child Progress Report
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <SchoolIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{calculateAttendancePercentage()}%</Typography>
                  <Typography variant="body2" color="text.secondary">Attendance</Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={calculateAttendancePercentage()} 
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <TrendingUpIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{calculateAverageGrade()}%</Typography>
                  <Typography variant="body2" color="text.secondary">Average Grade</Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={calculateAverageGrade()} 
                sx={{ mt: 1 }}
                color="success"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <AssignmentIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{childData.assignments.length}</Typography>
                  <Typography variant="body2" color="text.secondary">Assignments</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <ScheduleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{childData.leaveRequests.length}</Typography>
                  <Typography variant="body2" color="text.secondary">Leave Requests</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Attendance" />
          <Tab label="Grades" />
          <Tab label="Assignments" />
          <Tab label="Leave Requests" />
        </Tabs>
      </Box>

      {/* Attendance Tab */}
      {currentTab === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Attendance History</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Marked By</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {childData.attendance.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip
                          label={record.status}
                          color={getAttendanceColor(record.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{record.markedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Grades Tab */}
      {currentTab === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Academic Performance</Typography>
            <List>
              {childData.grades.map((grade) => (
                <ListItem key={grade.id} divider>
                  <ListItemText
                    primary={grade.subject}
                    secondary={`Teacher: ${grade.teacher}`}
                  />
                  <ListItemSecondaryAction>
                    <Chip
                      label={`${grade.marks}%`}
                      color={getGradeColor(grade.marks)}
                      size="small"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Assignments Tab */}
      {currentTab === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Assignment Status</Typography>
            <List>
              {childData.assignments.map((assignment) => (
                <ListItem key={assignment.id} divider>
                  <ListItemText
                    primary={assignment.title}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Subject: {assignment.subject}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Chip
                      icon={assignment.submitted ? <CheckCircleIcon /> : <WarningIcon />}
                      label={assignment.submitted ? 'Submitted' : 'Pending'}
                      color={assignment.submitted ? 'success' : 'warning'}
                      size="small"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Leave Requests Tab */}
      {currentTab === 3 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Leave Request History</Typography>
            <List>
              {childData.leaveRequests.map((request) => (
                <ListItem key={request.id} divider>
                  <ListItemText
                    primary={request.reason}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          From: {new Date(request.startDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          To: {new Date(request.endDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Chip
                      label={request.status}
                      color={
                        request.status === 'Approved' ? 'success' :
                        request.status === 'Rejected' ? 'error' : 'warning'
                      }
                      size="small"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default ChildProgress; 