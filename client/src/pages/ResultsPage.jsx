import { useEffect, useState } from 'react';
import { BarChart3, Trophy, TrendingUp } from 'lucide-react';
import api from '../api';
import Leaderboard from '../components/Leaderboard';

function ResultsPage() {
  const [election, setElection] = useState(null);
  const [results, setResults] = useState({ totalVotes: 0, results: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const electionsRes = await api.get('/elections');
        if (electionsRes.data.length > 0) {
          const el = electionsRes.data[0];
          setElection(el);
          const resultsRes = await api.get(`/votes/results/${el._id}`);
          const resData = resultsRes.data || {};
          setResults({
            totalVotes: resData.totalVotes || 0,
            results: Array.isArray(resData.results) ? resData.results : []
          });
        }
      } catch (err) {
        console.error('Failed to fetch results:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="h-64 bg-slate-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">No Election Data</h2>
        <p className="text-slate-500">No election results to display yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Election Results</h1>
        <p className="text-slate-500 mt-1">{election.title} — Live results update every 5 seconds</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <p className="text-sm text-slate-500">Total Votes</p>
          <p className="text-3xl font-bold text-indigo-700">{results.totalVotes}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <p className="text-sm text-slate-500">Parties</p>
          <p className="text-3xl font-bold text-purple-700">{results.results.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <p className="text-sm text-slate-500">Leading Party</p>
          <p className="text-lg font-bold text-green-700 truncate">
            {results.results.length > 0 ? results.results[0].party.name : 'N/A'}
          </p>
        </div>
      </div>

      {/* Bar chart visualization */}
      {results.results.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Vote Distribution
          </h2>
          <div className="space-y-4">
            {results.results.map((item, index) => (
              <div key={item.party._id} className="flex items-center gap-4">
                <div className="w-32 flex-shrink-0">
                  <p className="font-medium text-slate-800 text-sm truncate">{item.party.name}</p>
                  <p className="text-xs text-slate-500">{item.party.symbol}</p>
                </div>
                <div className="flex-1 h-8 bg-slate-100 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      index === 0 ? 'bg-gradient-to-r from-indigo-500 to-purple-500' :
                      index === 1 ? 'bg-gradient-to-r from-blue-400 to-indigo-400' :
                      index === 2 ? 'bg-gradient-to-r from-teal-400 to-blue-400' :
                      'bg-gradient-to-r from-slate-300 to-slate-400'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                  <span className="absolute inset-0 flex items-center px-3 text-xs font-semibold text-slate-700">
                    {item.percentage}% ({item.votes} votes)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live leaderboard */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
        <Leaderboard electionId={election._id} autoRefresh={true} />
      </div>
    </div>
  );
}

export default ResultsPage;
