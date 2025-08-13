import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, FormControl, InputLabel, Select, MenuItem, TextField, Button, Alert } from '@mui/material';
import { getAttendanceByClass, getStudentsByClass, markAttendance } from '../../../api/attendance';
import { useAuth } from '../../../utils/auth';

function TeacherAttendanceSection() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceForm, setAttendanceForm] = useState({ studentId: '', date: '', status: 'PRESENT' });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const className = user?.assignedClass || 'Class 10A'; // Use dynamic class from user profile

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [attendanceData, studentsData] = await Promise.all([
        getAttendanceByClass(className),
        getStudentsByClass(className)
      ]);
      setAttendance(Array.isArray(attendanceData) ? attendanceData : []);
      setStudents(Array.isArray(studentsData) ? studentsData : []);
    } catch (err) {
      setError('Failed to load attendance or students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (className) {
      fetchData();
    }
  }, [className]);

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      await markAttendance(attendanceForm);
      setAttendanceForm({ studentId: '', date: '', status: 'PRESENT' });
      setSuccess('Attendance marked successfully!');
      fetchData();
    } catch (err) {
      setError('Error marking attendance');
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Mark Attendance
        </Typography>
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleMarkAttendance}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Student</InputLabel>
            <Select
              value={attendanceForm.studentId}
              onChange={(e) => setAttendanceForm({ ...attendanceForm, studentId: e.target.value })}
              label="Student"
              required
            >
              {students.map((student) => (
                <MenuItem key={student.id} value={student.id}>
                  {student.name} ({student.studentClass})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            type="date"
            label="Date"
            value={attendanceForm.date}
            onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={attendanceForm.status}
              onChange={(e) => setAttendanceForm({ ...attendanceForm, status: e.target.value })}
              label="Status"
            >
              <MenuItem value="PRESENT">Present</MenuItem>
              <MenuItem value="ABSENT">Absent</MenuItem>
              <MenuItem value="LATE">Late</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled={loading}>
            Mark Attendance
          </Button>
        </form>
        <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>
          Class Attendance
        </Typography>
        <List>
          {attendance && attendance.length > 0 ? (
            attendance.map((record, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`Student: ${record.studentName}`}
                  secondary={`Date: ${record.date} | Status: ${record.status}`}
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No attendance records found" />
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );
}

export default React.memo(TeacherAttendanceSection);