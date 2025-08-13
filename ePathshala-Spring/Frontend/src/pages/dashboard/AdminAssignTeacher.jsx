import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Card,
  CardContent,
  Container,
  Grid,
  Avatar,
  InputAdornment,
  useTheme,
  alpha,
  Fade,
  Slide,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  School as SchoolIcon,
  Book as BookIcon,
  Assignment as AssignmentIcon,
  Class as ClassIcon
} from '@mui/icons-material';
import { assignTeacher } from '../../api/admin';

function AdminAssignTeacher() {
  const theme = useTheme();
  const [assign, setAssign] = useState({ email: '', subject: '', assignedClass: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Sample data for dropdowns
  const subjects = [
    'Mathematics', 'Science', 'English', 'History', 'Geography',
    'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Art'
  ];

  const classes = [
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
    'Class 11', 'Class 12'
  ];

  const onAssignTeacher = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const result = await assignTeacher(assign);
      if (result && result.error) {
        setError(result.error);
      } else {
        setSuccess('Teacher assigned successfully!');
        setAssign({ email: '', subject: '', assignedClass: '' });
      }
    } catch (err) {
      setError('Failed to assign teacher');
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
              <AssignmentIcon sx={{ fontSize: 40 }} />
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
              Assign Teacher to Class/Subject
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Assign teachers to specific classes and subjects
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
                <Box component="form" onSubmit={onAssignTeacher}>
                  <Grid container spacing={3}>
                    {/* Teacher Email Field */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Teacher Email"
                        type="email"
                        value={assign.email}
                        onChange={e => setAssign({ ...assign, email: e.target.value })}
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

                    {/* Subject Field */}
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Subject</InputLabel>
                        <Select
                          value={assign.subject}
                          label="Subject"
                          onChange={e => setAssign({ ...assign, subject: e.target.value })}
                          required
                          startAdornment={
                            <InputAdornment position="start">
                              <BookIcon color="primary" />
                            </InputAdornment>
                          }
                          sx={{
                            borderRadius: 2,
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: alpha(theme.palette.primary.main, 0.2),
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.primary.main,
                            },
                          }}
                        >
                          {subjects.map((subject) => (
                            <MenuItem key={subject} value={subject}>
                              {subject}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Class Field */}
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Assigned Class</InputLabel>
                        <Select
                          value={assign.assignedClass}
                          label="Assigned Class"
                          onChange={e => setAssign({ ...assign, assignedClass: e.target.value })}
                          required
                          startAdornment={
                            <InputAdornment position="start">
                              <ClassIcon color="primary" />
                            </InputAdornment>
                          }
                          sx={{
                            borderRadius: 2,
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: alpha(theme.palette.primary.main, 0.2),
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.primary.main,
                            },
                          }}
                        >
                          {classes.map((cls) => (
                            <MenuItem key={cls} value={cls}>
                              {cls}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        startIcon={<AssignmentIcon />}
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
                        {loading ? 'Assigning...' : 'Assign Teacher'}
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

export default React.memo(AdminAssignTeacher);