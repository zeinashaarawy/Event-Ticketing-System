
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

const connectDB = require('./config/db');


const userRoutes    = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');


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



//  Mount user routes 
app.use('/api/v1/users' , userRoutes);
 app.use('/api/v1', authRoutes);

app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/events',   eventRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
