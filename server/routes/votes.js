const express = require('express');
const router = express.Router();
const Vote = require('../models/Vote');
const Voter = require('../models/Voter');
const Party = require('../models/Party');
const Election = require('../models/Election');

// Cast vote
router.post('/', async (req, res) => {
  try {
    const { voterId, partyId, electionId } = req.body;
    if (!voterId || !partyId || !electionId) {
      return res.status(400).json({ error: 'Voter ID, party ID, and election ID are required' });
    }

    // Check election is in voting phase
    const election = await Election.findById(electionId);
    if (!election) return res.status(404).json({ error: 'Election not found' });
    if (election.status !== 'voting') {
      return res.status(403).json({ error: 'Voting is not currently open for this election' });
    }

    // Check voter exists and hasn't voted
    const voter = await Voter.findById(voterId);
    if (!voter) return res.status(404).json({ error: 'Voter not found' });
    if (voter.hasVoted) return res.status(403).json({ error: 'You have already cast your vote' });

    // Check party is approved
    const party = await Party.findById(partyId);
    if (!party || !party.approved) return res.status(404).json({ error: 'Party not found or not approved' });

    // Cast vote
    const vote = new Vote({ voter: voterId, party: partyId, election: electionId });
    await vote.save();

    // Update voter status
    voter.hasVoted = true;
    voter.votedFor = partyId;
    voter.votedAt = new Date();
    await voter.save();

    res.status(201).json({ message: 'Vote cast successfully!' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(403).json({ error: 'You have already voted in this election' });
    }
    res.status(500).json({ error: err.message });
  }
});

// Get results for an election
router.get('/results/:electionId', async (req, res) => {
  try {
    const results = await Vote.aggregate([
      { $match: { election: require('mongoose').Types.ObjectId.createFromHexString(req.params.electionId) } },
      { $group: { _id: '$party', votes: { $sum: 1 } } },
      { $sort: { votes: -1 } },
      { $lookup: { from: 'parties', localField: '_id', foreignField: '_id', as: 'party' } },
      { $unwind: '$party' },
      { $project: { _id: 0, party: { _id: 1, name: 1, symbol: 1, leader: 1, logoUrl: 1 }, votes: 1 } }
    ]);

    const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);
    const resultsWithPercentage = results.map(r => ({
      ...r,
      percentage: totalVotes > 0 ? ((r.votes / totalVotes) * 100).toFixed(1) : 0
    }));

    res.json({ totalVotes, results: resultsWithPercentage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Live leaderboard
router.get('/leaderboard/:electionId', async (req, res) => {
  try {
    const results = await Vote.aggregate([
      { $match: { election: require('mongoose').Types.ObjectId.createFromHexString(req.params.electionId) } },
      { $group: { _id: '$party', votes: { $sum: 1 } } },
      { $sort: { votes: -1 } },
      { $lookup: { from: 'parties', localField: '_id', foreignField: '_id', as: 'party' } },
      { $unwind: '$party' },
      { $project: { _id: 0, party: { _id: 1, name: 1, symbol: 1, logoUrl: 1 }, votes: 1 } }
    ]);

    const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);
    res.json({ totalVotes, leaderboard: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
