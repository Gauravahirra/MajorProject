import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import { getDashboardSummary } from '../../api/admin';

function AdminSummary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSummary() {
      setLoading(true);
      setError('');
      try {
        const data = await getDashboardSummary();
        setSummary(data);
      } catch (err) {
        setError('Failed to load summary');
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  if (loading) return <CircularProgress sx={{ m: 2 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Students</Typography>
            <Typography variant="h4" color="primary">{summary?.students ?? 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Teachers</Typography>
            <Typography variant="h4" color="primary">{summary?.teachers ?? 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Parents</Typography>
            <Typography variant="h4" color="primary">{summary?.parents ?? 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Events</Typography>
            <Typography variant="h4" color="primary">{summary?.events ?? 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default React.memo(AdminSummary);