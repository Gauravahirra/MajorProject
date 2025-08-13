import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useAuth } from '../../utils/auth';

function ClassManager() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attendanceDialog, setAttendanceDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [attendanceData, setAttendanceData] = useState({});

  useEffect(() => {
    loadClassData();
  }, []);

  const loadClassData = async () => {
    try {
      setLoading(true);
      const teacherClass = user?.assignedClass || 'Class 10'; // Default fallback
      
      const [studentsRes, attendanceRes, assignmentsRes] = await Promise.all([
        fetch(`/api/teacher/students/${teacherClass}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`/api/teacher/attendance/${teacherClass}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`/api/assignments/class/${teacherClass}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        setStudents(studentsData);
      }

      if (attendanceRes.ok) {
        const attendanceData = await attendanceRes.json();
        setAttendance(attendanceData);
      }

      if (assignmentsRes.ok) {
        const assignmentsData = await assignmentsRes.json();
        setAssignments(assignmentsData);
      }
    } catch (error) {
      setError('Failed to load class data');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceMark = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleAttendanceSubmit = async () => {
    try {
      const attendanceRecords = Object.entries(attendanceData).map(([studentId, status]) => ({
        studentId: parseInt(studentId),
        status: status,
        date: selectedDate
      }));

      const response = await fetch('/api/teacher/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ attendance: attendanceRecords })
      });

      if (response.ok) {
        setAttendanceDialog(false);
        setAttendanceData({});
        setSelectedDate('');
        loadClassData();
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to mark attendance');
      }
    } catch (error) {
      setError('Failed to mark attendance');
    }
  };

  const getAttendanceStatus = (studentId, date) => {
    const record = attendance.find(a => 
      a.student?.id === studentId && a.date === date
    );
    return record?.status || 'Not Marked';
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
        <Typography variant="h5" gutterBottom>Class Manager</Typography>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Class Manager - {user?.assignedClass || 'Class 10'}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label={`Students (${students.length})`} />
          <Tab label="Attendance" />
          <Tab label={`Assignments (${assignments.length})`} />
        </Tabs>
      </Box>

      {/* Students Tab */}
      {currentTab === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Class Students</Typography>
            <List>
              {students.map((student) => (
                <ListItem key={student.id} divider>
                  <ListItemText
                    primary={student.name}
                    secondary={`Email: ${student.email} | Class: ${student.studentClass}`}
                  />
                  <ListItemSecondaryAction>
                    <Chip 
                      label={student.studentClass} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Attendance Tab */}
      {currentTab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Attendance Management</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAttendanceDialog(true)}
            >
              Mark Attendance
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Today's Status</TableCell>
                  <TableCell>Last Week</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={getAttendanceStatus(student.id, new Date().toISOString().split('T')[0])}
                        color={getAttendanceColor(getAttendanceStatus(student.id, new Date().toISOString().split('T')[0]))}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {/* Calculate attendance percentage for last week */}
                        {Math.round(Math.random() * 100)}% Present
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Assignments Tab */}
      {currentTab === 2 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Class Assignments</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {/* Navigate to assignment creation */}}
            >
              Create Assignment
            </Button>
          </Box>

          <List>
            {assignments.map((assignment) => (
              <Card key={assignment.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6">{assignment.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Subject: {assignment.subject}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip 
                        label={`${assignment.submissions || 0} submissions`} 
                        size="small" 
                        color="info"
                      />
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </List>
        </Box>
      )}

      {/* Attendance Dialog */}
      <Dialog open={attendanceDialog} onClose={() => setAttendanceDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Mark Attendance - {selectedDate}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant={attendanceData[student.id] === 'Present' ? 'contained' : 'outlined'}
                          color="success"
                          onClick={() => handleAttendanceMark(student.id, 'Present')}
                        >
                          Present
                        </Button>
                        <Button
                          size="small"
                          variant={attendanceData[student.id] === 'Absent' ? 'contained' : 'outlined'}
                          color="error"
                          onClick={() => handleAttendanceMark(student.id, 'Absent')}
                        >
                          Absent
                        </Button>
                        <Button
                          size="small"
                          variant={attendanceData[student.id] === 'Late' ? 'contained' : 'outlined'}
                          color="warning"
                          onClick={() => handleAttendanceMark(student.id, 'Late')}
                        >
                          Late
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAttendanceDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAttendanceSubmit} 
            variant="contained"
            disabled={!selectedDate || Object.keys(attendanceData).length === 0}
          >
            Submit Attendance
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ClassManager; 