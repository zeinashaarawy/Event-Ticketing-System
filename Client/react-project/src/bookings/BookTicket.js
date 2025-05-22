import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { bookTickets } from '../../../src/api';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';

const BookTicket = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [numberOfTickets, setNumberOfTickets] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await bookTickets({
        eventId,
        numberOfTickets: parseInt(numberOfTickets),
      });

      // Navigate to booking details page
      navigate(`/booking/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error making booking');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Book Tickets
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            required
            fullWidth
            type="number"
            label="Number of Tickets"
            value={numberOfTickets}
            onChange={(e) => setNumberOfTickets(e.target.value)}
            inputProps={{ min: 1 }}
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                'Book Now'
              )}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default BookTicket; 