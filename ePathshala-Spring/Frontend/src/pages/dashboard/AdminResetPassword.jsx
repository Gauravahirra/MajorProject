import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';

function AdminResetPassword() {
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const onResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResetMessage('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/password/reset?email=${encodeURIComponent(resetEmail)}&newPassword=${encodeURIComponent(newPassword)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setResetMessage('Password reset successfully!');
        setResetEmail('');
        setNewPassword('');
      } else {
        setResetMessage(data.error || data.message || 'Password reset failed');
      }
    } catch (error) {
      setResetMessage('Error resetting password: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={onResetPassword} sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>Reset User Password</Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          label="User Email"
          value={resetEmail}
          onChange={e => setResetEmail(e.target.value)}
          required
        />
        <TextField
          label="New Password"
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </Box>
      {resetMessage && (
        <Alert severity={resetMessage.includes('successfully') ? 'success' : 'error'} sx={{ mt: 2 }}>
          {resetMessage}
        </Alert>
      )}
    </Box>
  );
}

export default React.memo(AdminResetPassword);