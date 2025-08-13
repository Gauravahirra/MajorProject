import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Divider,
  Grid,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button
} from '@mui/material';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  FamilyRestroom as FamilyIcon,
  AdminPanelSettings as AdminIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useAuth } from '../../utils/auth';

function Profile() {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      let endpoint = '';
      
      // Determine endpoint based on role
      switch (user.role) {
        case 'ADMIN':
          endpoint = `/api/admin/dashboard-summary`;
          break;
        case 'TEACHER':
          endpoint = `/api/teacher/students/${user.assignedClass || 'default'}`;
          break;
        case 'STUDENT':
          endpoint = `/api/student/details/${user.id}`;
          break;
        case 'PARENT':
          endpoint = `/api/parent/leave/${user.id}`;
          break;
        default:
          throw new Error('Unknown user role');
      }

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile data: ${response.status}`);
      }

      const data = await response.json();
      setProfileData(data);
    } catch (err) {
      setError(err.message);
      // Fallback to basic user data
      setProfileData({
        name: user.name,
        email: user.email,
        role: user.role,
        accountNumber: user.accountNumber,
        assignedClass: user.assignedClass
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'ADMIN':
        return <AdminIcon />;
      case 'TEACHER':
        return <SchoolIcon />;
      case 'STUDENT':
        return <PersonIcon />;
      case 'PARENT':
        return <FamilyIcon />;
      default:
        return <PersonIcon />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'error';
      case 'TEACHER':
        return 'primary';
      case 'STUDENT':
        return 'success';
      case 'PARENT':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getRoleSpecificInfo = () => {
    if (!profileData) return null;

    switch (user.role) {
      case 'ADMIN':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>System Overview</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><PersonIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Total Users" 
                      secondary={profileData.totalUsers || 'N/A'} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><SchoolIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Active Classes" 
                      secondary={profileData.activeClasses || 'N/A'} 
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        );

      case 'TEACHER':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Teaching Info</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><SchoolIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Assigned Class" 
                      secondary={user.assignedClass || 'Not assigned'} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><PersonIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Students" 
                      secondary={profileData?.length || 0} 
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        );

      case 'STUDENT':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Academic Info</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><SchoolIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Class" 
                      secondary={user.assignedClass || 'Not assigned'} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><WorkIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Student ID" 
                      secondary={profileData?.id || user.accountNumber} 
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        );

      case 'PARENT':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Parent Info</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><FamilyIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Children" 
                      secondary={profileData?.length || 0} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><PhoneIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Contact" 
                      secondary={profileData?.phone || 'N/A'} 
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Please log in to view your profile.</Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Profile
      </Typography>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error} - Showing basic profile information.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Header Card */}
        <Grid item xs={12}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: `${getRoleColor(user.role)}.main`,
                    fontSize: '2rem'
                  }}
                >
                  {getRoleIcon(user.role)}
                </Avatar>
                
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Typography variant="h4" fontWeight="bold">
                      {user.name || 'User Name'}
                    </Typography>
                    <Chip
                      label={user.role}
                      color={getRoleColor(user.role)}
                      icon={getRoleIcon(user.role)}
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                  
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {user.email || 'No email provided'}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Edit Profile">
                      <IconButton
                        color="primary"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        {isEditing ? <CancelIcon /> : <EditIcon />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Basic Information */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List dense>
                <ListItem>
                  <ListItemIcon><EmailIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Email" 
                    secondary={user.email || 'Not provided'} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon><WorkIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Account Number" 
                    secondary={user.accountNumber || 'Not provided'} 
                  />
                </ListItem>
                
                {user.assignedClass && (
                  <ListItem>
                    <ListItemIcon><SchoolIcon color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="Class" 
                      secondary={user.assignedClass} 
                    />
                  </ListItem>
                )}
                
                <ListItem>
                  <ListItemIcon><CalendarIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Member Since" 
                    secondary={new Date().toLocaleDateString()} 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Role-Specific Information */}
        <Grid item xs={12} md={6}>
          {getRoleSpecificInfo()}
        </Grid>

        {/* Account Actions */}
        <Grid item xs={12}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Account Actions
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<EditIcon />}
                >
                  Change Password
                </Button>
                
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<EmailIcon />}
                >
                  Update Email
                </Button>
                
                <Button
                  variant="contained"
                  color="error"
                  onClick={logout}
                >
                  Logout
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Profile;