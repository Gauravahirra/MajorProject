import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
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
  Chip,
  Paper,
  Divider
} from '@mui/material';
import {
  Event as EventIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { getEvents, addEvent, deleteEvent } from '../../api/admin';

function AdminAcademicCalendar() {
  const theme = useTheme();
  const [eventForm, setEventForm] = useState({ eventName: '', date: '', description: '' });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const onAddEvent = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      await addEvent(eventForm);
      setSuccess('Event added successfully!');
      setEventForm({ eventName: '', date: '', description: '' });
      fetchEvents();
    } catch (err) {
      setError('Failed to add event');
    }
  };

  const onDeleteEvent = async (id) => {
    setSuccess('');
    setError('');
    try {
      await deleteEvent(id);
      setSuccess('Event deleted successfully!');
      fetchEvents();
    } catch (err) {
      setError('Failed to delete event');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
              <CalendarIcon sx={{ fontSize: 40 }} />
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
              Academic Calendar
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage academic events and schedules
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Add Event Form */}
            <Grid item xs={12} md={4}>
              <Slide direction="up" in={true} timeout={1000}>
                <Card
                  sx={{
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    boxShadow: theme.shadows[8],
                    borderRadius: 3,
                    height: 'fit-content'
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Add New Event
                    </Typography>
                    <Box component="form" onSubmit={onAddEvent}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Event Name"
                            value={eventForm.eventName}
                            onChange={e => setEventForm({ ...eventForm, eventName: e.target.value })}
                            required
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EventIcon color="primary" />
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
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            type="date"
                            label="Event Date"
                            value={eventForm.date}
                            onChange={e => setEventForm({ ...eventForm, date: e.target.value })}
                            required
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <ScheduleIcon color="primary" />
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
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Description"
                            multiline
                            rows={3}
                            value={eventForm.description}
                            onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <DescriptionIcon color="primary" />
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
                        <Grid item xs={12}>
                          <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading}
                            startIcon={<AddIcon />}
                            fullWidth
                            sx={{
                              py: 1.5,
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
                            Add Event
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              </Slide>
            </Grid>

            {/* Events List */}
            <Grid item xs={12} md={8}>
              <Slide direction="up" in={true} timeout={1200}>
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
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Academic Events
                    </Typography>

                    {events.length > 0 ? (
                      <List sx={{ p: 0 }}>
                        {events.map((event, index) => (
                          <Box key={event.id}>
                            <Paper
                              sx={{
                                p: 3,
                                mb: 2,
                                borderRadius: 2,
                                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.6)} 100%)`,
                                backdropFilter: 'blur(10px)',
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  boxShadow: theme.shadows[4],
                                },
                              }}
                            >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box sx={{ flexGrow: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <EventIcon color="primary" />
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                      {event.eventName}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <ScheduleIcon color="action" sx={{ fontSize: 16 }} />
                                    <Typography variant="body2" color="text.secondary">
                                      {formatDate(event.date)}
                                    </Typography>
                                  </Box>
                                  {event.description && (
                                    <Typography variant="body2" color="text.secondary">
                                      {event.description}
                                    </Typography>
                                  )}
                                </Box>
                                <IconButton
                                  onClick={() => onDeleteEvent(event.id)}
                                  sx={{
                                    color: 'error.main',
                                    '&:hover': {
                                      backgroundColor: alpha(theme.palette.error.main, 0.1),
                                    },
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </Paper>
                            {index < events.length - 1 && (
                              <Divider sx={{ my: 1, opacity: 0.3 }} />
                            )}
                          </Box>
                        ))}
                      </List>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <EventIcon sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
                        <Typography variant="body1" color="text.secondary">
                          No events found. Add your first academic event!
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Slide>
            </Grid>
          </Grid>

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

export default React.memo(AdminAcademicCalendar);