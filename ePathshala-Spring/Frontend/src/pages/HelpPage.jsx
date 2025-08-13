import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Fade
} from '@mui/material';
import {
  Help as HelpIcon,
  SmartToy as ChatbotIcon,
  ContactSupport as ContactIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  FamilyRestroom as FamilyIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function HelpPage() {
  const navigate = useNavigate();

  const helpSections = [
    {
      title: 'Getting Started',
      icon: SchoolIcon,
      items: [
        'How to log in to your account',
        'Understanding your dashboard',
        'Navigating the platform',
        'Updating your profile'
      ]
    },
    {
      title: 'For Students',
      icon: PersonIcon,
      items: [
        'Taking exams and assignments',
        'Viewing grades and progress',
        'Submitting leave requests',
        'Joining online classes'
      ]
    },
    {
      title: 'For Teachers',
      icon: AdminIcon,
      items: [
        'Creating and managing exams',
        'Grading assignments',
        'Taking attendance',
        'Managing online classes'
      ]
    },
    {
      title: 'For Parents',
      icon: FamilyIcon,
      items: [
        'Viewing child progress',
        'Approving leave requests',
        'Checking attendance',
        'Communication with teachers'
      ]
    }
  ];

  const quickActions = [
    {
      title: 'AI Chatbot Assistant',
      description: 'Get instant answers to your questions',
      icon: ChatbotIcon,
      color: '#667eea',
      action: () => navigate('/chatbot')
    },
    {
      title: 'Contact Support',
      description: 'Reach out to our support team',
      icon: ContactIcon,
      color: '#764ba2',
      action: () => navigate('/contact')
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in timeout={500}>
        <Box>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <HelpIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            </Box>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Help Center
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                fontSize: { xs: '1rem', sm: '1.125rem' },
                maxWidth: 'md',
                mx: 'auto',
              }}
            >
              Find answers to common questions and get support for using ePathshala
            </Typography>
          </Box>

          {/* Quick Actions */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={3}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                    onClick={action.action}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <action.icon sx={{ fontSize: 48, color: action.color }} />
                      </Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        {action.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {action.description}
                      </Typography>
                      <Button
                        variant="outlined"
                        endIcon={<ArrowForwardIcon />}
                        sx={{ mt: 1 }}
                      >
                        Get Started
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Help Sections */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Help by User Type
            </Typography>
            <Grid container spacing={3}>
              {helpSections.map((section, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      height: '100%',
                      borderRadius: 3,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <section.icon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {section.title}
                      </Typography>
                    </Box>
                    <List dense>
                      {section.items.map((item, itemIndex) => (
                        <React.Fragment key={itemIndex}>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <Box
                                sx={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: '50%',
                                  backgroundColor: 'primary.main',
                                }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={item}
                              primaryTypographyProps={{
                                variant: 'body2',
                                color: 'text.secondary',
                              }}
                            />
                          </ListItem>
                          {itemIndex < section.items.length - 1 && (
                            <Divider sx={{ my: 1 }} />
                          )}
                        </React.Fragment>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Additional Support */}
          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Paper
              elevation={1}
              sx={{
                p: 4,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: 3,
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Still Need Help?
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                Our AI assistant is available 24/7 to answer your questions and provide support.
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<ChatbotIcon />}
                onClick={() => navigate('/chatbot')}
                sx={{
                  backgroundColor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'grey.100',
                  },
                }}
              >
                Chat with AI Assistant
              </Button>
            </Paper>
          </Box>
        </Box>
      </Fade>
    </Container>
  );
}

export default HelpPage;
