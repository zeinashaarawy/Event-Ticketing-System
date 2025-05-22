import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserBookings } from '../api';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await getUserBookings();
      setBookings(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Bookings
      </Typography>

      {bookings.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>You haven't made any bookings yet.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item xs={12} key={booking._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {booking.event.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Typography color="text.secondary">
                      Date: {new Date(booking.event.date).toLocaleDateString()}
                    </Typography>
                    <Typography color="text.secondary">
                      Tickets: {booking.numberOfTickets}
                    </Typography>
                    <Typography color="text.secondary">
                      Total: ${booking.totalAmount}
                    </Typography>
                  </Box>
                  <Chip
                    label={booking.status}
                    color={booking.status === 'confirmed' ? 'success' : 'default'}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => navigate(`/booking/${booking._id}`)}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyBookings; 