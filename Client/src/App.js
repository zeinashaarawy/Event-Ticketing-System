import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Box,
  CssBaseline,
} from '@mui/material';

// Import components
import CreateEvent from './components/CreateEvent';
import EditEvent from './components/EditEvent';
import MyEvents from './components/MyEvents';
import BookingDetails from './components/BookingDetails';
import BookTicket from './components/BookTicket';
import TestAnalytics from './components/TestAnalytics';
import MyBookings from './components/MyBookings';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Event Ticketing System
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button color="inherit" href="/my-bookings">
                My Bookings
              </Button>
              <Button color="inherit" href="/my-events">
                My Events
              </Button>
              <Button color="inherit" href="/create-event">
                Create Event
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        <Container sx={{ mt: 4 }}>
          <Routes>
            <Route path="/test-analytics" element={<TestAnalytics />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/edit-event/:eventId" element={<EditEvent />} />
            <Route path="/my-events" element={<MyEvents />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/booking/:bookingId" element={<BookingDetails />} />
            <Route path="/book/:eventId" element={<BookTicket />} />
            <Route path="/" element={<MyEvents />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App; 