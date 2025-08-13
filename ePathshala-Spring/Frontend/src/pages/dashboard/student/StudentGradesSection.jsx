import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Alert, Box, Chip } from '@mui/material';
import { getStudentGrades } from '../../../api/grades';
import { useAuth } from '../../../utils/auth';

function StudentGradesSection() {
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const gradesData = await getStudentGrades(user?.id);
      setGrades(Array.isArray(gradesData) ? gradesData : []);
    } catch (err) {
      setError('Failed to load grades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

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

  const calculateAverage = () => {
    if (grades.length === 0) return 0;
    const total = grades.reduce((sum, grade) => sum + parseFloat(grade.marks), 0);
    return (total / grades.length).toFixed(2);
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          My Grades
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        {grades.length > 0 && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Overall Performance
            </Typography>
            <Typography variant="h4" color="primary">
              {calculateAverage()}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Average across {grades.length} subjects
            </Typography>
          </Box>
        )}
        
        <List>
          {grades && grades.length > 0 ? (
            grades.map((grade, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={grade.subject}
                  secondary={
                    <React.Fragment>
                      <Typography component="span" variant="body2" color="text.primary" sx={{ display: 'block', mb: 1 }}>
                        Marks: {grade.marks}
                      </Typography>
                      <Chip 
                        label={getGradeLetter(grade.marks)} 
                        color={getGradeColor(grade.marks)}
                        size="small"
                      />
                    </React.Fragment>
                  }
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No grades available yet" />
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );
}

export default React.memo(StudentGradesSection); 