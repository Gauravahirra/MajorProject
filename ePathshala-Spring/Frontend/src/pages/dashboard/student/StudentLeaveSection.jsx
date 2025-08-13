import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, TextField, Button, Alert, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { submitLeave, getStudentLeaveStatus } from '../../../api/leave';
import { useAuth } from '../../../utils/auth';

function StudentLeaveSection() {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveForm, setLeaveForm] = useState({ fromDate: '', toDate: '', reason: '' });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const leaveData = await getStudentLeaveStatus(user?.id);
      setLeaveRequests(Array.isArray(leaveData) ? leaveData : []);
    } catch (err) {
      setError('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      await submitLeave({
        ...leaveForm,
        studentId: user?.id
      });
      setLeaveForm({ fromDate: '', toDate: '', reason: '' });
      setSuccess('Leave request submitted successfully!');
      fetchData();
    } catch (err) {
      setError('Error submitting leave request');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'error';
      case 'PENDING': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Leave Requests
        </Typography>
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <form onSubmit={handleSubmitLeave}>
          <TextField
            fullWidth
            type="date"
            label="From Date"
            value={leaveForm.fromDate}
            onChange={(e) => setLeaveForm({ ...leaveForm, fromDate: e.target.value })}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            type="date"
            label="To Date"
            value={leaveForm.toDate}
            onChange={(e) => setLeaveForm({ ...leaveForm, toDate: e.target.value })}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Reason"
            value={leaveForm.reason}
            onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
            margin="normal"
            required
            multiline
            rows={3}
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled={loading}>
            Submit Leave Request
          </Button>
        </form>

        <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>
          My Leave Requests
        </Typography>
        <List>
          {leaveRequests && leaveRequests.length > 0 ? (
            leaveRequests.map((leave, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={`Leave Request - ${leave.fromDate} to ${leave.toDate}`}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        Reason: {leave.reason}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="text.secondary">
                        Teacher Approval: {leave.teacherApproval || 'Pending'} | 
                        Parent Approval: {leave.parentApproval || 'Pending'}
                      </Typography>
                    </>
                  }
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Typography
                    variant="body2"
                    color={getStatusColor(leave.status)}
                    sx={{ fontWeight: 'bold' }}
                  >
                    {leave.status || 'PENDING'}
                  </Typography>
                </Box>
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No leave requests found" />
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );
}

export default React.memo(StudentLeaveSection); 