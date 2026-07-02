import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

function CountdownTimer({ targetDate, label = 'Time Remaining' }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(targetDate) - new Date();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.expired) {
    return (
      <div className="text-center">
        <p className="text-sm text-slate-500 mb-1">{label}</p>
        <p className="text-lg font-semibold text-green-600">Phase Active!</p>
      </div>
    );
  }

  const units = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Min' },
    { value: timeLeft.seconds, label: 'Sec' }
  ];

  return (
    <div className="text-center">
      <p className="text-sm text-slate-500 mb-3 flex items-center justify-center gap-1">
        <Clock className="w-4 h-4" />
        {label}
      </p>
      <div className="flex items-center justify-center gap-2">
        {units.map(({ value, label: unitLabel }) => (
          <div key={unitLabel} className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-indigo-700">
                {String(value).padStart(2, '0')}
              </span>
            </div>
            <span className="text-xs text-slate-500 mt-1">{unitLabel}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CountdownTimer;
