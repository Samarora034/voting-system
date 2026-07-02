import { useState } from 'react';
import { Users, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../api';

function PartyRegistration() {
  const [form, setForm] = useState({
    name: '',
    symbol: '',
    leader: '',
    manifesto: '',
    logoUrl: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await api.post('/parties', form);
      setStatus({ type: 'success', message: res.data.message });
      setForm({ name: '', symbol: '', leader: '', manifesto: '', logoUrl: '' });
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
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Register a Party</h1>
        </div>
        <p className="text-slate-500">Submit your party for election participation. An admin will review and approve.</p>
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
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Party Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="e.g., National Progress Party"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="symbol" className="block text-sm font-medium text-slate-700 mb-1">Party Symbol *</label>
            <input
              id="symbol"
              name="symbol"
              type="text"
              required
              value={form.symbol}
              onChange={handleChange}
              placeholder="e.g., 🌟 or Eagle"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>
          <div>
            <label htmlFor="leader" className="block text-sm font-medium text-slate-700 mb-1">Party Leader *</label>
            <input
              id="leader"
              name="leader"
              type="text"
              required
              value={form.leader}
              onChange={handleChange}
              placeholder="e.g., John Smith"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label htmlFor="logoUrl" className="block text-sm font-medium text-slate-700 mb-1">Logo URL</label>
          <input
            id="logoUrl"
            name="logoUrl"
            type="url"
            value={form.logoUrl}
            onChange={handleChange}
            placeholder="https://example.com/logo.png"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          />
        </div>

        <div>
          <label htmlFor="manifesto" className="block text-sm font-medium text-slate-700 mb-1">Manifesto</label>
          <textarea
            id="manifesto"
            name="manifesto"
            rows="4"
            value={form.manifesto}
            onChange={handleChange}
            placeholder="Describe your party's vision and goals..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
        >
          {loading ? 'Submitting...' : 'Register Party'}
        </button>
      </form>
    </div>
  );
}

export default PartyRegistration;
