const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  voter: { type: mongoose.Schema.Types.ObjectId, ref: 'Voter', required: true },
  party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party', required: true },
  election: { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true },
  timestamp: { type: Date, default: Date.now }
});

voteSchema.index({ voter: 1, election: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
