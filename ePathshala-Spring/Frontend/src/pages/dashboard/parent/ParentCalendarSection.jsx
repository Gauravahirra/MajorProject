import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Alert } from '@mui/material';
import { getEvents } from '../../../api/calendar';

function ParentCalendarSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const eventsData = await getEvents();
      setEvents(Array.isArray(eventsData) ? eventsData : []);
    } catch (err) {
      setError('Failed to load academic calendar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Academic Calendar
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <List>
          {events && events.length > 0 ? (
            events.map((event, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={event.eventName}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        Date: {formatDate(event.date)}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="text.secondary">
                        {event.description}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No calendar events found" />
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );
}

export default React.memo(ParentCalendarSection); 