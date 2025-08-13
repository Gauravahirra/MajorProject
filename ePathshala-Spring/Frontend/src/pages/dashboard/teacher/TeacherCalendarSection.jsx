import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material';
import { getEvents } from '../../../api/calendar';

function TeacherCalendarSection() {
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

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Academic Calendar
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <List>
          {events && events.length > 0 ? (
            events.map((event, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={event.eventName}
                  secondary={`${event.date} - ${event.description}`}
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No events found" />
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );
}

export default React.memo(TeacherCalendarSection); 