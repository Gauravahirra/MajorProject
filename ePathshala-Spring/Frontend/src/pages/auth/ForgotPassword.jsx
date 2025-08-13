import React, { useState } from 'react';
import { forgotPassword, verifyOtp } from '../../api/auth';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  Card, 
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Container,
  useTheme,
  useMediaQuery,
  InputAdornment,
  IconButton,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Security as SecurityIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  Login as LoginIcon
} from '@mui/icons-material';

function ForgotPassword() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await forgotPassword(email);
      setMessage(response.message);
      setStep(1);
      console.log('OTP sent. Check terminal for OTP code.');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await verifyOtp(email, otp, newPassword);
      setMessage(response.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const steps = ['Request OTP', 'Verify OTP & Reset Password'];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Simple Navigation Bar */}
      <AppBar position="static" sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
            ePathshala
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              component={Link}
              to="/"
              variant="outlined"
              startIcon={<HomeIcon />}
              sx={{ 
                color: 'primary.main',
                borderColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white'
                }
              }}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              startIcon={<LoginIcon />}
              sx={{ 
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                }
              }}
            >
              Sign In
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Main Content */}
      <Box sx={{ 
        flex: 1,
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: { xs: 4, md: 6 },
        px: { xs: 2, sm: 4 }
      }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card sx={{ 
              maxWidth: 500, 
              width: '100%', 
              boxShadow: 8,
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}>
              <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <SecurityIcon sx={{ 
                    fontSize: { xs: 48, sm: 56 }, 
                    color: '#1976d2', 
                    mb: 2 
                  }} />
                  <Typography 
                    variant="h4" 
                    gutterBottom 
                    sx={{ 
                      color: '#1976d2',
                      fontWeight: 700,
                      fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                    }}
                  >
                    Reset Password
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      mb: 2
                    }}
                  >
                    Follow the steps to reset your password securely
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: { xs: '0.8rem', sm: '0.9rem' },
                      opacity: 0.8
                    }}
                  >
                    Don't worry! It happens to the best of us.
                  </Typography>
                </Box>

                {/* Stepper */}
                <Stepper 
                  activeStep={step} 
                  sx={{ 
                    mb: 4,
                    '& .MuiStepLabel-label': {
                      fontSize: { xs: '0.8rem', sm: '0.9rem' },
                      fontWeight: 500
                    },
                    '& .MuiStepLabel-root.Mui-active .MuiStepLabel-label': {
                      color: '#1976d2',
                      fontWeight: 600
                    },
                    '& .MuiStepLabel-root.Mui-completed .MuiStepLabel-label': {
                      color: '#2e7d32',
                      fontWeight: 600
                    }
                  }}
                >
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {/* Step 1: Request OTP */}
                {step === 0 && (
                  <Box component="form" onSubmit={handleRequestOtp}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 3,
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        fontWeight: 600
                      }}
                    >
                      Enter your email address to receive a verification code
                    </Typography>
                    
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      sx={{ mb: 4 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      disabled={loading || !email}
                      sx={{ 
                        mb: 3, 
                        py: { xs: 1.5, sm: 2 },
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        fontWeight: 600,
                        borderRadius: 2,
                        background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)',
                        },
                        '&:disabled': {
                          transform: 'none',
                          boxShadow: 'none',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {loading ? 'Sending OTP...' : 'Send OTP'}
                    </Button>
                  </Box>
                )}

                {/* Step 2: Verify OTP and Reset Password */}
                {step === 1 && (
                  <Box component="form" onSubmit={handleVerifyOtp}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 3,
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        fontWeight: 600
                      }}
                    >
                      Enter the verification code and your new password
                    </Typography>
                    
                    <TextField
                      fullWidth
                      label="Verification Code (OTP)"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      sx={{ mb: 3 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SecurityIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    
                    <TextField
                      fullWidth
                      label="New Password"
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      sx={{ mb: 3 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleTogglePasswordVisibility}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      sx={{ mb: 4 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleToggleConfirmPasswordVisibility}
                              edge="end"
                            >
                              {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      disabled={loading || !otp || !newPassword || !confirmPassword}
                      sx={{ 
                        mb: 3, 
                        py: { xs: 1.5, sm: 2 },
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        fontWeight: 600,
                        borderRadius: 2,
                        background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)',
                        },
                        '&:disabled': {
                          transform: 'none',
                          boxShadow: 'none',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {loading ? 'Resetting Password...' : 'Reset Password'}
                    </Button>
                  </Box>
                )}

                {/* Back to Login Link */}
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Button
                    component={Link}
                    to="/login"
                    variant="text"
                    startIcon={<ArrowBackIcon />}
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: { xs: '0.8rem', sm: '0.9rem' },
                      '&:hover': {
                        color: '#1976d2'
                      }
                    }}
                  >
                    Back to Login
                  </Button>
                </Box>

                {/* Helpful Tips */}
                {step === 0 && (
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'info.50', borderRadius: 2, border: '1px solid', borderColor: 'info.200' }}>
                    <Typography variant="body2" sx={{ color: 'info.700', fontWeight: 500, mb: 1 }}>
                      💡 Helpful Tips:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'info.600', fontSize: '0.8rem', lineHeight: 1.4 }}>
                      • Check your email's spam folder if you don't receive the OTP
                      <br />
                      • The OTP is valid for 10 minutes
                      <br />
                      • Make sure to enter the email address you used during registration
                    </Typography>
                  </Box>
                )}

                {step === 1 && (
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'success.50', borderRadius: 2, border: '1px solid', borderColor: 'success.200' }}>
                    <Typography variant="body2" sx={{ color: 'success.700', fontWeight: 500, mb: 1 }}>
                      🔐 Password Requirements:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'success.600', fontSize: '0.8rem', lineHeight: 1.4 }}>
                      • Minimum 6 characters long
                      <br />
                      • Use a combination of letters, numbers, and symbols for better security
                      <br />
                      • Avoid using easily guessable information
                    </Typography>
                  </Box>
                )}

                {/* Messages */}
                {message && (
                  <Alert severity="success" sx={{ mt: 3 }}>
                    {message}
                  </Alert>
                )}
                
                {error && (
                  <Alert severity="error" sx={{ mt: 3 }}>
                    {error}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default ForgotPassword; 