import { useEffect, useState } from 'react';
import { Shield, CheckCircle, AlertCircle, Plus, Users, Calendar } from 'lucide-react';
import api from '../api';

function AdminPage() {
  const [tab, setTab] = useState('elections');
  const [parties, setParties] = useState([]);
  const [elections, setElections] = useState([]);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [electionForm, setElectionForm] = useState({
    title: '',
    description: '',
    registrationStart: '',
    registrationEnd: '',
    votingStart: '',
    votingEnd: '',
    resultsAt: ''
  });

  useEffect(() => {
    fetchParties();
    fetchElections();
  }, []);

  const fetchParties = async () => {
    try {
      const res = await api.get('/parties/all');
      setParties(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchElections = async () => {
    try {
      const res = await api.get('/elections');
      setElections(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const approveParty = async (id) => {
    try {
      await api.put(`/parties/${id}/approve`);
      setStatus({ type: 'success', message: 'Party approved!' });
      fetchParties();
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || 'Failed to approve' });
    }
  };

  const updateElectionStatus = async (id, newStatus) => {
    try {
      await api.put(`/elections/${id}`, { status: newStatus });
      setStatus({ type: 'success', message: `Election status updated to "${newStatus}"` });
      fetchElections();
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || 'Failed to update' });
    }
  };

  const createElection = async (e) => {
    e.preventDefault();
    try {
      await api.post('/elections', electionForm);
      setStatus({ type: 'success', message: 'Election created!' });
      setElectionForm({ title: '', description: '', registrationStart: '', registrationEnd: '', votingStart: '', votingEnd: '', resultsAt: '' });
      fetchElections();
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || 'Failed to create election' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
          <Shield className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Admin Panel</h1>
          <p className="text-slate-500 text-sm">Manage elections, approve parties, control phases</p>
        </div>
      </div>

      {status.message && (
        <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
          status.type === 'success' ? 'bg-green-50 text-green-800 border border-green-100' : 'bg-red-50 text-red-800 border border-red-100'
        }`}>
          {status.type === 'success' ? <CheckCircle className="w-5 h-5 mt-0.5" /> : <AlertCircle className="w-5 h-5 mt-0.5" />}
          <p>{status.message}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200 pb-2">
        <button
          onClick={() => setTab('elections')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'elections' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" /> Elections
        </button>
        <button
          onClick={() => setTab('parties')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'parties' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" /> Parties ({parties.filter(p => !p.approved).length} pending)
        </button>
      </div>

      {/* Elections Tab */}
      {tab === 'elections' && (
        <div className="space-y-6">
          {/* Create Election Form */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create New Election
            </h3>
            <form onSubmit={createElection} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={electionForm.title}
                    onChange={e => setElectionForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="2026 General Election"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={electionForm.description}
                    onChange={e => setElectionForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="National parliamentary elections"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Registration Start *</label>
                  <input type="datetime-local" required value={electionForm.registrationStart} onChange={e => setElectionForm(f => ({ ...f, registrationStart: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Registration End *</label>
                  <input type="datetime-local" required value={electionForm.registrationEnd} onChange={e => setElectionForm(f => ({ ...f, registrationEnd: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Voting Start *</label>
                  <input type="datetime-local" required value={electionForm.votingStart} onChange={e => setElectionForm(f => ({ ...f, votingStart: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Voting End *</label>
                  <input type="datetime-local" required value={electionForm.votingEnd} onChange={e => setElectionForm(f => ({ ...f, votingEnd: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Results Announcement *</label>
                  <input type="datetime-local" required value={electionForm.resultsAt} onChange={e => setElectionForm(f => ({ ...f, resultsAt: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-500 outline-none" />
                </div>
              </div>
              <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                Create Election
              </button>
            </form>
          </div>

          {/* Elections List */}
          <div className="space-y-4">
            {elections.map(el => (
              <div key={el._id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800">{el.title}</h3>
                    <p className="text-sm text-slate-500">{el.description}</p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                      el.status === 'upcoming' ? 'bg-slate-100 text-slate-600' :
                      el.status === 'registration' ? 'bg-blue-100 text-blue-700' :
                      el.status === 'voting' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {el.status}
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {['upcoming', 'registration', 'voting', 'completed'].map(s => (
                      <button
                        key={s}
                        onClick={() => updateElectionStatus(el._id, s)}
                        disabled={el.status === s}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          el.status === s
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-700'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Parties Tab */}
      {tab === 'parties' && (
        <div className="space-y-4">
          {parties.length === 0 && (
            <p className="text-slate-500 text-center py-8">No parties registered yet.</p>
          )}
          {parties.map(party => (
            <div key={party._id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-lg font-bold text-indigo-600">
                  {party.symbol}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{party.name}</h3>
                  <p className="text-sm text-slate-500">Leader: {party.leader}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {party.approved ? (
                  <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <CheckCircle className="w-4 h-4" /> Approved
                  </span>
                ) : (
                  <button
                    onClick={() => approveParty(party._id)}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPage;
