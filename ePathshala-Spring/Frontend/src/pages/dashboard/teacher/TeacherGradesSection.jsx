import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, FormControl, InputLabel, Select, MenuItem, TextField, Button, Alert } from '@mui/material';
import { getGradesByClass, getStudentsByClass, enterGrade } from '../../../api/grades';
import { useAuth } from '../../../utils/auth';

function TeacherGradesSection() {
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [gradeForm, setGradeForm] = useState({ studentId: '', subject: '', marks: '', remarks: '' });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const className = user?.assignedClass || 'Class 10A'; // Use dynamic class from user profile

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [gradesData, studentsData] = await Promise.all([
        getGradesByClass(className),
        getStudentsByClass(className)
      ]);
      setGrades(Array.isArray(gradesData) ? gradesData : []);
      setStudents(Array.isArray(studentsData) ? studentsData : []);
    } catch (err) {
      setError('Failed to load grades or students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (className) {
      fetchData();
    }
  }, [className]);

  const handleEnterGrade = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      await enterGrade(gradeForm);
      setGradeForm({ studentId: '', subject: '', marks: '', remarks: '' });
      setSuccess('Grade entered successfully!');
      fetchData();
    } catch (err) {
      setError('Error entering grade');
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Enter Grades
        </Typography>
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleEnterGrade}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Student</InputLabel>
            <Select
              value={gradeForm.studentId}
              onChange={(e) => setGradeForm({ ...gradeForm, studentId: e.target.value })}
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
            label="Subject"
            value={gradeForm.subject}
            onChange={(e) => setGradeForm({ ...gradeForm, subject: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Marks"
            type="number"
            value={gradeForm.marks}
            onChange={(e) => setGradeForm({ ...gradeForm, marks: e.target.value })}
            margin="normal"
            required
            inputProps={{ min: 0, max: 100 }}
          />
          <TextField
            fullWidth
            label="Remarks"
            value={gradeForm.remarks}
            onChange={(e) => setGradeForm({ ...gradeForm, remarks: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled={loading}>
            Enter Grade
          </Button>
        </form>
        <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>
          Class Grades
        </Typography>
        <List>
          {grades && grades.length > 0 ? (
            grades.map((grade, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`Student: ${grade.studentName}`}
                  secondary={`Subject: ${grade.subject} | Marks: ${grade.marks}`}
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No grades found" />
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );
}

export default React.memo(TeacherGradesSection); 