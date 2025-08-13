import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Quiz as QuizIcon,
  Assessment as AssessmentIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { useAuth } from '../../utils/auth';
import FacultyExamManager from '../../components/exam/FacultyExamManager';
import StudentExamInterface from '../../components/exam/StudentExamInterface';

const ExamDashboard = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const isTeacher = user?.role === 'TEACHER' || user?.role === 'FACULTY';
  const isStudent = user?.role === 'STUDENT';
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    // Set appropriate tab based on user role
    if (isTeacher) {
      setCurrentTab(0); // Faculty Exam Management
    } else if (isStudent) {
      setCurrentTab(1); // Student Exam Interface
    } else if (isAdmin) {
      setCurrentTab(2); // Admin Overview
    }
  }, [user, isTeacher, isStudent, isAdmin]);

  if (!user) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Exam Management System
      </Typography>
      
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Welcome, {user?.name}! ({user?.role})
      </Typography>

      {/* Role-based interface */}
      {isTeacher && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Faculty Exam Management
          </Typography>
          <FacultyExamManager />
        </Box>
      )}

      {isStudent && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Student Exam Center
          </Typography>
          <StudentExamInterface />
        </Box>
      )}

      {isAdmin && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Admin Exam Overview
          </Typography>
          
          <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)} sx={{ mb: 3 }}>
            <Tab label="Faculty Management" icon={<SchoolIcon />} />
            <Tab label="Student Interface" icon={<QuizIcon />} />
            <Tab label="System Overview" icon={<AssessmentIcon />} />
          </Tabs>

          {currentTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Faculty Exam Management
              </Typography>
              <FacultyExamManager />
            </Box>
          )}

          {currentTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Student Exam Interface
              </Typography>
              <StudentExamInterface />
            </Box>
          )}

          {currentTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                System Overview
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Exam Statistics
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Exams: Loading...
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Exams: Loading...
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Completed Exams: Loading...
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6} lg={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Student Performance
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Average Score: Loading...
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pass Rate: Loading...
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Attempts: Loading...
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6} lg={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        System Status
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Database: Connected
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        API Status: Operational
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Last Updated: {new Date().toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      )}

      {!isTeacher && !isStudent && !isAdmin && (
        <Alert severity="warning">
          You don't have permission to access exam management features.
        </Alert>
      )}
    </Box>
  );
};

export default ExamDashboard; 