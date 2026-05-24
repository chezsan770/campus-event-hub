import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import UserAvatar from '../ui/UserAvatar';

export default function Navbar() {
  const { user, logout, isAdmin, isOrganizer } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (isAdmin) return '/dashboard/admin';
    if (isOrganizer) return '/dashboard/organizer';
    return '/dashboard/student';
  };

  const navLinks = [
    { label: 'Explore',  to: '/events'  },
    { label: 'Features', to: '/#features' },
    { label: 'About',    to: '/#about'   },
  ];

  const isActive = (to) => location.pathname === to;

  return (
    <nav className="topbar fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="brand-mark w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-lvl1 group-hover:scale-105 transition-transform">
              <span className="material-symbols-rounded text-white text-sm">event</span>
            </div>
            <span className="font-bold text-base tracking-tight" style={{ color: 'var(--clr-text)' }}>
              Campus<span className="text-primary-500">Event</span>Hub
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive(link.to)
                    ? 'text-primary-400 bg-primary-500/10'
                    : 'hover:bg-white/5'
                }`}
                style={{ color: isActive(link.to) ? undefined : 'var(--clr-muted)' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="btn-ghost p-2 rounded-lg"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark
                ? <Sun size={18} className="text-yellow-400" />
                : <Moon size={18} />}
            </button>

            {user ? (
              <>
                {/* Notifications */}
                <button className="btn-ghost p-2 rounded-lg relative">
                  <Bell size={18} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full"></span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-150 hover:bg-white/5"
                  >
                    <UserAvatar user={user} size="sm" />
                    <span className="hidden sm:block text-sm font-medium" style={{ color: 'var(--clr-text)' }}>
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown size={14} style={{ color: 'var(--clr-muted)' }} />
                  </button>

                  {profileOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 w-52 rounded-card border py-1 shadow-lvl3 z-50 animate-fade-in"
                      style={{ background: 'var(--clr-surface-cont)', borderColor: 'var(--clr-border)' }}
                      onMouseLeave={() => setProfileOpen(false)}
                    >
                      <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--clr-border)' }}>
                        <p className="text-sm font-semibold" style={{ color: 'var(--clr-text)' }}>{user.name}</p>
                        <p className="text-xs" style={{ color: 'var(--clr-muted)' }}>{user.email}</p>
                      </div>
                      <Link to={getDashboardPath()} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 transition-colors" style={{ color: 'var(--clr-muted)' }} onClick={() => setProfileOpen(false)}>
                        <User size={14} /> Dashboard
                      </Link>
                      <Link to="/settings" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 transition-colors" style={{ color: 'var(--clr-muted)' }} onClick={() => setProfileOpen(false)}>
                        <Settings size={14} /> Settings
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm px-4 py-2">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden btn-ghost p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t py-3 animate-fade-in" style={{ borderColor: 'var(--clr-border)' }}>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-4 py-2.5 text-sm font-medium rounded-lg mx-1 mb-1 hover:bg-white/5 transition-colors"
                style={{ color: 'var(--clr-muted)' }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <div className="flex gap-2 px-4 pt-2">
                <Link to="/login" className="btn-secondary flex-1 justify-center text-sm" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link to="/register" className="btn-primary flex-1 justify-center text-sm" onClick={() => setMobileOpen(false)}>Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
