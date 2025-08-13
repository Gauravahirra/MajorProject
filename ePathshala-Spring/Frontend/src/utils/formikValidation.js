import * as Yup from 'yup';

// Common validation patterns
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

// Login Form Validation Schema
export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  role: Yup.string()
    .oneOf(['ADMIN', 'STUDENT', 'TEACHER', 'PARENT'], 'Please select a valid role')
    .required('Role is required'),
});

// Contact Form Validation Schema
export const contactValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be no more than 50 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  subject: Yup.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject must be no more than 100 characters')
    .required('Subject is required'),
  message: Yup.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be no more than 1000 characters')
    .required('Message is required'),
});

// Student Form Validation Schema
export const studentValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be no more than 50 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(passwordPattern, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
    .required('Password is required'),
  studentClass: Yup.string()
    .min(1, 'Class is required')
    .max(20, 'Class name must be no more than 20 characters')
    .required('Class is required'),
  rollNumber: Yup.string()
    .min(1, 'Roll number is required')
    .max(20, 'Roll number must be no more than 20 characters'),
  phone: Yup.string()
    .matches(phonePattern, 'Please enter a valid phone number')
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be no more than 15 digits'),
  address: Yup.string()
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address must be no more than 200 characters'),
});

// Teacher Form Validation Schema
export const teacherValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be no more than 50 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(passwordPattern, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
    .required('Password is required'),
  subject: Yup.string()
    .min(2, 'Subject must be at least 2 characters')
    .max(50, 'Subject must be no more than 50 characters')
    .required('Subject is required'),
  assignedClass: Yup.string()
    .min(1, 'Assigned class is required')
    .max(20, 'Class name must be no more than 20 characters')
    .required('Assigned class is required'),
  phone: Yup.string()
    .matches(phonePattern, 'Please enter a valid phone number')
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be no more than 15 digits'),
  qualification: Yup.string()
    .min(5, 'Qualification must be at least 5 characters')
    .max(100, 'Qualification must be no more than 100 characters'),
  experience: Yup.number()
    .min(0, 'Experience cannot be negative')
    .max(50, 'Experience cannot be more than 50 years'),
});

// Parent Form Validation Schema
export const parentValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be no more than 50 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(passwordPattern, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
    .required('Password is required'),
  phone: Yup.string()
    .matches(phonePattern, 'Please enter a valid phone number')
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be no more than 15 digits')
    .required('Phone number is required'),
  address: Yup.string()
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address must be no more than 200 characters')
    .required('Address is required'),
  childName: Yup.string()
    .min(2, 'Child name must be at least 2 characters')
    .max(50, 'Child name must be no more than 50 characters'),
  childClass: Yup.string()
    .min(1, 'Child class is required')
    .max(20, 'Class name must be no more than 20 characters'),
});

// Assignment Form Validation Schema
export const assignmentValidationSchema = Yup.object({
  title: Yup.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be no more than 100 characters')
    .required('Title is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be no more than 500 characters')
    .required('Description is required'),
  dueDate: Yup.date()
    .min(new Date(), 'Due date cannot be in the past')
    .required('Due date is required'),
  subject: Yup.string()
    .min(2, 'Subject must be at least 2 characters')
    .max(50, 'Subject must be no more than 50 characters')
    .required('Subject is required'),
  class: Yup.string()
    .min(1, 'Class is required')
    .max(20, 'Class name must be no more than 20 characters')
    .required('Class is required'),
  maxScore: Yup.number()
    .min(1, 'Maximum score must be at least 1')
    .max(100, 'Maximum score cannot be more than 100')
    .required('Maximum score is required'),
});

// Exam Form Validation Schema
export const examValidationSchema = Yup.object({
  title: Yup.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be no more than 100 characters')
    .required('Title is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be no more than 500 characters')
    .required('Description is required'),
  startTime: Yup.date()
    .min(new Date(), 'Start time cannot be in the past')
    .required('Start time is required'),
  endTime: Yup.date()
    .min(Yup.ref('startTime'), 'End time must be after start time')
    .required('End time is required'),
  subject: Yup.string()
    .min(2, 'Subject must be at least 2 characters')
    .max(50, 'Subject must be no more than 50 characters')
    .required('Subject is required'),
  class: Yup.string()
    .min(1, 'Class is required')
    .max(20, 'Class name must be no more than 20 characters')
    .required('Class is required'),
  totalMarks: Yup.number()
    .min(1, 'Total marks must be at least 1')
    .max(100, 'Total marks cannot be more than 100')
    .required('Total marks is required'),
  duration: Yup.number()
    .min(15, 'Duration must be at least 15 minutes')
    .max(180, 'Duration cannot be more than 3 hours')
    .required('Duration is required'),
});

// Leave Request Form Validation Schema
export const leaveRequestValidationSchema = Yup.object({
  reason: Yup.string()
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason must be no more than 500 characters')
    .required('Reason is required'),
  startDate: Yup.date()
    .min(new Date(), 'Start date cannot be in the past')
    .required('Start date is required'),
  endDate: Yup.date()
    .min(Yup.ref('startDate'), 'End date must be after start date')
    .required('End date is required'),
  leaveType: Yup.string()
    .oneOf(['SICK', 'CASUAL', 'EMERGENCY', 'OTHER'], 'Please select a valid leave type')
    .required('Leave type is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be no more than 1000 characters'),
});

// Password Reset Form Validation Schema
export const passwordResetValidationSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(passwordPattern, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

// Profile Update Form Validation Schema
export const profileUpdateValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be no more than 50 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(phonePattern, 'Please enter a valid phone number')
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be no more than 15 digits'),
  address: Yup.string()
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address must be no more than 200 characters'),
  bio: Yup.string()
    .max(500, 'Bio must be no more than 500 characters'),
});

// Common form validation helpers
export const getFieldError = (touched, errors, fieldName) => {
  return touched[fieldName] && errors[fieldName] ? errors[fieldName] : '';
};

export const isFieldValid = (touched, errors, fieldName) => {
  return touched[fieldName] && !errors[fieldName];
};

export const isFieldInvalid = (touched, errors, fieldName) => {
  return touched[fieldName] && errors[fieldName];
};

// Form submission helpers
export const handleFormSubmit = async (values, submitFunction, setSubmitting, setSuccess, setError) => {
  try {
    setError('');
    const result = await submitFunction(values);
    if (result && result.error) {
      setError(result.error);
    } else {
      setSuccess('Operation completed successfully!');
      return true;
    }
  } catch (err) {
    setError('An error occurred. Please try again.');
  } finally {
    setSubmitting(false);
  }
  return false;
};

// Password strength indicator
export const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: '', color: 'grey' };
  
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
  
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['error', 'warning', 'info', 'success', 'success'];
  
  return {
    strength: strength,
    label: labels[strength - 1] || 'Very Weak',
    color: colors[strength - 1] || 'error'
  };
};

export default {
  loginValidationSchema,
  contactValidationSchema,
  studentValidationSchema,
  teacherValidationSchema,
  parentValidationSchema,
  assignmentValidationSchema,
  examValidationSchema,
  leaveRequestValidationSchema,
  passwordResetValidationSchema,
  profileUpdateValidationSchema,
  getFieldError,
  isFieldValid,
  isFieldInvalid,
  handleFormSubmit,
  getPasswordStrength,
};
