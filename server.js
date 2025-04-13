<<<<<<< HEAD
// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Ensure this path is correct
const cors = require('cors');

// Initialize dotenv
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running and connected to Atlas!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
=======
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler'); // Import the error handler

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Define routes (your routes will go here)
// Example: app.use('/api/v1/events', eventRoutes);

// Error handling middleware (should be the last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
>>>>>>> 447231c998e7983f1aed623df73e3f453e480e23
