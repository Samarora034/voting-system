const express = require('express');
const router = express.Router();
const Voter = require('../models/Voter');

// Register voter
router.post('/register', async (req, res) => {
  try {
    const { name, email, voterId } = req.body;
    if (!name || !email || !voterId) {
      return res.status(400).json({ error: 'Name, email, and voter ID are required' });
    }
    const existing = await Voter.findOne({ $or: [{ email }, { voterId }] });
    if (existing) {
      return res.status(409).json({ error: 'Voter with this email or voter ID already exists' });
    }
    const voter = new Voter({ name, email, voterId });
    await voter.save();
    res.status(201).json({ message: 'Voter registered successfully', voter: { _id: voter._id, name: voter.name, email: voter.email, voterId: voter.voterId } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login voter
router.post('/login', async (req, res) => {
  try {
    const { voterId, email } = req.body;
    if (!voterId || !email) {
      return res.status(400).json({ error: 'Voter ID and email are required' });
    }
    const voter = await Voter.findOne({ voterId, email });
    if (!voter) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ message: 'Login successful', voter: { _id: voter._id, name: voter.name, email: voter.email, voterId: voter.voterId, hasVoted: voter.hasVoted } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get voter status
router.get('/status/:voterId', async (req, res) => {
  try {
    const voter = await Voter.findOne({ voterId: req.params.voterId }).populate('votedFor', 'name symbol');
    if (!voter) return res.status(404).json({ error: 'Voter not found' });
    res.json({ name: voter.name, hasVoted: voter.hasVoted, votedFor: voter.votedFor, votedAt: voter.votedAt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
