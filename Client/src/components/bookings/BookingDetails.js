import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Container, Grid } from '@mui/material';

const BookingDetails = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    // Fetch booking details
    const fetchBookingDetails = async () => {
      try {
        const response = await fetch(`/api/bookings/${bookingId}`);
        const data = await response.json();
        setBooking(data);
      } catch (error) {
        console.error('Error fetching booking details:', error);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  if (!booking) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Booking Details
      </Typography>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">Event: {booking.eventName}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>Booking ID: {booking.id}</Typography>
              <Typography>Number of Tickets: {booking.numberOfTickets}</Typography>
              <Typography>Total Amount: ${booking.totalAmount}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>Date: {new Date(booking.date).toLocaleDateString()}</Typography>
              <Typography>Status: {booking.status}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default BookingDetails; 