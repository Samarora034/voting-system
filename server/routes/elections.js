const express = require('express');
const router = express.Router();
const Election = require('../models/Election');

// Create election
router.post('/', async (req, res) => {
  try {
    const { title, description, registrationStart, registrationEnd, votingStart, votingEnd, resultsAt } = req.body;
    if (!title || !registrationStart || !registrationEnd || !votingStart || !votingEnd || !resultsAt) {
      return res.status(400).json({ error: 'All date fields and title are required' });
    }
    const election = new Election({ title, description, registrationStart, registrationEnd, votingStart, votingEnd, resultsAt });
    await election.save();
    res.status(201).json({ message: 'Election created', election });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List all elections
router.get('/', async (req, res) => {
  try {
    const elections = await Election.find().sort({ createdAt: -1 });
    res.json(elections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get election by ID
router.get('/:id', async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) return res.status(404).json({ error: 'Election not found' });
    res.json(election);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update election status
router.put('/:id', async (req, res) => {
  try {
    const election = await Election.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!election) return res.status(404).json({ error: 'Election not found' });
    res.json({ message: 'Election updated', election });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
