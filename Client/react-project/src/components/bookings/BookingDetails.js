import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingDetails, cancelBooking } from '../../../../src/api';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Chip,
  Divider,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { format } from 'date-fns';
import { Event, LocationOn, ConfirmationNumber, AttachMoney, Person, EventSeat, CalendarToday } from '@mui/icons-material';

const BookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const response = await getBookingDetails(bookingId);
      setBooking(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    try {
      await cancelBooking(bookingId);
      setCancelSuccess(true);
      setCancelDialogOpen(false);
      setTimeout(() => {
        navigate('/my-bookings');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error canceling booking');
      setCancelDialogOpen(false);
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
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/my-bookings')}>
          Back to My Bookings
        </Button>
      </Container>
    );
  }

  if (!booking) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">Booking not found</Alert>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={() => navigate('/my-bookings')}>
            Back to My Bookings
          </Button>
        </Box>
      </Container>
    );
  }

  if (cancelSuccess) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="success">
          Booking cancelled successfully! Redirecting...
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Booking Details
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {/* Event Information */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom color="primary">
              Event Information
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6">{booking.event.title}</Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday fontSize="small" />
                  <Typography>
                    {new Date(booking.event.date).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn fontSize="small" />
                  <Typography>{booking.event.venue}</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Booking Information */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom color="primary">
              Booking Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <EventSeat />
                    <Typography variant="subtitle1">Number of Tickets</Typography>
                  </Box>
                  <Typography variant="h6">{booking.numberOfTickets}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <AttachMoney />
                    <Typography variant="subtitle1">Total Amount</Typography>
                  </Box>
                  <Typography variant="h6">
                    ${(booking.totalAmount).toFixed(2)}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Booking Status */}
          <Grid item xs={12}>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Booking Status
              </Typography>
              <Chip
                label={booking.status}
                color={booking.status === 'confirmed' ? 'success' : 'default'}
                sx={{ textTransform: 'capitalize' }}
              />
            </Box>
          </Grid>

          {/* Booking Details */}
          <Grid item xs={12}>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Booking Reference
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {booking._id}
              </Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Booked On
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {new Date(booking.createdAt).toLocaleString()}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/my-bookings')}
          >
            Back to My Bookings
          </Button>
          {booking.status !== 'cancelled' && (
            <Button
              variant="contained"
              color="error"
              onClick={() => setCancelDialogOpen(true)}
            >
              Cancel Booking
            </Button>
          )}
        </Box>
      </Paper>

      {/* Cancel Booking Dialog */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this booking? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>
            Keep Booking
          </Button>
          <Button onClick={handleCancelBooking} color="error">
            Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookingDetails; 