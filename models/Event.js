const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  ticketsAvailable: { type: Number, required: true },
  ticketPrice: { type: Number, required: true },
  status: { type: String, enum: ['approved', 'pending', 'declined'], default: 'pending' },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Event', eventSchema);
