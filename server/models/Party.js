const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  symbol: { type: String, required: true, trim: true },
  leader: { type: String, required: true, trim: true },
  manifesto: { type: String, default: '' },
  logoUrl: { type: String, default: '' },
  registeredAt: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false }
});

module.exports = mongoose.model('Party', partySchema);
