const path = require('path');
require('dotenv').config({ 
  path: path.resolve(__dirname, '../.env.js')  // Absolute path
});


const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

// Import routes
const userRoutes = require('./routes/userRoutes'); 
const bookingRoutes = require('./routes/bookingRoutes');
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
connectDB();





const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running and connected to Atlas!');
});

//  Mount user routes
app.use('/api/v1/users' , userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/events', eventRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
