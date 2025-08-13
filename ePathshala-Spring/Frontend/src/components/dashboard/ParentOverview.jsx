import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Person as PersonIcon,
  Event as EventIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  FamilyRestroom as FamilyIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const statsCards = [
  {
    title: 'Child Average Grade',
    value: '90.86%',
    icon: TrendingUpIcon,
    color: '#388e3c',
    description: 'Overall academic performance'
  },
  {
    title: 'Attendance Rate',
    value: '60.0%',
    icon: PersonIcon,
    color: '#1976d2',
    description: 'Current attendance'
  },
  {
    title: 'Pending Approvals',
    value: '6',
    icon: ScheduleIcon,
    color: '#f57c00',
    description: 'Leave requests to approve'
  },
  {
    title: 'Upcoming Events',
    value: '3',
    icon: EventIcon,
    color: '#d32f2f',
    description: 'Academic calendar events'
  }
];

const recentActivities = [
  {
    type: 'grade',
    text: 'Child received A+ in Science',
    time: '2 hours ago',
    status: 'completed'
  },
  {
    type: 'leave',
    text: 'Leave request approved for child',
    time: '1 day ago',
    status: 'completed'
  },
  {
    type: 'attendance',
    text: 'Child marked present today',
    time: '2 days ago',
    status: 'completed'
  },
  {
    type: 'event',
    text: 'Parent-Teacher meeting scheduled',
    time: '3 days ago',
    status: 'pending'
  }
];

const quickActions = [
  {
    label: 'View Child Progress',
    icon: PersonIcon,
    path: '/parent/child-progress'
  },
  {
    label: 'Approve Leave Requests',
    icon: ScheduleIcon,
    path: '/parent/leave-approvals'
  },
  {
    label: 'Check Calendar',
    icon: EventIcon,
    path: '/parent/calendar'
  }
];

function ParentOverview() {
  const navigate = useNavigate();

  const getActivityIcon = (type) => {
    switch (type) {
      case 'grade': return <TrendingUpIcon color="success" />;
      case 'leave': return <ScheduleIcon color="primary" />;
      case 'attendance': return <PersonIcon color="info" />;
      case 'event': return <EventIcon color="warning" />;
      default: return <CheckCircleIcon />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon color="success" />;
      case 'pending': return <WarningIcon color="warning" />;
      default: return <CheckCircleIcon />;
    }
  };

  const handleQuickActionClick = (path) => {
    navigate(path);
  };

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography 
          variant="h4" 
          gutterBottom 
          fontWeight="bold"
          sx={{ fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' } }}
        >
          Welcome back!
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
        >
          Monitor your child's academic progress and stay connected with the school
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
        {statsCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', bgcolor: 'grey.50' }}>
              <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 1, sm: 2 } }}>
                  <card.icon sx={{ fontSize: { xs: 32, sm: 40 }, color: card.color }} />
                </Box>
                <Typography 
                  variant="h4" 
                  fontWeight="bold" 
                  color="primary"
                  sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}
                >
                  {card.value}
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' }
                  }}
                >
                  {card.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}
                >
                  {card.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                Recent Activities
              </Typography>
              <List sx={{ p: 0 }}>
                {recentActivities.map((activity, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0, py: { xs: 1, sm: 1.5 } }}>
                      <ListItemIcon sx={{ minWidth: { xs: 36, sm: 40 } }}>
                        {getActivityIcon(activity.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.text}
                        secondary={activity.time}
                        primaryTypographyProps={{
                          fontSize: { xs: '0.85rem', sm: '0.9rem' }
                        }}
                        secondaryTypographyProps={{
                          fontSize: { xs: '0.75rem', sm: '0.8rem' }
                        }}
                      />
                      <Box>
                        {getStatusIcon(activity.status)}
                      </Box>
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
                {quickActions.map((action, index) => (
                  <Chip
                    key={index}
                    icon={<action.icon />}
                    label={action.label}
                    onClick={() => handleQuickActionClick(action.path)}
                    sx={{
                      justifyContent: 'flex-start',
                      height: 'auto',
                      padding: { xs: 1.5, sm: 2 },
                      fontSize: { xs: '0.85rem', sm: '0.9rem' },
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'primary.contrastText'
                      }
                    }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ParentOverview;
