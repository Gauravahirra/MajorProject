import React from 'react';
import { Grid, Card, CardActionArea, CardContent, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/auth';
import TeacherOverview from '../../components/dashboard/TeacherOverview';
import {
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Quiz as QuizIcon,
  Grade as GradeIcon,
  Schedule as ScheduleIcon,
  Event as EventIcon,
  VideoCall as VideoCallIcon
} from '@mui/icons-material';

function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const dashboardCards = [
    {
      title: 'Attendance Management',
      description: 'Mark and track student attendance for all your classes',
      icon: PersonIcon,
      path: '/teacher/attendance',
      color: '#1976d2'
    },
    {
      title: 'Assignment Management',
      description: 'Create, assign, and grade student assignments',
      icon: AssignmentIcon,
      path: '/teacher/assignments',
      color: '#f57c00'
    },
    {
      title: 'Exam Management',
      description: 'Create and manage online exams and assessments',
      icon: QuizIcon,
      path: '/teacher/exams',
      color: '#d32f2f'
    },
    {
      title: 'Grade Management',
      description: 'Enter and manage student grades and performance',
      icon: GradeIcon,
      path: '/teacher/grades',
      color: '#388e3c'
    },
    {
      title: 'Leave Requests',
      description: 'Review and approve student leave requests',
      icon: ScheduleIcon,
      path: '/teacher/leave-requests',
      color: '#7b1fa2'
    },
    {
      title: 'Academic Calendar',
      description: 'View and manage academic events and schedules',
      icon: EventIcon,
      path: '/teacher/calendar',
      color: '#ff9800'
    },
    {
      title: 'Online Classes',
      description: 'Schedule and conduct virtual classroom sessions',
      icon: VideoCallIcon,
      path: '/teacher/online-classes',
      color: '#009688'
    }
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <Box>
      {/* Overview Component */}
      <TeacherOverview />
      
      {/* Quick Access Cards */}
      <Box sx={{ mt: { xs: 3, md: 4 } }}>
        <Typography 
          variant="h5" 
          gutterBottom 
          fontWeight="bold"
          sx={{ fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' } }}
        >
          Quick Access
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ 
            mb: { xs: 2, md: 3 },
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}
        >
          Access all your teaching tools and manage your classes efficiently
        </Typography>
        
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {dashboardCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardActionArea 
                  onClick={() => handleCardClick(card.path)}
                  sx={{ height: '100%', p: { xs: 2, sm: 3 } }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 1.5, sm: 2 } }}>
                      <card.icon sx={{ 
                        fontSize: { xs: 36, sm: 48, md: 48 }, 
                        color: card.color 
                      }} />
                    </Box>
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      fontWeight="bold"
                      sx={{ 
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                        mb: { xs: 1, sm: 1.5 }
                      }}
                    >
                      {card.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
                    >
                      {card.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default TeacherDashboard; 