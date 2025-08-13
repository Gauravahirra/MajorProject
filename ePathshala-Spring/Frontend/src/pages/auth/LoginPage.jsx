import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Container,
  Grid,
  useTheme,
  useMediaQuery,
  InputAdornment,
  IconButton,
  Paper,
  Fade,
  Zoom,
  LinearProgress,
  Avatar,
  Chip,
  Divider,
  alpha,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  School as SchoolIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  AdminPanelSettings as AdminIcon,
  Person as StudentIcon,
  Work as TeacherIcon,
  FamilyRestroom as ParentIcon,
  ArrowForward as ArrowForwardIcon,
  Support as SupportIcon,
  Security as SecurityIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { useAuth } from "../../utils/auth.jsx";
import { useResponsive } from "../../utils/responsive";
import { loginValidationSchema } from "../../utils/formikValidation";

function LoginPage() {
  const { login } = useAuth();
  const { isMobile, isTablet } = useResponsive();
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("ADMIN");

  // Check for session expiration message from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      // Clear the state to prevent showing the message again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleLogin = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    setError("");
    setMessage("");
    
    try {
      await login(values.email, values.password, values.role);
      // Login successful - redirect will be handled by useAuth
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
      resetForm();
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const initialValues = {
    email: "",
    password: "",
    role: "ADMIN",
    showPassword: false
  };

  const roleConfig = {
    ADMIN: {
      icon: <AdminIcon />,
      color: '#1976d2',
      label: 'Administrator',
      description: 'System management and oversight'
    },
    STUDENT: {
      icon: <StudentIcon />,
      color: '#2e7d32',
      label: 'Student',
      description: 'Access learning materials and track progress'
    },
    TEACHER: {
      icon: <TeacherIcon />,
      color: '#ed6c02',
      label: 'Teacher',
      description: 'Manage classes and student progress'
    },
    PARENT: {
      icon: <ParentIcon />,
      color: '#9c27b0',
      label: 'Parent',
      description: 'Monitor child\'s academic progress'
    }
  };

  const getRoleIcon = (role) => {
    return React.cloneElement(roleConfig[role].icon, {
      sx: { fontSize: 20, color: roleConfig[role].color }
    });
  };

  const handleHomeClick = () => {
    console.log('Home button clicked - navigating to home');
    try {
      navigate('/');
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location
      window.location.href = '/';
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, 
        ${alpha(theme.palette.primary.main, 0.1)} 0%, 
        ${alpha(theme.palette.secondary.main, 0.1)} 50%, 
        ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Simple Navigation Bar */}
      <AppBar 
        position="static" 
        sx={{ 
          background: 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(10px)',
          zIndex: 10,
          position: 'relative'
        }}
      >
        <Toolbar sx={{ 
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 10,
          minHeight: 64
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.primary', 
              fontWeight: 600,
              cursor: 'pointer'
            }}
            onClick={handleHomeClick}
          >
            ePathshala
          </Typography>
          <Button
            onClick={handleHomeClick}
            onMouseDown={() => console.log('Button mouse down')}
            onMouseUp={() => console.log('Button mouse up')}
            variant="outlined"
            startIcon={<HomeIcon />}
            sx={{ 
              color: 'primary.main',
              borderColor: 'primary.main',
              cursor: 'pointer',
              pointerEvents: 'auto',
              userSelect: 'none',
              position: 'relative',
              zIndex: 11,
              minWidth: 100,
              height: 40,
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white'
              },
              '&:active': {
                transform: 'scale(0.98)'
              }
            }}
          >
            Home
          </Button>
        </Toolbar>
      </AppBar>

      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 80%, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, ${alpha(theme.palette.primary.light, 0.05)} 0%, transparent 50%)
          `,
          zIndex: 0
        }}
      />

      <Container 
        maxWidth="lg" 
            sx={{
          position: 'relative',
          zIndex: 1,
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          py: 4
        }}
      >
        <Grid container spacing={4} alignItems="center">
          {/* Left Side - Branding and Info */}
          <Grid item xs={12} md={6}>
            <Fade in timeout={1000}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                {/* Logo and Brand */}
                <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                      width: 80,
                      height: 80,
                      borderRadius: '20px',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      mb: 3,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    }}
                  >
                    <SchoolIcon sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              
              <Typography
                    variant="h3"
                component="h1"
                gutterBottom
                sx={{
                      fontWeight: 800,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 2
                    }}
                  >
                    ePathshala
              </Typography>
              
              <Typography
                    variant="h6"
                color="text.secondary"
                    sx={{ mb: 4, fontWeight: 400 }}
                  >
                    Empowering Education Through Technology
                  </Typography>
                </Box>

                {/* Features */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                    Why Choose ePathshala?
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {[
                      { icon: <SecurityIcon />, text: 'Secure & Reliable Platform' },
                      { icon: <SchoolIcon />, text: 'Comprehensive Learning Management' },
                      { icon: <SupportIcon />, text: '24/7 Support & Assistance' }
                    ].map((feature, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 40,
                              height: 40,
                              borderRadius: '10px',
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              mr: 2
                            }}
                          >
                            {feature.icon}
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {feature.text}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
            </Fade>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={6}>
            <Zoom in timeout={800} style={{ transitionDelay: '200ms' }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4, md: 5 },
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  maxWidth: 500,
                  mx: 'auto'
                }}
              >
                {/* Form Header */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography
                    variant="h4"
                    component="h2"
                    gutterBottom
                    sx={{ fontWeight: 700, color: 'text.primary' }}
                  >
                    Welcome Back
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    Sign in to your account to continue
              </Typography>
            </Box>

            {/* Success/Error Messages */}
            {message && (
              <Alert
                severity="success"
                    sx={{ mb: 3 }}
                onClose={() => setMessage('')}
              >
                {message}
              </Alert>
            )}

            {error && (
              <Alert
                severity="error"
                    sx={{ mb: 3 }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <Formik
              initialValues={initialValues}
              validationSchema={loginValidationSchema}
              onSubmit={handleLogin}
            >
              {({ values, errors, touched, handleChange, handleBlur, isSubmitting, isValid, dirty }) => (
                <Form>
                    {/* Role Selection */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                          Select Your Role
                        </Typography>
                        <Grid container spacing={1}>
                          {Object.entries(roleConfig).map(([role, config]) => (
                            <Grid item xs={6} key={role}>
                              <Card
                                onClick={() => {
                                  setSelectedRole(role);
                                  handleChange({ target: { name: 'role', value: role } });
                                }}
                          sx={{
                                  cursor: 'pointer',
                                  border: values.role === role ? `2px solid ${config.color}` : '2px solid transparent',
                                  backgroundColor: values.role === role ? alpha(config.color, 0.1) : 'transparent',
                                  transition: 'all 0.3s ease',
                              '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: 4,
                                    backgroundColor: alpha(config.color, 0.05)
                                  }
                                }}
                              >
                                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                                  <Box sx={{ mb: 1 }}>
                                    {getRoleIcon(role)}
                                  </Box>
                                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                                    {config.label}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                    </Grid>
                      </Box>

                    {/* Email Field */}
                      <TextField
                        fullWidth
                        name="email"
                        label="Email Address"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          mb: 3,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.02),
                            },
                            '&.Mui-focused': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.05),
                            },
                          },
                        }}
                      />

                    {/* Password Field */}
                      <TextField
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                sx={{ color: 'text.secondary' }}
                              >
                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          mb: 4,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.02),
                            },
                            '&.Mui-focused': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.05),
                            },
                          },
                        }}
                      />

                    {/* Submit Button */}
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={isSubmitting || loading || !isValid || !dirty}
                        endIcon={!loading && <ArrowForwardIcon />}
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: '1rem',
                          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                          },
                          '&:disabled': {
                            transform: 'none',
                            boxShadow: 'none',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {isSubmitting || loading ? 'Signing In...' : 'Sign In'}
                      </Button>
                </Form>
              )}
            </Formik>

            {/* Forgot Password Link */}
                <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography 
                variant="body2" 
                color="text.secondary"
              >
                Forgot your password?{' '}
                <Link 
                  to="/forgot-password"
                  style={{ 
                    color: theme.palette.primary.main, 
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Reset it here
                </Link>
              </Typography>
            </Box>

            {/* Divider */}
                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Need Help?
              </Typography>
                </Divider>

            {/* Contact Support */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="body2" 
                color="text.secondary"
              >
                    Having trouble signing in?{' '}
                <Link 
                  to="/contact"
                  style={{ 
                    color: theme.palette.primary.main, 
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Contact support
                </Link>
              </Typography>
            </Box>
          </Paper>
            </Zoom>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default LoginPage;