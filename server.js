const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/db');

// ✅ Load environment variables from .env in root folder
dotenv.config(); // No need for path override if .env is in root

// ✅ Connect to MongoDB
connectDB();

// ✅ Import routes
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('Backend is running and connected to Atlas!');
});

// ✅ Mount routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1', authRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/events', eventRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
