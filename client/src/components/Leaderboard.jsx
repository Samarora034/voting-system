import { useEffect, useState } from 'react';
import { Trophy, TrendingUp } from 'lucide-react';
import api from '../api';

function Leaderboard({ electionId, limit = null, autoRefresh = true }) {
  const [data, setData] = useState({ totalVotes: 0, leaderboard: [] });
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    if (!electionId) return;
    try {
      const res = await api.get(`/votes/leaderboard/${electionId}`);
      const resData = res.data || {};
      setData({
        totalVotes: resData.totalVotes || 0,
        leaderboard: Array.isArray(resData.leaderboard) ? resData.leaderboard : []
      });
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    if (autoRefresh) {
      const interval = setInterval(fetchLeaderboard, 5000);
      return () => clearInterval(interval);
    }
  }, [electionId, autoRefresh]);

  const displayData = limit ? data.leaderboard.slice(0, limit) : data.leaderboard;
  const maxVotes = displayData.length > 0 ? displayData[0].votes : 1;

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-12 bg-slate-200 rounded-lg" />
        ))}
      </div>
    );
  }

  if (displayData.length === 0) {
    return (
      <div className="text-center text-slate-500 py-8">
        <TrendingUp className="w-12 h-12 mx-auto mb-2 text-slate-300" />
        <p>No votes cast yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          Live Leaderboard
        </h3>
        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
          {data.totalVotes} total votes
        </span>
      </div>

      {displayData.map((item, index) => {
        const percentage = data.totalVotes > 0 ? ((item.votes / data.totalVotes) * 100).toFixed(1) : 0;
        const barWidth = maxVotes > 0 ? (item.votes / maxVotes) * 100 : 0;

        return (
          <div key={item.party._id} className="relative overflow-hidden bg-white rounded-xl border border-slate-100 p-4 transition-all hover:shadow-md">
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === 0 ? 'bg-yellow-100 text-yellow-700' :
                  index === 1 ? 'bg-slate-100 text-slate-600' :
                  index === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-slate-50 text-slate-500'
                }`}>
                  {index === 0 ? <Trophy className="w-4 h-4" /> : index + 1}
                </span>
                <div>
                  <p className="font-semibold text-slate-800">{item.party.name}</p>
                  <p className="text-xs text-slate-500">{item.party.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-indigo-700">{item.votes}</p>
                <p className="text-xs text-slate-500">{percentage}%</p>
              </div>
            </div>
            {/* Progress bar background */}
            <div
              className="absolute inset-y-0 left-0 bg-indigo-50 transition-all duration-1000 ease-out"
              style={{ width: `${barWidth}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default Leaderboard;
