import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Vote, CheckCircle, AlertCircle, LogIn } from 'lucide-react';
import api from '../api';

function VotingPage() {
  const [parties, setParties] = useState([]);
  const [election, setElection] = useState(null);
  const [selectedParty, setSelectedParty] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const voter = JSON.parse(localStorage.getItem('voter') || 'null');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [partiesRes, electionsRes] = await Promise.all([
          api.get('/parties'),
          api.get('/elections')
        ]);
        setParties(partiesRes.data);
        if (electionsRes.data.length > 0) {
          setElection(electionsRes.data[0]);
        }

        // Check if voter has already voted
        if (voter?.hasVoted) {
          setHasVoted(true);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleVote = async () => {
    if (!selectedParty || !voter || !election) return;
    setVoting(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await api.post('/votes', {
        voterId: voter._id,
        partyId: selectedParty,
        electionId: election._id
      });
      setStatus({ type: 'success', message: res.data.message });
      setHasVoted(true);
      // Update local storage
      localStorage.setItem('voter', JSON.stringify({ ...voter, hasVoted: true }));
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || 'Failed to cast vote' });
    } finally {
      setVoting(false);
    }
  };

  if (!voter) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <LogIn className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Login Required</h2>
        <p className="text-slate-500 mb-6">You need to log in before casting your vote.</p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <LogIn className="w-4 h-4" />
          Go to Login
        </Link>
      </div>
    );
  }

  if (hasVoted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Vote Cast Successfully!</h2>
        <p className="text-slate-500 mb-6">Thank you for participating in the election. Your vote has been recorded.</p>
        <Link
          to="/results"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
        >
          View Results
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-slate-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!election || election.status !== 'voting') {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <Vote className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Voting Not Open</h2>
        <p className="text-slate-500">
          {election ? `The election is currently in "${election.status}" phase. Voting hasn't started yet.` : 'No active election found.'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Cast Your Vote</h1>
        <p className="text-slate-500 mt-1">Select a party and confirm your vote. This action cannot be undone.</p>
        <p className="text-sm text-indigo-600 mt-2">Voting as: <strong>{voter.name}</strong> ({voter.voterId})</p>
      </div>

      {status.message && (
        <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
          status.type === 'success' ? 'bg-green-50 text-green-800 border border-green-100' : 'bg-red-50 text-red-800 border border-red-100'
        }`}>
          {status.type === 'success' ? <CheckCircle className="w-5 h-5 mt-0.5" /> : <AlertCircle className="w-5 h-5 mt-0.5" />}
          <p>{status.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {parties.map(party => (
          <button
            key={party._id}
            onClick={() => setSelectedParty(party._id)}
            className={`p-6 rounded-xl border-2 text-left transition-all duration-200 ${
              selectedParty === party._id
                ? 'border-indigo-500 bg-indigo-50 shadow-md ring-2 ring-indigo-200'
                : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3">
              {party.logoUrl ? (
                <img src={party.logoUrl} alt={party.name} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-lg font-bold text-indigo-600">
                  {party.symbol}
                </div>
              )}
              <div>
                <h3 className="font-bold text-slate-800">{party.name}</h3>
                <p className="text-sm text-slate-500">Leader: {party.leader}</p>
              </div>
            </div>
            {selectedParty === party._id && (
              <div className="mt-3 flex items-center gap-1 text-indigo-600 text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                Selected
              </div>
            )}
          </button>
        ))}
      </div>

      {selectedParty && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
          <p className="text-amber-800 font-medium">⚠️ Confirm your vote</p>
          <p className="text-amber-700 text-sm mt-1">
            You are about to vote for <strong>{parties.find(p => p._id === selectedParty)?.name}</strong>.
            This action cannot be undone.
          </p>
        </div>
      )}

      <button
        onClick={handleVote}
        disabled={!selectedParty || voting}
        className="w-full py-4 px-6 bg-indigo-600 text-white font-bold text-lg rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
      >
        {voting ? 'Casting Vote...' : 'Confirm & Cast Vote'}
      </button>
    </div>
  );
}

export default VotingPage;
