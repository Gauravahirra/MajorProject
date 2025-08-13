import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Alert, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, List, ListItem, ListItemText } from '@mui/material';
import { getParentChildGrades } from '../../../api/grades';
import { getParentChildAttendance } from '../../../api/attendance';
import { useAuth } from '../../../utils/auth';

function ParentChildProgressSection() {
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTab, setCurrentTab] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [gradesData, attendanceData] = await Promise.all([
        getParentChildGrades(user?.id),
        getParentChildAttendance(user?.id)
      ]);
      setGrades(Array.isArray(gradesData) ? gradesData : []);
      setAttendance(Array.isArray(attendanceData) ? attendanceData : []);
    } catch (err) {
      setError('Failed to load child progress data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const calculateAverageGrade = () => {
    if (grades.length === 0) return 0;
    const total = grades.reduce((sum, grade) => sum + parseFloat(grade.marks), 0);
    return (total / grades.length).toFixed(2);
  };

  const calculateAttendancePercentage = () => {
    if (attendance.length === 0) return 0;
    const presentCount = attendance.filter(record => record.status === 'PRESENT').length;
    return ((presentCount / attendance.length) * 100).toFixed(1);
  };

  const getGradeColor = (marks) => {
    if (marks >= 90) return 'success';
    if (marks >= 80) return 'primary';
    if (marks >= 70) return 'warning';
    return 'error';
  };

  const getGradeLetter = (marks) => {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B';
    if (marks >= 60) return 'C';
    if (marks >= 50) return 'D';
    return 'F';
  };

  const getAttendanceColor = (status) => {
    switch (status) {
      case 'PRESENT': return 'success';
      case 'ABSENT': return 'error';
      case 'LATE': return 'warning';
      default: return 'default';
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Child Progress Overview
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        {/* Summary Cards */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Card sx={{ flex: 1, bgcolor: 'grey.50' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {calculateAverageGrade()}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Grade
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1, bgcolor: 'grey.50' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {calculateAttendancePercentage()}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Attendance Rate
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Tabs */}
        <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="Grades" />
          <Tab label="Attendance" />
        </Tabs>

        {/* Grades Tab */}
        {currentTab === 0 && (
          <List>
            {grades && grades.length > 0 ? (
              grades.map((grade, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={grade.subject}
                    secondary={`Teacher: ${grade.teacherName || 'Unknown'}`}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {grade.marks}%
                    </Typography>
                    <Chip 
                      label={getGradeLetter(grade.marks)} 
                      color={getGradeColor(grade.marks)}
                      size="small"
                    />
                  </Box>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No grades available yet" />
              </ListItem>
            )}
          </List>
        )}

        {/* Attendance Tab */}
        {currentTab === 1 && (
          <List>
            {attendance && attendance.length > 0 ? (
              attendance.map((record, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={`${record.date} - ${record.status}`}
                    secondary={`Marked by: ${record.markedByTeacher || 'Unknown'}`}
                  />
                  <Chip 
                    label={record.status}
                    color={getAttendanceColor(record.status)}
                    size="small"
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No attendance records found" />
              </ListItem>
            )}
          </List>
        )}
      </CardContent>
    </Card>
  );
}

export default React.memo(ParentChildProgressSection); 