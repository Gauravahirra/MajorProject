import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, FormControl, InputLabel, Select, MenuItem, Button, Alert } from '@mui/material';
import { getLeavesByClass, approveLeaveAsTeacher } from '../../../api/leave';
import { useAuth } from '../../../utils/auth';

function TeacherLeaveRequestsSection() {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState('');
  const [approvalStatus, setApprovalStatus] = useState('APPROVED');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const className = user?.assignedClass || 'Class 10A'; // Use dynamic class from user profile

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const leavesData = await getLeavesByClass(className);
      setLeaveRequests(Array.isArray(leavesData) ? leavesData : []);
    } catch (err) {
      setError('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (className) {
      fetchData();
    }
  }, [className]);

  const handleApproveLeave = async () => {
    if (!selectedLeave) {
      setError('Please select a leave request');
      return;
    }

    setSuccess('');
    setError('');
    try {
      await approveLeaveAsTeacher({
        leaveId: selectedLeave,
        teacherApproval: approvalStatus
      });
      setSelectedLeave('');
      setApprovalStatus('APPROVED');
      setSuccess('Leave request updated successfully!');
      fetchData();
    } catch (err) {
      setError('Error updating leave request');
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
        
        <List>
          {leaveRequests && leaveRequests.length > 0 ? (
            leaveRequests.map((leave, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`Student: ${leave.studentName}`}
                  secondary={`Reason: ${leave.reason} | From: ${leave.fromDate} | To: ${leave.toDate}`}
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No leave requests found" />
            </ListItem>
          )}
        </List>

        <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>
          Approve Leave Request
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Leave Request</InputLabel>
          <Select
            value={selectedLeave}
            onChange={(e) => setSelectedLeave(e.target.value)}
            label="Select Leave Request"
          >
            {leaveRequests.map((leave, index) => (
              <MenuItem key={index} value={leave.id}>
                {leave.studentName} - {leave.reason} ({leave.fromDate} to {leave.toDate})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Approval Status</InputLabel>
          <Select
            value={approvalStatus}
            onChange={(e) => setApprovalStatus(e.target.value)}
            label="Approval Status"
          >
            <MenuItem value="APPROVED">Approve</MenuItem>
            <MenuItem value="REJECTED">Reject</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
          </Select>
        </FormControl>
        <Button 
          onClick={handleApproveLeave} 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }} 
          disabled={loading || !selectedLeave}
        >
          Update Leave Request
        </Button>
      </CardContent>
    </Card>
  );
}

export default React.memo(TeacherLeaveRequestsSection); 