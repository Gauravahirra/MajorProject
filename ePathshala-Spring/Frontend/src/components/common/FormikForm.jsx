import React from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Chip,
  Paper,
  Grid,
  useTheme,
  Fade,
  Zoom
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import { useResponsive, buttonStyles, cardStyles } from '../../utils/responsive';
import { getFieldError, isFieldValid, isFieldInvalid, getPasswordStrength } from '../../utils/formikValidation';

const FormikForm = ({
  initialValues,
  validationSchema,
  onSubmit,
  title,
  subtitle,
  fields,
  submitButtonText = 'Submit',
  loading = false,
  success = '',
  error = '',
  onSuccess,
  onError,
  variant = 'default',
  maxWidth = 'md',
  showPasswordStrength = false,
  children
}) => {
  const theme = useTheme();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const result = await onSubmit(values);
      if (result && result.error) {
        onError?.(result.error);
      } else {
        onSuccess?.('Operation completed successfully!');
        resetForm();
      }
    } catch (err) {
      onError?.('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field, { values, errors, touched, setFieldValue, setFieldTouched }) => {
    const {
      name,
      label,
      type = 'text',
      placeholder,
      required = false,
      multiline = false,
      rows = 4,
      options = [],
      startIcon,
      endIcon,
      helperText,
      disabled = false,
      fullWidth = true,
      gridProps = { xs: 12, sm: 6 },
      ...fieldProps
    } = field;

    const error = getFieldError(touched, errors, name);
    const isValid = isFieldValid(touched, errors, name);
    const isInvalid = isFieldInvalid(touched, errors, name);

    const commonProps = {
      fullWidth,
      variant: 'outlined',
      size: isMobile ? 'small' : 'medium',
      error: isInvalid,
      helperText: error || helperText,
      disabled: disabled || loading,
      sx: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.02)',
          },
          '&.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isValid ? theme.palette.success.main : theme.palette.primary.main,
              borderWidth: 2,
            },
          },
          '&.Mui-error': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.error.main,
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
      },
    };

    // Password field with strength indicator
    if (type === 'password' && showPasswordStrength) {
      const passwordStrength = getPasswordStrength(values[name]);
      return (
        <Grid item {...gridProps} key={name}>
          <Box>
            <TextField
              {...commonProps}
              name={name}
              label={label}
              type={type}
              placeholder={placeholder}
              required={required}
              value={values[name]}
              onChange={(e) => setFieldValue(name, e.target.value)}
              onBlur={() => setFieldTouched(name, true)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setFieldValue('showPassword', !values.showPassword)}
                      edge="end"
                    >
                      {values.showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...fieldProps}
            />
            {values[name] && (
              <Box sx={{ mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={(passwordStrength.strength / 5) * 100}
                  color={passwordStrength.color}
                  sx={{ height: 4, borderRadius: 2 }}
                />
                <Typography
                  variant="caption"
                  color={passwordStrength.color}
                  sx={{ mt: 0.5, display: 'block' }}
                >
                  {passwordStrength.label}
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
      );
    }

    // Select field
    if (type === 'select') {
      return (
        <Grid item {...gridProps} key={name}>
          <FormControl {...commonProps}>
            <InputLabel>{label}</InputLabel>
            <Select
              name={name}
              value={values[name]}
              onChange={(e) => setFieldValue(name, e.target.value)}
              onBlur={() => setFieldTouched(name, true)}
              label={label}
              required={required}
              disabled={disabled || loading}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      );
    }

    // Textarea field
    if (multiline) {
      return (
        <Grid item {...gridProps} key={name}>
          <TextField
            {...commonProps}
            name={name}
            label={label}
            placeholder={placeholder}
            required={required}
            multiline
            rows={rows}
            value={values[name]}
            onChange={(e) => setFieldValue(name, e.target.value)}
            onBlur={() => setFieldTouched(name, true)}
            {...fieldProps}
          />
        </Grid>
      );
    }

    // Regular text field
    return (
      <Grid item {...gridProps} key={name}>
        <TextField
          {...commonProps}
          name={name}
          label={label}
          type={type}
          placeholder={placeholder}
          required={required}
          value={values[name]}
          onChange={(e) => setFieldValue(name, e.target.value)}
          onBlur={() => setFieldTouched(name, true)}
          InputProps={{
            startAdornment: startIcon && (
              <InputAdornment position="start">
                {startIcon}
              </InputAdornment>
            ),
            endAdornment: endIcon && (
              <InputAdornment position="end">
                {endIcon}
              </InputAdornment>
            ),
          }}
          {...fieldProps}
        />
      </Grid>
    );
  };

  const formVariants = {
    default: {
      container: {
        maxWidth,
        mx: 'auto',
        p: { xs: 2, sm: 3, md: 4 },
      },
      paper: {
        p: { xs: 2, sm: 3, md: 4 },
        borderRadius: 3,
        boxShadow: 2,
      },
    },
    compact: {
      container: {
        maxWidth: 'sm',
        mx: 'auto',
        p: { xs: 1, sm: 2 },
      },
      paper: {
        p: { xs: 2, sm: 3 },
        borderRadius: 2,
        boxShadow: 1,
      },
    },
    spacious: {
      container: {
        maxWidth: 'lg',
        mx: 'auto',
        p: { xs: 3, sm: 4, md: 6 },
      },
      paper: {
        p: { xs: 4, sm: 5, md: 6 },
        borderRadius: 4,
        boxShadow: 3,
      },
    },
  };

  const currentVariant = formVariants[variant];

  return (
    <Box sx={currentVariant.container}>
      <Fade in timeout={500}>
        <Paper sx={currentVariant.paper}>
          {title && (
            <Box sx={{ mb: 3, textAlign: 'center' }}>
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
                {title}
              </Typography>
              {subtitle && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    maxWidth: 'md',
                    mx: 'auto',
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          )}

          {loading && (
            <Box sx={{ mb: 2 }}>
              <LinearProgress />
            </Box>
          )}

          {success && (
            <Zoom in>
              <Alert
                severity="success"
                icon={<CheckCircleIcon />}
                sx={{ mb: 2 }}
                onClose={() => onSuccess?.('')}
              >
                {success}
              </Alert>
            </Zoom>
          )}

          {error && (
            <Zoom in>
              <Alert
                severity="error"
                icon={<ErrorIcon />}
                sx={{ mb: 2 }}
                onClose={() => onError?.('')}
              >
                {error}
              </Alert>
            </Zoom>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, setFieldValue, setFieldTouched, isSubmitting, isValid, dirty }) => (
              <Form>
                <Grid container spacing={{ xs: 2, sm: 3 }}>
                  {fields.map((field) => renderField(field, { values, errors, touched, setFieldValue, setFieldTouched }))}
                </Grid>

                {children}

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting || loading || !isValid || !dirty}
                    sx={{
                      ...buttonStyles.primary,
                      minWidth: { xs: 120, sm: 150 },
                      borderRadius: 3,
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1.5, sm: 2 },
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4,
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {isSubmitting || loading ? 'Processing...' : submitButtonText}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Paper>
      </Fade>
    </Box>
  );
};

export default FormikForm;
