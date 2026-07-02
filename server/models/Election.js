const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  registrationStart: { type: Date, required: true },
  registrationEnd: { type: Date, required: true },
  votingStart: { type: Date, required: true },
  votingEnd: { type: Date, required: true },
  resultsAt: { type: Date, required: true },
  status: { type: String, enum: ['upcoming', 'registration', 'voting', 'completed'], default: 'upcoming' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Election', electionSchema);
