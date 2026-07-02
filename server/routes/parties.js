const express = require('express');
const router = express.Router();
const Party = require('../models/Party');

// Register a new party
router.post('/', async (req, res) => {
  try {
    const { name, symbol, leader, manifesto, logoUrl } = req.body;
    if (!name || !symbol || !leader) {
      return res.status(400).json({ error: 'Name, symbol, and leader are required' });
    }
    const existing = await Party.findOne({ name });
    if (existing) {
      return res.status(409).json({ error: 'Party with this name already exists' });
    }
    const party = new Party({ name, symbol, leader, manifesto, logoUrl });
    await party.save();
    res.status(201).json({ message: 'Party registered successfully. Awaiting approval.', party });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all approved parties
router.get('/', async (req, res) => {
  try {
    const parties = await Party.find({ approved: true }).sort({ name: 1 });
    res.json(parties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all parties (including unapproved - for admin)
router.get('/all', async (req, res) => {
  try {
    const parties = await Party.find().sort({ registeredAt: -1 });
    res.json(parties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get party by ID
router.get('/:id', async (req, res) => {
  try {
    const party = await Party.findById(req.params.id);
    if (!party) return res.status(404).json({ error: 'Party not found' });
    res.json(party);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve a party (admin)
router.put('/:id/approve', async (req, res) => {
  try {
    const party = await Party.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    if (!party) return res.status(404).json({ error: 'Party not found' });
    res.json({ message: 'Party approved', party });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
