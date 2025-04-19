// server.js

require('dotenv').config();    // only once, loads .env from project root
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const userRoutes    = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const eventRoutes   = require('./routes/eventRoutes');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running and connected to Atlas!');
});

app.use('/api/v1/users',    userRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/events',   eventRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));