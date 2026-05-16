import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, LogOut, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Nav items per role
const STUDENT_NAV = [
  { icon: 'home',                label: 'Home',        to: '/dashboard/student' },
  { icon: 'calendar_today',      label: 'Events',      to: '/events' },
  { icon: 'confirmation_number', label: 'My Tickets',  to: '/my-tickets' },
  { icon: 'leaderboard',         label: 'Stats',       to: '/dashboard/student#stats' },
  { icon: 'event_note',          label: 'My Events',   to: '/dashboard/student#my-events' },
];

const ADMIN_NAV = [
  { icon: 'home',                 label: 'Home',            to: '/dashboard/admin' },
  { icon: 'calendar_today',       label: 'Events',          to: '/events' },
  { icon: 'confirmation_number',  label: 'Tickets',         to: '/admin/tickets' },
  { icon: 'leaderboard',          label: 'Stats',           to: '/dashboard/admin#stats' },
  { icon: 'group',                label: 'Participants',    to: '/admin/participants' },
  { icon: 'admin_panel_settings', label: 'User Mgmt',       to: '/admin/users' },
  { icon: 'settings',             label: 'Settings',        to: '/admin/settings' },
];

const ORGANIZER_NAV = [
  { icon: 'home',                label: 'Home',          to: '/dashboard/organizer' },
  { icon: 'add_circle',          label: 'Create Event',  to: '/events/create' },
  { icon: 'event_note',          label: 'My Events',     to: '/dashboard/organizer#my-events' },
  { icon: 'leaderboard',         label: 'Analytics',     to: '/dashboard/organizer#analytics' },
  { icon: 'group',               label: 'Attendees',     to: '/dashboard/organizer#attendees' },
  { icon: 'settings',            label: 'Settings',      to: '/organizer/settings' },
];

function getNavItems(role) {
  if (role === 'ADMIN')     return ADMIN_NAV;
  if (role === 'ORGANIZER') return ORGANIZER_NAV;
  return STUDENT_NAV;
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = getNavItems(user?.role);
  const isActive = (to) => location.pathname === to;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <aside
      className={`sidebar flex flex-col h-full transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}
    >
      {/* Logo / Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b shrink-0" style={{ borderColor: 'var(--clr-border)' }}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="material-symbols-rounded text-white text-xs">event</span>
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold" style={{ color: 'var(--clr-text)' }}>Event Hub</p>
              <p className="text-xs" style={{ color: 'var(--clr-muted)' }}>Management Console</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors ml-auto"
          style={{ color: 'var(--clr-muted)' }}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--clr-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-pill bg-gradient-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
              {user.avatar}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--clr-text)' }}>{user.name}</p>
              <span className={`badge text-xs ${
                user.role === 'ADMIN' ? 'badge-red' :
                user.role === 'ORGANIZER' ? 'badge-purple' : 'badge-blue'
              }`}>
                {user.role}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {navItems.map((item) => {
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={`nav-item ${active ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
            >
              <span className="material-symbols-rounded text-lg shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="px-2 py-3 border-t space-y-0.5" style={{ borderColor: 'var(--clr-border)' }}>
        <button
          className={`nav-item w-full ${collapsed ? 'justify-center px-2' : ''}`}
          title={collapsed ? 'Help' : undefined}
        >
          <HelpCircle size={18} className="shrink-0" />
          {!collapsed && <span>Help</span>}
        </button>
        <button
          onClick={handleLogout}
          className={`nav-item w-full text-red-400 hover:bg-red-500/10 hover:text-red-400 ${collapsed ? 'justify-center px-2' : ''}`}
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
