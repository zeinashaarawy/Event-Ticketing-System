import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Alert,
} from '@mui/material';

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/bookings/my-bookings');
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Failed to load bookings');
      }
    };

    fetchBookings();
  }, []);

  const handleViewDetails = (bookingId) => {
    navigate(`/booking/${bookingId}`);
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        My Bookings
      </Typography>
      <Grid container spacing={3}>
        {bookings.length === 0 ? (
          <Grid item xs={12}>
            <Typography>No bookings found</Typography>
          </Grid>
        ) : (
          bookings.map((booking) => (
            <Grid item xs={12} key={booking.id}>
              <Card>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6">{booking.eventName}</Typography>
                      <Typography color="textSecondary">
                        {new Date(booking.date).toLocaleDateString()}
                      </Typography>
                      <Typography>Number of Tickets: {booking.numberOfTickets}</Typography>
                      <Typography>Total Amount: ${booking.totalAmount}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} container justifyContent="flex-end">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleViewDetails(booking.id)}
                      >
                        View Details
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default MyBookings; 