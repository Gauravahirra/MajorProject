import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fade,
  Zoom,
  LinearProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  School as SchoolIcon,
  Subject as SubjectIcon,
  Work as WorkIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { Formik, Form } from 'formik';
import { addTeacher } from '../../api/admin';
import { teacherValidationSchema } from '../../utils/formikValidation';

function AdminAddTeacher() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const initialValues = {
    name: '',
    email: '',
    password: '',
    subject: '',
    assignedClass: '',
    phone: '',
    qualification: '',
    experience: ''
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    setSuccess('');
    setError('');
    
    try {
      // Only send the fields that the backend UserDTO expects
      const teacherData = {
        name: values.name,
        email: values.email,
        password: values.password,
        subject: values.subject,
        assignedClass: values.assignedClass
        // Note: phone, qualification, experience are not supported by the backend UserDTO
      };
      
      const result = await addTeacher(teacherData);
      if (result && result.error) {
        setError(result.error);
      } else {
        setSuccess('Teacher added successfully!');
        resetForm();
      }
    } catch (err) {
      setError('Failed to add teacher. Please try again.');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const teacherFields = [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
      startIcon: <PersonIcon />,
      placeholder: 'Enter teacher full name',
      gridProps: { xs: 12, sm: 6 }
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      startIcon: <EmailIcon />,
      placeholder: 'Enter teacher email address',
      gridProps: { xs: 12, sm: 6 }
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      startIcon: <LockIcon />,
      placeholder: 'Enter secure password',
      gridProps: { xs: 12, sm: 6 }
    },
    {
      name: 'subject',
      label: 'Subject',
      type: 'text',
      required: true,
      startIcon: <SubjectIcon />,
      placeholder: 'Enter subject taught',
      gridProps: { xs: 12, sm: 6 }
    },
    {
      name: 'assignedClass',
      label: 'Assigned Class',
      type: 'text',
      required: true,
      startIcon: <SchoolIcon />,
      placeholder: 'Enter assigned class',
      gridProps: { xs: 12, sm: 6 }
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel',
      required: false,
      placeholder: 'Enter phone number',
      gridProps: { xs: 12, sm: 6 }
    },
    {
      name: 'qualification',
      label: 'Qualification',
      type: 'text',
      required: false,
      placeholder: 'Enter qualification details',
      gridProps: { xs: 12, sm: 6 }
    },
    {
      name: 'experience',
      label: 'Years of Experience',
      type: 'number',
      required: false,
      placeholder: 'Enter years of experience',
      gridProps: { xs: 12, sm: 6 }
    }
  ];

  return (
    <Box sx={{ py: 3 }}>
      <Fade in timeout={500}>
        <Paper elevation={4} sx={{
          p: { xs: 3, sm: 4, md: 5 },
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                color: 'primary.main',
              }}
            >
              Add New Teacher
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.875rem', sm: '1rem' },
                maxWidth: 'md',
                mx: 'auto',
              }}
            >
              Enter teacher information to create a new account in the system
            </Typography>
          </Box>

          {/* Info Alert about field limitations */}
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Note:</strong> Only the following fields will be saved to the system: Name, Email, Password, Subject, and Assigned Class. 
              Additional fields (Phone, Qualification, Experience) are for display purposes only.
            </Typography>
          </Alert>

          {/* Loading Progress */}
          {loading && (
            <Box sx={{ mb: 3 }}>
              <LinearProgress />
            </Box>
          )}

          {/* Success Message */}
          {success && (
            <Zoom in>
              <Alert
                severity="success"
                icon={<CheckCircleIcon />}
                sx={{ mb: 3 }}
                onClose={() => setSuccess('')}
              >
                {success}
              </Alert>
            </Zoom>
          )}

          {/* Error Message */}
          {error && (
            <Zoom in>
              <Alert
                severity="error"
                icon={<ErrorIcon />}
                sx={{ mb: 3 }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            </Zoom>
          )}

          {/* Teacher Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={teacherValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, setFieldValue, setFieldTouched, isSubmitting, isValid, dirty }) => (
              <Form>
                <Grid container spacing={3}>
                  {teacherFields.map((field) => {
                    const {
                      name,
                      label,
                      type = 'text',
                      placeholder,
                      required = false,
                      startIcon,
                      gridProps = { xs: 12, sm: 6 },
                      ...fieldProps
                    } = field;

                    const error = touched[name] && errors[name];
                    const isValid = touched[name] && !errors[name];

                    return (
                      <Grid item {...gridProps} key={name}>
                        <TextField
                          fullWidth
                          name={name}
                          label={label}
                          type={type}
                          placeholder={placeholder}
                          required={required}
                          value={values[name]}
                          onChange={(e) => setFieldValue(name, e.target.value)}
                          onBlur={() => setFieldTouched(name, true)}
                          error={Boolean(error)}
                          helperText={error}
                          variant="outlined"
                          size="medium"
                          disabled={loading}
                          InputProps={{
                            startAdornment: startIcon && (
                              <Box sx={{ mr: 1, color: 'text.secondary' }}>
                                {startIcon}
                              </Box>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.02)',
                              },
                              '&.Mui-focused': {
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: isValid ? 'success.main' : 'primary.main',
                                  borderWidth: 2,
                                },
                              },
                              '&.Mui-error': {
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'error.main',
                                  borderWidth: 2,
                                },
                              },
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                            },
                            '& .MuiInputBase-input': {
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                            },
                            '& .MuiFormHelperText-root': {
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              marginLeft: 0,
                            },
                          }}
                          {...fieldProps}
                        />
                      </Grid>
                    );
                  })}
                </Grid>

                {/* Submit Button */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting || loading || !isValid || !dirty}
                    sx={{
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
                    {isSubmitting || loading ? 'Adding Teacher...' : 'Add Teacher'}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Paper>
      </Fade>
    </Box>
  );
}

export default React.memo(AdminAddTeacher);