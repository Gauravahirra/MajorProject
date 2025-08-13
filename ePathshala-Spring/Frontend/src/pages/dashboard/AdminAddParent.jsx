import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Card,
  CardContent,
  Paper,
  Container,
  Grid,
  Avatar,
  IconButton,
  InputAdornment,
  useTheme,
  alpha,
  Fade,
  Slide
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Add as AddIcon,
  FamilyRestroom as FamilyIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { addParent } from '../../api/admin';

function AdminAddParent() {
  const theme = useTheme();
  const [parentForm, setParentForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onAddParent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const result = await addParent(parentForm);
      if (result && result.error) {
        setError(result.error);
      } else {
        setSuccess('Parent added successfully!');
        setParentForm({ name: '', email: '', password: '' });
      }
    } catch (err) {
      setError('Failed to add parent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Fade in={true} timeout={800}>
        <Box>
          {/* Header Section */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'primary.main',
                mx: 'auto',
                mb: 2,
                boxShadow: theme.shadows[4]
              }}
            >
              <FamilyIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Add New Parent
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Register a new parent account in the system
            </Typography>
          </Box>

          {/* Form Card */}
          <Slide direction="up" in={true} timeout={1000}>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                boxShadow: theme.shadows[8],
                borderRadius: 3
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box component="form" onSubmit={onAddParent}>
                  <Grid container spacing={3}>
                    {/* Name Field */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Parent Name"
                        value={parentForm.name}
                        onChange={e => setParentForm({ ...parentForm, name: e.target.value })}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: theme.palette.primary.main,
                            },
                          },
                        }}
                      />
                    </Grid>

                    {/* Email Field */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={parentForm.email}
                        onChange={e => setParentForm({ ...parentForm, email: e.target.value })}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: theme.palette.primary.main,
                            },
                          },
                        }}
                      />
                    </Grid>

                    {/* Password Field */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={parentForm.password}
                        onChange={e => setParentForm({ ...parentForm, password: e.target.value })}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon color="primary" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: theme.palette.primary.main,
                            },
                          },
                        }}
                      />
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        startIcon={<AddIcon />}
                        sx={{
                          py: 1.5,
                          px: 4,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          boxShadow: theme.shadows[4],
                          '&:hover': {
                            boxShadow: theme.shadows[8],
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease-in-out',
                        }}
                      >
                        {loading ? 'Adding Parent...' : 'Add Parent'}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Slide>

          {/* Alerts */}
          {success && (
            <Fade in={true} timeout={500}>
              <Alert
                severity="success"
                sx={{
                  mt: 3,
                  borderRadius: 2,
                  boxShadow: theme.shadows[2]
                }}
              >
                {success}
              </Alert>
            </Fade>
          )}
          {error && (
            <Fade in={true} timeout={500}>
              <Alert
                severity="error"
                sx={{
                  mt: 3,
                  borderRadius: 2,
                  boxShadow: theme.shadows[2]
                }}
              >
                {error}
              </Alert>
            </Fade>
          )}
        </Box>
      </Fade>
    </Container>
  );
}

export default React.memo(AdminAddParent);