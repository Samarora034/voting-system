import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Vote, Menu, X, Users, UserPlus, LogIn, BarChart3, Shield } from 'lucide-react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: '/', label: 'Home', icon: Vote },
    { to: '/parties', label: 'Parties', icon: Users },
    { to: '/vote', label: 'Vote', icon: Vote },
    { to: '/results', label: 'Results', icon: BarChart3 },
    { to: '/login', label: 'Login', icon: LogIn },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-indigo-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
            <Vote className="w-7 h-7 text-indigo-300" />
            <span>ElectVote</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(to)
                    ? 'bg-indigo-700 text-white'
                    : 'text-indigo-200 hover:text-white hover:bg-indigo-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/admin')
                  ? 'bg-amber-600 text-white'
                  : 'text-amber-300 hover:text-white hover:bg-amber-700'
              }`}
            >
              <Shield className="w-4 h-4" />
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-indigo-200 hover:text-white p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {isOpen && (
        <div className="md:hidden bg-indigo-800 border-t border-indigo-700">
          <div className="px-4 py-3 space-y-1">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(to)
                    ? 'bg-indigo-700 text-white'
                    : 'text-indigo-200 hover:text-white hover:bg-indigo-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-amber-300 hover:text-white hover:bg-amber-700"
            >
              <Shield className="w-4 h-4" />
              Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
