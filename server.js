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
