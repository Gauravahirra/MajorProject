import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useAuth } from '../../utils/auth';

function UserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState({ students: [], teachers: [], parents: [] });
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    studentClass: '',
    subject: '',
    assignedClass: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const [studentsRes, teachersRes, parentsRes] = await Promise.all([
        fetch('/api/admin/students', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }),
        fetch('/api/admin/teachers', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }),
        fetch('/api/admin/parents', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      ]);

      const students = await studentsRes.json();
      const teachers = await teachersRes.json();
      const parents = await parentsRes.json();

      setUsers({ students, teachers, parents });
    } catch (error) {
      setError('Failed to load users');
    }
  };

  const handleAddUser = (type) => {
    setDialogType(type);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: type.toUpperCase(),
      studentClass: '',
      subject: '',
      assignedClass: ''
    });
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      const endpoint = `/api/admin/add-${dialogType.slice(0, -1)}`;
      
      // Filter the data to only include fields that the backend expects
      let filteredData = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };
      
      // Add role-specific fields
      if (dialogType === 'student') {
        filteredData.studentClass = formData.studentClass;
      } else if (dialogType === 'teacher') {
        filteredData.subject = formData.subject;
        filteredData.assignedClass = formData.assignedClass;
      }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(filteredData)
      });

      if (response.ok) {
        setOpenDialog(false);
        loadUsers();
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to add user');
      }
    } catch (error) {
      setError('Failed to add user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/api/admin/user/${userId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (response.ok) {
          loadUsers();
        } else {
          setError('Failed to delete user');
        }
      } catch (error) {
        setError('Failed to delete user');
      }
    }
  };

  const renderUserList = (userList, type) => (
    <List>
      {userList.map((user) => (
        <ListItem key={user.id} divider>
          <ListItemText
            primary={user.name}
            secondary={
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
                {user.studentClass && (
                  <Chip label={`Class: ${user.studentClass}`} size="small" sx={{ mr: 1 }} />
                )}
                {user.subject && (
                  <Chip label={`Subject: ${user.subject}`} size="small" sx={{ mr: 1 }} />
                )}
                {user.assignedClass && (
                  <Chip label={`Assigned: ${user.assignedClass}`} size="small" />
                )}
              </Box>
            }
          />
          <ListItemSecondaryAction>
            <IconButton edge="end" onClick={() => handleDeleteUser(user.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
        {/* Students */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Students ({users.students.length})</Typography>
              <Button variant="contained" onClick={() => handleAddUser('student')}>
                Add Student
              </Button>
            </Box>
            {renderUserList(users.students, 'student')}
          </CardContent>
        </Card>

        {/* Teachers */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Teachers ({users.teachers.length})</Typography>
              <Button variant="contained" onClick={() => handleAddUser('teacher')}>
                Add Teacher
              </Button>
            </Box>
            {renderUserList(users.teachers, 'teacher')}
          </CardContent>
        </Card>

        {/* Parents */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Parents ({users.parents.length})</Typography>
              <Button variant="contained" onClick={() => handleAddUser('parent')}>
                Add Parent
              </Button>
            </Box>
            {renderUserList(users.parents, 'parent')}
          </CardContent>
        </Card>
      </Box>

      {/* Add User Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add {dialogType}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            margin="normal"
          />
          {dialogType === 'student' && (
            <TextField
              fullWidth
              label="Class"
              value={formData.studentClass}
              onChange={(e) => setFormData({ ...formData, studentClass: e.target.value })}
              margin="normal"
            />
          )}
          {dialogType === 'teacher' && (
            <>
              <TextField
                fullWidth
                label="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Assigned Class"
                value={formData.assignedClass}
                onChange={(e) => setFormData({ ...formData, assignedClass: e.target.value })}
                margin="normal"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserManagement; 