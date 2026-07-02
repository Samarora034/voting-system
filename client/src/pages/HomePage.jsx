import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Vote, Users, UserPlus, BarChart3, ArrowRight } from 'lucide-react';
import api from '../api';
import Timeline from '../components/Timeline';
import CountdownTimer from '../components/CountdownTimer';
import Leaderboard from '../components/Leaderboard';

function HomePage() {
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElection = async () => {
      try {
        const res = await api.get('/elections');
        const data = Array.isArray(res.data) ? res.data : [];
        if (data.length > 0) {
          setElection(data[0]); // Most recent election
        }
      } catch (err) {
        console.error('Failed to fetch elections:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchElection();
  }, []);

  const getNextPhaseDate = () => {
    if (!election) return null;
    const now = new Date();
    if (election.status === 'upcoming') return election.registrationStart;
    if (election.status === 'registration') return election.votingStart;
    if (election.status === 'voting') return election.votingEnd;
    return election.resultsAt;
  };

  const getNextPhaseLabel = () => {
    if (!election) return '';
    if (election.status === 'upcoming') return 'Registration Opens In';
    if (election.status === 'registration') return 'Voting Starts In';
    if (election.status === 'voting') return 'Voting Ends In';
    return 'Results Announced';
  };

  const actionCards = [
    { to: '/register', label: 'Register to Vote', desc: 'Create your voter account', icon: UserPlus, color: 'bg-blue-500' },
    { to: '/parties/register', label: 'Register Party', desc: 'Submit your party for approval', icon: Users, color: 'bg-purple-500' },
    { to: '/vote', label: 'Cast Your Vote', desc: 'Vote for your preferred party', icon: Vote, color: 'bg-green-500' },
    { to: '/results', label: 'View Results', desc: 'See live election results', icon: BarChart3, color: 'bg-amber-500' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-20 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTMwVjBoLTEydjRoMTJ6TTI0IDI0djJoMTJ2LTJIMjR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {election ? election.title : 'ElectVote'}
          </h1>
          <p className="text-indigo-200 text-lg mb-8 max-w-2xl mx-auto">
            {election ? election.description : 'A secure and transparent digital voting platform for democratic elections'}
          </p>

          {election && getNextPhaseDate() && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 inline-block">
              <CountdownTimer
                targetDate={getNextPhaseDate()}
                label={getNextPhaseLabel()}
              />
            </div>
          )}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* Timeline */}
        {election && (
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Election Timeline</h2>
            <Timeline election={election} />
          </section>
        )}

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {actionCards.map(({ to, label, desc, icon: Icon, color }) => (
              <Link
                key={to}
                to={to}
                className="group bg-white rounded-xl border border-slate-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">{label}</h3>
                <p className="text-sm text-slate-500">{desc}</p>
                <ArrowRight className="w-4 h-4 text-slate-400 mt-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </section>

        {/* Live Leaderboard */}
        {election && (
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <Leaderboard electionId={election._id} limit={5} />
          </section>
        )}

        {/* No election state */}
        {!loading && !election && (
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
            <Vote className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-700 mb-2">No Active Election</h2>
            <p className="text-slate-500 mb-6">There are no elections scheduled yet. Check back later or contact the admin.</p>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Go to Admin Panel
              <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}

export default HomePage;
