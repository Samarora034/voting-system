const mongoose = require('mongoose');

const voterSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  voterId: { type: String, required: true, unique: true, trim: true },
  hasVoted: { type: Boolean, default: false },
  votedFor: { type: mongoose.Schema.Types.ObjectId, ref: 'Party', default: null },
  votedAt: { type: Date, default: null },
  registeredAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Voter', voterSchema);
