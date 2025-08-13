import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  TextareaAutosize,
  useTheme,
  Alert,
  Snackbar,
  Paper,
  Fade,
  Zoom,
  LinearProgress
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { Formik, Form } from 'formik';
import { ResponsiveContainer } from '../components/layout';
import { useResponsive, typography, buttonStyles, spacing, gridConfig } from '../utils/responsive';
import { contactValidationSchema } from '../utils/formikValidation';

function ContactUs() {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const contactInfo = [
    {
      icon: EmailIcon,
      title: 'Email Us',
      details: 'info@epathshala.com',
      description: 'Send us an email anytime'
    },
    {
      icon: PhoneIcon,
      title: 'Call Us',
      details: '+1 (555) 123-4567',
      description: 'Mon-Fri from 8am to 6pm'
    },
    {
      icon: LocationIcon,
      title: 'Visit Us',
      details: '123 Education Street, Learning City, LC 12345',
      description: 'Main office location'
    },
    {
      icon: ScheduleIcon,
      title: 'Business Hours',
      details: 'Monday - Friday: 8:00 AM - 6:00 PM',
      description: 'Saturday: 9:00 AM - 2:00 PM'
    }
  ];

  const initialValues = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSnackbar({
        open: true,
        message: 'Thank you for your message! We will get back to you soon.',
        severity: 'success'
      });
      
      resetForm();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to send message. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ py: { xs: 4, sm: 6, md: 8 } }}>
      <ResponsiveContainer>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 6, md: 8 } }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              color: 'primary.main',
              mb: 2,
            }}
          >
            Get in Touch
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              fontSize: { xs: '1rem', sm: '1.25rem' },
              maxWidth: 'md',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Have questions or need assistance? We're here to help you with any inquiries about our platform.
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 3, sm: 4, md: 6 }}>
          {/* Contact Information */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: { xs: 4, md: 0 } }}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                  mb: 3,
                }}
              >
                Contact Information
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {contactInfo.map((info, index) => (
                  <Fade in timeout={500 + index * 100} key={index}>
                    <Card
                      sx={{
                        p: { xs: 2, sm: 3 },
                        borderRadius: 3,
                        boxShadow: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4,
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: 'primary.main',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <info.icon />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              fontSize: { xs: '1rem', sm: '1.125rem' },
                              mb: 0.5,
                            }}
                          >
                            {info.title}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 500,
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                              mb: 0.5,
                            }}
                          >
                            {info.details}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                          >
                            {info.description}
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Fade>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={8}>
            <Fade in timeout={800}>
              <Paper
                elevation={4}
                sx={{
                  p: { xs: 3, sm: 4, md: 5 },
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                    mb: 3,
                    textAlign: 'center',
                  }}
                >
                  Send us a Message
                </Typography>

                {loading && (
                  <Box sx={{ mb: 3 }}>
                    <LinearProgress />
                  </Box>
                )}

                <Formik
                  initialValues={initialValues}
                  validationSchema={contactValidationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ values, errors, touched, setFieldValue, setFieldTouched, isSubmitting, isValid, dirty }) => (
                    <Form>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            name="name"
                            label="Your Name"
                            value={values.name}
                            onChange={(e) => setFieldValue('name', e.target.value)}
                            onBlur={() => setFieldTouched('name', true)}
                            error={touched.name && Boolean(errors.name)}
                            helperText={touched.name && errors.name}
                            required
                            variant="outlined"
                            size={isMobile ? 'small' : 'medium'}
                            disabled={loading}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                  backgroundColor: 'rgba(0,0,0,0.02)',
                                },
                              },
                            }}
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            name="email"
                            label="Email Address"
                            type="email"
                            value={values.email}
                            onChange={(e) => setFieldValue('email', e.target.value)}
                            onBlur={() => setFieldTouched('email', true)}
                            error={touched.email && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                            required
                            variant="outlined"
                            size={isMobile ? 'small' : 'medium'}
                            disabled={loading}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                  backgroundColor: 'rgba(0,0,0,0.02)',
                                },
                              },
                            }}
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            name="subject"
                            label="Subject"
                            value={values.subject}
                            onChange={(e) => setFieldValue('subject', e.target.value)}
                            onBlur={() => setFieldTouched('subject', true)}
                            error={touched.subject && Boolean(errors.subject)}
                            helperText={touched.subject && errors.subject}
                            required
                            variant="outlined"
                            size={isMobile ? 'small' : 'medium'}
                            disabled={loading}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                  backgroundColor: 'rgba(0,0,0,0.02)',
                                },
                              },
                            }}
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            name="message"
                            label="Message"
                            value={values.message}
                            onChange={(e) => setFieldValue('message', e.target.value)}
                            onBlur={() => setFieldTouched('message', true)}
                            error={touched.message && Boolean(errors.message)}
                            helperText={touched.message && errors.message}
                            required
                            multiline
                            rows={isMobile ? 4 : 6}
                            variant="outlined"
                            size={isMobile ? 'small' : 'medium'}
                            disabled={loading}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                  backgroundColor: 'rgba(0,0,0,0.02)',
                                },
                              },
                            }}
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Button
                              type="submit"
                              variant="contained"
                              size="large"
                              startIcon={<SendIcon />}
                              disabled={isSubmitting || loading || !isValid || !dirty}
                              sx={{
                                ...buttonStyles.primary,
                                minWidth: { xs: 150, sm: 200 },
                                borderRadius: 3,
                                fontWeight: 600,
                                textTransform: 'none',
                                fontSize: { xs: '1rem', sm: '1.125rem' },
                                px: { xs: 4, sm: 5 },
                                py: { xs: 1.5, sm: 2 },
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  boxShadow: 6,
                                },
                                transition: 'all 0.3s ease',
                              }}
                            >
                              {isSubmitting || loading ? 'Sending...' : 'Send Message'}
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </Form>
                  )}
                </Formik>
              </Paper>
            </Fade>
          </Grid>
        </Grid>
      </ResponsiveContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          icon={snackbar.severity === 'success' ? <CheckCircleIcon /> : <ErrorIcon />}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ContactUs;