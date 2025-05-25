import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
} from '@mui/material';

const BookTicket = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event details:', error);
        setError('Failed to load event details');
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleBooking = async () => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          numberOfTickets,
        }),
      });

      if (!response.ok) {
        throw new Error('Booking failed');
      }

      const booking = await response.json();
      navigate(`/booking/${booking.id}`);
    } catch (error) {
      console.error('Error creating booking:', error);
      setError('Failed to create booking');
    }
  };

  if (!event) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Book Tickets
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6">{event.name}</Typography>
              <Typography color="textSecondary">
                {new Date(event.date).toLocaleDateString()}
              </Typography>
              <Typography>Price per ticket: ${event.price}</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="number"
                label="Number of Tickets"
                value={numberOfTickets}
                onChange={(e) => setNumberOfTickets(Math.max(1, parseInt(e.target.value)))}
                fullWidth
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">
                Total Amount: ${(event.price * numberOfTickets).toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleBooking}
                fullWidth
              >
                Confirm Booking
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default BookTicket; 