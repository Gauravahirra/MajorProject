import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  useTheme,
  Chip
} from '@mui/material';
import {
  School as SchoolIcon,
  Lightbulb as LightbulbIcon,
  Group as GroupIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Support as SupportIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as EmojiEventsIcon
} from '@mui/icons-material';
import { ResponsiveContainer } from '../components/layout';
import { useResponsive, typography, spacing, gridConfig, cardStyles } from '../utils/responsive';

function AboutUs() {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const values = [
    {
      icon: SchoolIcon,
      title: 'Excellence in Education',
      description: 'We strive for academic excellence and continuous improvement in all our educational offerings.'
    },
    {
      icon: GroupIcon,
      title: 'Collaboration',
      description: 'Fostering a collaborative environment where students, teachers, and parents work together.'
    },
    {
      icon: SecurityIcon,
      title: 'Security & Privacy',
      description: 'Protecting student data and maintaining the highest standards of privacy and security.'
    },
    {
      icon: SpeedIcon,
      title: 'Innovation',
      description: 'Embracing new technologies to enhance the learning experience and outcomes.'
    }
  ];

  const developerTeam = [
    {
      name: 'Saket Kharche',
      role: 'Full Stack Developer',
      image: '/saketk.jpg',
      bio: 'Lead developer specializing in React, Spring Boot, and modern web technologies.'
    },
    {
      name: 'Satyajeet Khamkar',
      role: 'Backend Developer',
      image: '/satyaK.jpg',
      bio: 'Expert in Java, Spring Framework, and database design with focus on scalable architecture.'
    },
    {
      name: 'Ravi Yadav',
      role: 'Frontend Developer',
      image: '/raviy.jpg',
      bio: 'UI/UX specialist with expertise in React, Material-UI, and responsive design.'
    },
    {
      name: 'Gaurav Ahirrao',
      role: 'Database Developer',
      image: '/gauravA.jpg',
      bio: 'Database architect and administrator with deep knowledge of SQL and data management.'
    },
    {
      name: 'Anushree Upadhye',
      role: 'UI/UX Designer',
      image: '/AnushreeU.jpg',
      bio: 'Creative designer focused on user experience and modern interface design.'
    }
  ];

  const milestones = [
    { year: '2020', title: 'Platform Launch', description: 'ePathshala launched with basic LMS features' },
    { year: '2021', title: '10,000 Students', description: 'Reached our first major milestone of active users' },
    { year: '2022', title: 'Mobile App', description: 'Launched mobile applications for iOS and Android' },
    { year: '2023', title: 'AI Integration', description: 'Introduced AI-powered learning recommendations' },
    { year: '2024', title: 'Global Expansion', description: 'Expanded to serve students in 50+ countries' }
  ];

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 4, sm: 6, md: 8 } }}>
      <ResponsiveContainer>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 6, md: 8 } }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ 
              fontWeight: 700,
              fontSize: typography.h3
            }}
          >
            About ePathshala
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ 
              maxWidth: 800,
              mx: 'auto',
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
              lineHeight: 1.6
            }}
          >
            Transforming education through innovative technology and personalized learning experiences. 
            We believe every student deserves access to quality education, regardless of their location or circumstances.
          </Typography>
        </Box>

        {/* Mission & Vision */}
        <Grid container spacing={{ xs: 3, sm: 4, md: 6 }} sx={{ mb: { xs: 4, sm: 6, md: 8 } }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              height: '100%',
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: { xs: 2, sm: 3 },
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
                  }}
                >
                  Our Mission
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{ 
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    lineHeight: 1.6
                  }}
                >
                  To provide accessible, high-quality education through innovative technology, 
                  empowering students to achieve their full potential and succeed in an ever-evolving world.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              height: '100%',
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: { xs: 2, sm: 3 },
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
                  }}
                >
                  Our Vision
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{ 
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    lineHeight: 1.6
                  }}
                >
                  To become the leading global platform for digital education, 
                  connecting millions of learners with world-class educational content and experiences.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Values */}
        <Box sx={{ mb: { xs: 4, sm: 6, md: 8 } }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              textAlign: 'center',
              fontWeight: 600,
              fontSize: typography.h4,
              mb: { xs: 3, sm: 4, md: 5 }
            }}
          >
            Our Core Values
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ 
                  height: '100%',
                  p: { xs: 2, sm: 3 },
                  borderRadius: { xs: 2, sm: 3 },
                  textAlign: 'center',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 4
                  }
                }}>
                  <CardContent>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      mb: { xs: 1, sm: 2 }
                    }}>
                      <Avatar sx={{ 
                        width: { xs: 50, sm: 60, md: 70 }, 
                        height: { xs: 50, sm: 60, md: 70 },
                        bgcolor: 'primary.main'
                      }}>
                        <value.icon />
                      </Avatar>
                    </Box>
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
                      }}
                    >
                      {value.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        lineHeight: 1.5
                      }}
                    >
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Developer Team */}
        <Box sx={{ mb: { xs: 4, sm: 6, md: 8 } }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              textAlign: 'center',
              fontWeight: 600,
              fontSize: typography.h4,
              mb: { xs: 3, sm: 4, md: 5 }
            }}
          >
            Our Developer Team
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {developerTeam.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ 
                  height: '100%',
                  p: { xs: 2, sm: 3 },
                  borderRadius: { xs: 2, sm: 3 },
                  textAlign: 'center',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 4
                  }
                }}>
                  <CardContent>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      mb: 2
                    }}>
                      <Avatar 
                        src={member.image}
                        sx={{ 
                          width: { xs: 80, sm: 100, md: 120 }, 
                          height: { xs: 80, sm: 100, md: 120 },
                          border: '3px solid',
                          borderColor: 'primary.main',
                          boxShadow: 2
                        }}
                      />
                    </Box>
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
                      }}
                    >
                      {member.name}
                    </Typography>
                    <Chip 
                      label={member.role}
                      color="primary"
                      variant="outlined"
                      sx={{ 
                        mb: 1,
                        fontWeight: 500,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}
                    />
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        lineHeight: 1.5
                      }}
                    >
                      {member.bio}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Milestones */}
        <Box>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              textAlign: 'center',
              fontWeight: 600,
              fontSize: typography.h4,
              mb: { xs: 3, sm: 4, md: 5 }
            }}
          >
            Our Journey
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {milestones.map((milestone, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ 
                  p: { xs: 2, sm: 3 },
                  borderRadius: { xs: 2, sm: 3 },
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 4
                  }
                }}>
                  <CardContent>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 700,
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                        mb: 1
                      }}
                    >
                      {milestone.year}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                        mb: 1
                      }}
                    >
                      {milestone.title}
                    </Typography>
                    <Typography 
                      variant="body2"
                      sx={{ 
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        lineHeight: 1.5
                      }}
                    >
                      {milestone.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Stats */}
        <Box sx={{ bgcolor: 'background.default', p: 6, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, textAlign: 'center', mb: 4 }}>
            Impact by the Numbers
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                  50,000+
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Active Students
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                  1,000+
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Expert Teachers
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                  200+
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Courses Available
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                  50+
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Countries Served
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </ResponsiveContainer>
    </Box>
  );
}

export default AboutUs;