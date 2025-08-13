import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, TextField, Button, Alert, List, ListItem, ListItemText, Box } from '@mui/material';
import { uploadAssignment } from '../../../api/assignments';

function TeacherAssignmentsSection() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const assignedClass = user.assignedClass || user.className || user.class || 'Class 10A';

  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    subject: '',
    className: assignedClass
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/assignments/class/Class 10A', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadAssignment = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      await uploadAssignment({
        title: assignmentForm.title,
        description: assignmentForm.description,
        dueDate: assignmentForm.dueDate,
        subject: assignmentForm.subject,
        className: assignmentForm.className,
        file: selectedFile
      });
      setAssignmentForm({ title: '', description: '', dueDate: '', subject: '', className: assignedClass });
      setSelectedFile(null);
      setSuccess('Assignment uploaded successfully!');
      fetchData();
    } catch (err) {
      setError('Error uploading assignment');
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Upload Assignment
        </Typography>
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleUploadAssignment}>
          <TextField
            fullWidth
            label="Title"
            value={assignmentForm.title}
            onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={assignmentForm.description}
            onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
            margin="normal"
            required
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            type="date"
            label="Due Date"
            value={assignmentForm.dueDate}
            onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Subject"
            value={assignmentForm.subject}
            onChange={(e) => setAssignmentForm({ ...assignmentForm, subject: e.target.value })}
            margin="normal"
            required
          />
          <input type="hidden" name="className" value={assignmentForm.className} />
          <Box sx={{ mt: 2, mb: 2 }}>
            <input
              accept=".pdf,.doc,.docx,.txt"
              style={{ display: 'none' }}
              id="assignment-file"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="assignment-file">
              <Button variant="outlined" component="span">
                Choose File
              </Button>
            </label>
            {selectedFile && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected: {selectedFile.name}
              </Typography>
            )}
          </Box>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled={loading}>
            Upload Assignment
          </Button>
        </form>
        <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>
          Class Assignments
        </Typography>
        <List>
          {assignments && assignments.length > 0 ? (
            assignments.map((assignment, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={assignment.title}
                  secondary={`Due: ${assignment.dueDate} | Subject: ${assignment.subject}`}
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No assignments found" />
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );
}

export default React.memo(TeacherAssignmentsSection); 