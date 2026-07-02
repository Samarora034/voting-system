import { useState } from 'react';
import { UserPlus, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../api';

function VoterRegistration() {
  const [form, setForm] = useState({ name: '', email: '', voterId: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await api.post('/voters/register', form);
      setStatus({ type: 'success', message: `${res.data.message}. Your Voter ID: ${res.data.voter.voterId}` });
      setForm({ name: '', email: '', voterId: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Voter Registration</h1>
        </div>
        <p className="text-slate-500">Register as a voter to participate in the election. Remember your Voter ID for login.</p>
      </div>

      {status.message && (
        <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
          status.type === 'success' ? 'bg-green-50 text-green-800 border border-green-100' : 'bg-red-50 text-red-800 border border-red-100'
        }`}>
          {status.type === 'success' ? <CheckCircle className="w-5 h-5 mt-0.5" /> : <AlertCircle className="w-5 h-5 mt-0.5" />}
          <p>{status.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          />
        </div>

        <div>
          <label htmlFor="voterId" className="block text-sm font-medium text-slate-700 mb-1">Voter ID *</label>
          <input
            id="voterId"
            name="voterId"
            type="text"
            required
            value={form.voterId}
            onChange={handleChange}
            placeholder="Choose a unique Voter ID (e.g., VOTER-001)"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          />
          <p className="text-xs text-slate-400 mt-1">You'll need this to log in and vote</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
        >
          {loading ? 'Registering...' : 'Register as Voter'}
        </button>
      </form>
    </div>
  );
}

export default VoterRegistration;
