import { useEffect, useState } from 'react';
import { Users, Award, FileText } from 'lucide-react';
import api from '../api';

function PartyList() {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const res = await api.get('/parties');
        setParties(res.data);
      } catch (err) {
        console.error('Failed to fetch parties:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchParties();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse bg-white rounded-xl p-6 shadow-sm">
              <div className="w-16 h-16 bg-slate-200 rounded-full mb-4" />
              <div className="h-5 bg-slate-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-slate-100 rounded w-1/2 mb-4" />
              <div className="h-20 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Registered Parties</h1>
        <p className="text-slate-500 mt-1">All approved parties participating in the election</p>
      </div>

      {parties.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-700 mb-2">No Parties Yet</h2>
          <p className="text-slate-500">No parties have been approved for the election yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parties.map(party => (
            <div key={party._id} className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2" />
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  {party.logoUrl ? (
                    <img
                      src={party.logoUrl}
                      alt={party.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-slate-100"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-600">
                      {party.symbol}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 text-lg truncate">{party.name}</h3>
                    <p className="text-sm text-indigo-600 font-medium">{party.symbol}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                  <Award className="w-4 h-4 text-slate-400" />
                  <span>Leader: <strong>{party.leader}</strong></span>
                </div>

                {party.manifesto && (
                  <div className="flex items-start gap-2 text-sm text-slate-500">
                    <FileText className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <p className="line-clamp-3">{party.manifesto}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PartyList;
