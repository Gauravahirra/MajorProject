import React from 'react';
import { Grid, Card, CardActionArea, CardContent, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/auth';
import ParentOverview from '../../components/dashboard/ParentOverview';
import {
  Person as PersonIcon,
  Event as EventIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

function ParentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const dashboardCards = [
    {
      title: 'Child Progress',
      description: 'Monitor your child\'s academic performance, grades, and attendance',
      icon: PersonIcon,
      path: '/parent/child-progress',
      color: '#1976d2'
    },
    {
      title: 'Leave Approvals',
      description: 'Review and approve your child\'s leave requests',
      icon: ScheduleIcon,
      path: '/parent/leave-approvals',
      color: '#f57c00'
    },
    {
      title: 'Academic Calendar',
      description: 'View upcoming events, holidays, and important dates',
      icon: EventIcon,
      path: '/parent/calendar',
      color: '#388e3c'
    }
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <Box>
      {/* Overview Component */}
      <ParentOverview />
      
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
          Access detailed information and manage your child's academic activities
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

export default ParentDashboard;