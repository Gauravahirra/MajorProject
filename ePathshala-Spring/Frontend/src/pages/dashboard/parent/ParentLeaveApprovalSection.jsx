import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Alert, Box, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { getParentChildLeaveStatus, approveLeaveAsParent } from '../../../api/leave';
import { useAuth } from '../../../utils/auth';

function ParentLeaveApprovalSection() {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState('');
  const [approvalStatus, setApprovalStatus] = useState('APPROVED');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const leaveData = await getParentChildLeaveStatus(user?.id);
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

  const handleApproveLeave = async () => {
    if (!selectedLeave) {
      setError('Please select a leave request');
      return;
    }

    setSuccess('');
    setError('');
    try {
      await approveLeaveAsParent({
        leaveId: selectedLeave,
        parentApproval: approvalStatus
      });
      setSelectedLeave('');
      setApprovalStatus('APPROVED');
      setSuccess('Leave request updated successfully!');
      fetchData();
    } catch (err) {
      setError('Error updating leave request');
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
          Child Leave Requests
        </Typography>
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
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

export default React.memo(ParentLeaveApprovalSection); 