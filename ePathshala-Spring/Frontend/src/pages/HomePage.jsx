import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  useMediaQuery,
  Avatar,
  Paper,
  Divider,
  Fade,
  Slide,
  Grow,
  Zoom,
} from '@mui/material';
import {
  School as SchoolIcon,
  Computer as ComputerIcon,
  Group as GroupIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Support as SupportIcon,
  ArrowForward as ArrowForwardIcon,
  Star as StarIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  TrendingUp as TrendingIcon,
  Psychology as PsychologyIcon,
  AutoStories as StoriesIcon,
  VideoCall as VideoCallIcon,
  Forum as ForumIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer } from '../components/layout';
import { useResponsive, typography, spacing, gridConfig, buttonStyles, textAlign } from '../utils/responsive';

function HomePage() {
  const theme = useTheme();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(0);

  // Auto-scroll through sections
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSection((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: VideoCallIcon,
      title: 'Live Online Classes',
      description: 'Join interactive virtual classrooms with HD video streaming, screen sharing, and real-time collaboration tools.',
      color: '#1976d2'
    },
    {
      icon: AssignmentIcon,
      title: 'Smart Assignments',
      description: 'Submit and track assignments with automated grading, feedback, and progress analytics.',
      color: '#388e3c'
    },
    {
      icon: AssessmentIcon,
      title: 'Digital Exams',
      description: 'Take secure online exams with anti-cheating measures, instant results, and detailed analytics.',
      color: '#f57c00'
    },
    {
      icon: ForumIcon,
      title: 'Discussion Forums',
      description: 'Engage in meaningful discussions, ask questions, and collaborate with peers and teachers.',
      color: '#7b1fa2'
    },
    {
      icon: PsychologyIcon,
      title: 'AI-Powered Learning',
      description: 'Personalized learning paths with AI chatbot assistance and adaptive content recommendations.',
      color: '#d32f2f'
    },
    {
      icon: ScheduleIcon,
      title: 'Academic Calendar',
      description: 'Stay organized with integrated calendar, event notifications, and deadline reminders.',
      color: '#00838f'
    }
  ];

  const stats = [
    { number: '15,000+', label: 'Active Students', icon: <SchoolIcon /> },
    { number: '800+', label: 'Expert Teachers', icon: <GroupIcon /> },
    { number: '100+', label: 'Courses Available', icon: <StoriesIcon /> },
    { number: '99.9%', label: 'Platform Uptime', icon: <TrendingIcon /> }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Student, Grade 12',
      avatar: 'S',
      content: 'ePathshala has transformed my learning experience. The interactive features and real-time feedback have helped me excel in my studies.',
      rating: 5
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Mathematics Teacher',
      avatar: 'M',
      content: 'The platform makes teaching so much more effective. I can track student progress, provide instant feedback, and create engaging content.',
      rating: 5
    },
    {
      name: 'Lisa Rodriguez',
      role: 'Parent',
      avatar: 'L',
      content: 'As a parent, I love how transparent the platform is. I can monitor my child\'s progress and stay connected with teachers.',
      rating: 5
    }
  ];



  const heroSections = [
    {
      title: 'Transform Your Learning Journey',
      subtitle: 'Experience the future of education with our comprehensive online learning platform.',
      cta: 'Get Started'
    },
    {
      title: 'Connect, Collaborate, Excel',
      subtitle: 'Join thousands of students and teachers in a dynamic learning environment.',
      cta: 'Learn More'
    },
    {
      title: 'AI-Powered Education',
      subtitle: 'Personalized learning experiences with cutting-edge artificial intelligence.',
      cta: 'Explore Features'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section with Auto-scrolling */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: { xs: 4, sm: 6, md: 8, lg: 12, xl: 16 },
          position: 'relative',
          overflow: 'hidden',
          minHeight: { xs: '70vh', sm: '80vh', md: '90vh', lg: '100vh', xl: '100vh' },
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {/* Animated background elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
            animation: 'pulse 4s ease-in-out infinite alternate'
          }}
        />
        
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 } }}>
          <Grid container spacing={{ xs: 3, sm: 4, md: 6, lg: 8, xl: 10 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box>
                  {heroSections.map((section, index) => (
                    <Slide
                      key={index}
                      direction="left"
                      in={activeSection === index}
                      timeout={800}
                      mountOnEnter
                      unmountOnExit
                    >
                      <Box>
                        <Typography
                          variant="h1"
                          component="h1"
                          gutterBottom
                          sx={{
                            fontWeight: 800,
                            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem', lg: '3.25rem', xl: '3.75rem' },
                            lineHeight: 1.1,
                            textAlign: { xs: 'center', sm: 'center', md: 'left' },
                            mb: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }
                          }}
                        >
                          {section.title}
                        </Typography>
                        
                        <Typography
                          variant="h5"
                          sx={{
                            mb: { xs: 3, sm: 4, md: 5, lg: 6, xl: 7 },
                            fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem', lg: '1.375rem', xl: '1.5rem' },
                            textAlign: { xs: 'center', sm: 'center', md: 'left' },
                            opacity: 0.9,
                            lineHeight: 1.6
                          }}
                        >
                          {section.subtitle}
                        </Typography>
                        
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: { xs: 'column', sm: 'row' },
                          gap: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
                          justifyContent: { xs: 'center', md: 'flex-start' },
                          alignItems: { xs: 'stretch', sm: 'center' }
                        }}>
                          <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/login')}
                            sx={{
                              backgroundColor: 'secondary.main',
                              color: 'white',
                              px: { xs: 3, sm: 4, md: 5, lg: 6, xl: 7 },
                              py: { xs: 1.5, sm: 2, md: 2.5, lg: 3, xl: 3.5 },
                              fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem', lg: '1.25rem', xl: '1.375rem' },
                              fontWeight: 600,
                              borderRadius: 3,
                              minHeight: { xs: 48, sm: 56, md: 64, lg: 72, xl: 80 },
                              '&:hover': {
                                backgroundColor: 'secondary.dark',
                                transform: 'translateY(-2px)',
                                boxShadow: 4
                              },
                              transition: 'all 0.3s ease'
                            }}
                          >
                            {section.cta}
                          </Button>
                          
                          <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/about')}
                            sx={{
                              borderColor: 'white',
                              color: 'white',
                              ...buttonStyles.primary,
                              fontWeight: 600,
                              borderRadius: 3,
                              '&:hover': {
                                borderColor: 'secondary.main',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                transform: 'translateY(-2px)'
                              },
                              transition: 'all 0.3s ease'
                            }}
                          >
                            Learn More
                          </Button>
                        </Box>
                      </Box>
                    </Slide>
                  ))}
                </Box>
              </Fade>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Zoom in timeout={1200}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: { xs: 'center', md: 'flex-end' },
                  mt: { xs: 4, sm: 6, md: 0 }
                }}>
                  <Box
                    sx={{
                      width: { xs: '100%', sm: '90%', md: '100%' },
                      maxWidth: 600,
                      height: { xs: 300, sm: 350, md: 450, lg: 550 },
                      background: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: { xs: 2, sm: 3, md: 4 },
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      position: 'relative',
                      overflow: 'hidden',
                      p: { xs: 2, sm: 3, md: 4 },
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                        animation: 'pulse 4s ease-in-out infinite alternate'
                      }
                    }}
                  >
                    {/* Dashboard Header */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      mb: 1,
                      zIndex: 1,
                      position: 'relative'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          bgcolor: 'error.main',
                          animation: 'pulse 2s infinite'
                        }} />
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          bgcolor: 'warning.main',
                          animation: 'pulse 2s infinite 0.5s'
                        }} />
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          bgcolor: 'success.main',
                          animation: 'pulse 2s infinite 1s'
                        }} />
                      </Box>
                      <Typography sx={{ 
                        color: 'white', 
                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                        fontWeight: 600,
                        opacity: 0.9
                      }}>
                        ePathshala Dashboard
                      </Typography>
                    </Box>

                    {/* Main Dashboard Content */}
                    <Box sx={{ 
                      flex: 1, 
                      display: 'grid', 
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                      gap: 2,
                      zIndex: 1,
                      position: 'relative'
                    }}>
                      {/* Stats Cards */}
                      <Box sx={{ 
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 2,
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        animation: 'slideInLeft 1s ease-out'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SchoolIcon sx={{ color: 'white', fontSize: '1.2rem', opacity: 0.8 }} />
                          <Typography sx={{ color: 'white', fontSize: '0.75rem', fontWeight: 600 }}>
                            Active Students
                          </Typography>
                        </Box>
                        <Typography sx={{ color: 'white', fontSize: '1.5rem', fontWeight: 700 }}>
                          15,247
                        </Typography>
                        <Box sx={{ 
                          width: '100%', 
                          height: 4, 
                          background: 'rgba(255,255,255,0.2)',
                          borderRadius: 2,
                          overflow: 'hidden'
                        }}>
                          <Box sx={{ 
                            width: '85%', 
                            height: '100%', 
                            background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
                            borderRadius: 2,
                            animation: 'progressBar 2s ease-out'
                          }} />
                        </Box>
                      </Box>

                      <Box sx={{ 
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 2,
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        animation: 'slideInRight 1s ease-out 0.2s'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <GroupIcon sx={{ color: 'white', fontSize: '1.2rem', opacity: 0.8 }} />
                          <Typography sx={{ color: 'white', fontSize: '0.75rem', fontWeight: 600 }}>
                            Online Classes
                          </Typography>
                        </Box>
                        <Typography sx={{ color: 'white', fontSize: '1.5rem', fontWeight: 700 }}>
                          42
                        </Typography>
                        <Box sx={{ 
                          width: '100%', 
                          height: 4, 
                          background: 'rgba(255,255,255,0.2)',
                          borderRadius: 2,
                          overflow: 'hidden'
                        }}>
                          <Box sx={{ 
                            width: '68%', 
                            height: '100%', 
                            background: 'linear-gradient(90deg, #2196F3, #03A9F4)',
                            borderRadius: 2,
                            animation: 'progressBar 2s ease-out 0.3s'
                          }} />
                        </Box>
                      </Box>

                      {/* Feature Icons */}
                      <Box sx={{ 
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 2,
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        animation: 'slideInLeft 1s ease-out 0.4s'
                      }}>
                        <Typography sx={{ color: 'white', fontSize: '0.75rem', fontWeight: 600, mb: 1 }}>
                          Quick Actions
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {[VideoCallIcon, AssignmentIcon, AssessmentIcon, ForumIcon].map((Icon, index) => (
                            <Box
                              key={index}
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: 1,
                                background: 'rgba(255, 255, 255, 0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                animation: `fadeInUp 0.5s ease-out ${0.6 + index * 0.1}s both`,
                                '&:hover': {
                                  background: 'rgba(255, 255, 255, 0.25)',
                                  transform: 'scale(1.1)'
                                }
                              }}
                            >
                              <Icon sx={{ color: 'white', fontSize: '1rem', opacity: 0.9 }} />
                            </Box>
                          ))}
                        </Box>
                      </Box>

                      {/* Recent Activity */}
                      <Box sx={{ 
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 2,
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        animation: 'slideInRight 1s ease-out 0.6s'
                      }}>
                        <Typography sx={{ color: 'white', fontSize: '0.75rem', fontWeight: 600, mb: 1 }}>
                          Recent Activity
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {['New assignment posted', 'Exam results available', 'Class starting soon'].map((text, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                animation: `fadeInLeft 0.5s ease-out ${0.8 + index * 0.1}s both`
                              }}
                            >
                              <Box sx={{ 
                                width: 6, 
                                height: 6, 
                                borderRadius: '50%', 
                                bgcolor: 'success.main',
                                animation: 'pulse 2s infinite'
                              }} />
                              <Typography sx={{ 
                                color: 'white', 
                                fontSize: '0.7rem', 
                                opacity: 0.8,
                                lineHeight: 1.2
                              }}>
                                {text}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Box>

                    {/* Bottom Status Bar */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      mt: 1,
                      zIndex: 1,
                      position: 'relative'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          bgcolor: 'success.main',
                          animation: 'pulse 2s infinite'
                        }} />
                        <Typography sx={{ 
                          color: 'white', 
                          fontSize: '0.7rem', 
                          opacity: 0.8
                        }}>
                          System Online
                        </Typography>
                      </Box>
                      <Typography sx={{ 
                        color: 'white', 
                        fontSize: '0.7rem', 
                        opacity: 0.6
                      }}>
                        Live Demo
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: { xs: 4, sm: 6, md: 8 }, backgroundColor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {stats.map((stat, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Grow in timeout={1000 + index * 200}>
                  <Box sx={{ 
                    textAlign: 'center',
                    p: { xs: 2, sm: 3 },
                    borderRadius: { xs: 2, sm: 3 },
                    background: 'white',
                    boxShadow: 2,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 4
                    }
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      mb: 1
                    }}>
                      <Avatar sx={{ 
                        bgcolor: 'primary.main', 
                        width: { xs: 40, sm: 50, md: 60 }, 
                        height: { xs: 40, sm: 50, md: 60 } 
                      }}>
                        {stat.icon}
                      </Avatar>
                    </Box>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700,
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                        color: 'primary.main'
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 6, sm: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 6, md: 8 } }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                fontSize: typography.h2,
                mb: { xs: 2, sm: 3 }
              }}
            >
              Why Choose ePathshala?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                maxWidth: 700,
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Discover the features that make our platform the preferred choice for modern education
            </Typography>
          </Box>
          
          <Grid container spacing={{ xs: 2, sm: 3, md: 4, lg: 5 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Grow in timeout={1000 + index * 200}>
                  <Card
                    sx={{
                      height: '100%',
                      transition: 'all 0.3s ease-in-out',
                      borderRadius: { xs: 2, sm: 3 },
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-12px)',
                        boxShadow: theme.shadows[12],
                        '& .feature-icon': {
                          transform: 'scale(1.1)',
                          color: feature.color
                        }
                      }
                    }}
                  >
                    <CardContent sx={{ 
                      textAlign: 'center', 
                      p: { xs: 2, sm: 3, md: 4 },
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        mb: { xs: 2, sm: 3 }
                      }}>
                        <feature.icon 
                          className="feature-icon"
                          sx={{ 
                            fontSize: { xs: 40, sm: 50, md: 60, lg: 70 },
                            color: 'primary.main',
                            transition: 'all 0.3s ease-in-out'
                          }}
                        />
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                          mb: { xs: 1, sm: 2 }
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'text.secondary',
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          lineHeight: 1.6
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: { xs: 6, sm: 8, md: 12 }, backgroundColor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 6, md: 8 } }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                fontSize: typography.h2,
                mb: { xs: 2, sm: 3 }
              }}
            >
              What Our Users Say
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                maxWidth: 700,
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Hear from students, teachers, and parents about their experience with ePathshala
            </Typography>
          </Box>
          
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Grow in timeout={1000 + index * 200}>
                  <Card
                    sx={{
                      height: '100%',
                      p: { xs: 2, sm: 3, md: 4 },
                      borderRadius: { xs: 2, sm: 3 },
                      background: 'white',
                      boxShadow: 2,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          width: { xs: 40, sm: 50, md: 60 },
                          height: { xs: 40, sm: 50, md: 60 },
                          bgcolor: 'primary.main',
                          mr: 2
                        }}
                      >
                        {testimonial.avatar}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
                          }}
                        >
                          {testimonial.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                          }}
                        >
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        lineHeight: 1.6,
                        mb: 2
                      }}
                    >
                      "{testimonial.content}"
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon
                          key={i}
                          sx={{
                            color: 'warning.main',
                            fontSize: { xs: '1rem', sm: '1.25rem' }
                          }}
                        />
                      ))}
                    </Box>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>



      {/* CTA Section */}
      <Box sx={{ 
        py: { xs: 6, sm: 8, md: 12 }, 
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                fontSize: typography.h2,
                mb: { xs: 2, sm: 3 }
              }}
            >
              Ready to Transform Your Learning?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                maxWidth: 600,
                mx: 'auto',
                mb: { xs: 3, sm: 4, md: 5 },
                opacity: 0.9,
                lineHeight: 1.6
              }}
            >
              Join thousands of students and teachers who are already experiencing the future of education
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 3 },
              justifyContent: 'center',
              alignItems: { xs: 'stretch', sm: 'center' }
            }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  backgroundColor: 'secondary.main',
                  color: 'white',
                  ...buttonStyles.primary,
                  fontWeight: 600,
                  borderRadius: 3,
                  '&:hover': {
                    backgroundColor: 'secondary.dark',
                    transform: 'translateY(-2px)',
                    boxShadow: 4
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Get Started Now
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/contact')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  ...buttonStyles.primary,
                  fontWeight: 600,
                  borderRadius: 3,
                  '&:hover': {
                    borderColor: 'secondary.main',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Contact Us
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 6 }}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  mb: 3
                }}
              >
                Get in Touch
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  mb: 4,
                  lineHeight: 1.6
                }}
              >
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <EmailIcon sx={{ color: 'primary.main' }} />
                  <Typography>support@epathshala.com</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PhoneIcon sx={{ color: 'primary.main' }} />
                  <Typography>+1 (555) 123-4567</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocationIcon sx={{ color: 'primary.main' }} />
                  <Typography>123 Education Street, Learning City, LC 12345</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TimeIcon sx={{ color: 'primary.main' }} />
                  <Typography>Monday - Friday: 9:00 AM - 6:00 PM</Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                  Send us a Message
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/contact')}
                  fullWidth
                  sx={{
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 2
                  }}
                >
                  Contact Us
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default HomePage; 