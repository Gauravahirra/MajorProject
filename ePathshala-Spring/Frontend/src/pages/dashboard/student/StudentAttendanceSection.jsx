import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Alert } from '@mui/material';
import { getStudentAttendance } from '../../../api/attendance';
import { useAuth } from '../../../utils/auth';

function StudentAttendanceSection() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const attendanceData = await getStudentAttendance(user?.id);
      setAttendance(Array.isArray(attendanceData) ? attendanceData : []);
    } catch (err) {
      setError('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const calculateAttendancePercentage = () => {
    if (attendance.length === 0) return 0;
    const presentCount = attendance.filter(record => record.status === 'PRESENT').length;
    return ((presentCount / attendance.length) * 100).toFixed(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PRESENT': return 'success';
      case 'ABSENT': return 'error';
      case 'LATE': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          My Attendance
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        {attendance.length > 0 && (
          <Typography variant="body1" sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            Overall Attendance: <strong>{calculateAttendancePercentage()}%</strong>
          </Typography>
        )}
        
        <List>
          {attendance && attendance.length > 0 ? (
            attendance.map((record, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={`${record.date} - ${record.status}`}
                  secondary={`Marked by: ${record.markedByTeacher || 'Unknown'}`}
                />
                <Typography
                  variant="body2"
                  color={getStatusColor(record.status)}
                  sx={{ fontWeight: 'bold' }}
                >
                  {record.status}
                </Typography>
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

export default React.memo(StudentAttendanceSection); 