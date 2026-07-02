import { CheckCircle, Circle, Clock } from 'lucide-react';

function Timeline({ election }) {
  if (!election) return null;

  const now = new Date();
  const phases = [
    {
      label: 'Registration',
      start: new Date(election.registrationStart),
      end: new Date(election.registrationEnd),
      status: 'registration'
    },
    {
      label: 'Voting',
      start: new Date(election.votingStart),
      end: new Date(election.votingEnd),
      status: 'voting'
    },
    {
      label: 'Results',
      start: new Date(election.resultsAt),
      end: null,
      status: 'completed'
    }
  ];

  const getPhaseState = (phase) => {
    if (election.status === 'completed') return 'completed';
    if (election.status === phase.status) return 'active';
    if (now > phase.end) return 'completed';
    return 'upcoming';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        {phases.map((phase, index) => {
          const state = getPhaseState(phase);
          return (
            <div key={phase.label} className="flex items-start gap-4 mb-8 last:mb-0">
              {/* Icon and line */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  state === 'completed' ? 'bg-green-100 text-green-600' :
                  state === 'active' ? 'bg-indigo-100 text-indigo-600 ring-4 ring-indigo-50' :
                  'bg-slate-100 text-slate-400'
                }`}>
                  {state === 'completed' ? <CheckCircle className="w-5 h-5" /> :
                   state === 'active' ? <Clock className="w-5 h-5 animate-pulse" /> :
                   <Circle className="w-5 h-5" />}
                </div>
                {index < phases.length - 1 && (
                  <div className={`w-0.5 h-12 mt-2 ${
                    state === 'completed' ? 'bg-green-300' : 'bg-slate-200'
                  }`} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <h4 className={`font-semibold text-sm ${
                  state === 'active' ? 'text-indigo-700' :
                  state === 'completed' ? 'text-green-700' :
                  'text-slate-500'
                }`}>
                  {phase.label}
                  {state === 'active' && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-700">
                      In Progress
                    </span>
                  )}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {formatDate(phase.start)}
                  {phase.end && ` — ${formatDate(phase.end)}`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Timeline;
