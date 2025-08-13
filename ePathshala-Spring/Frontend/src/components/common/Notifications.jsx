import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import Snackbar from '@mui/material/Snackbar';

function Notifications() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe('/topic/assignment', msg => {
          const data = JSON.parse(msg.body);
          setMessage(`New assignment uploaded: ${data.title || ''}`);
          setOpen(true);
        });
        client.subscribe('/topic/leaveApproval', msg => {
          const data = JSON.parse(msg.body);
          setMessage(`Your leave request was ${data.status}`);
          setOpen(true);
        });
      },
    });
    client.activate();
    return () => {
      client.deactivate();
    };
  }, []);

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={() => setOpen(false)}
      message={message}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    />
  );
}

export default Notifications;