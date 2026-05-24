// ─── StatCard ─────────────────────────────────────────────────────────────────
export function StatCard({ icon, label, value, change, color = 'blue', iconBg }) {
  const borderClass = {
    blue:   'stat-card-blue',
    purple: 'stat-card-purple',
    green:  'stat-card-green',
    orange: 'stat-card-orange',
  }[color] || 'stat-card-blue';

  const iconBgClass = iconBg || {
    blue:   'badge-blue',
    purple: 'badge-purple',
    green:  'badge-green',
    orange: 'badge-orange',
  }[color];

  const isPositive = change && change.startsWith('+');

  return (
    <div className={`card p-5 ${borderClass}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium mb-1" style={{ color: 'var(--clr-muted)' }}>{label}</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--clr-text)' }}>{value}</p>
          {change && (
            <p className={`text-xs font-medium mt-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {change} from last month
            </p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBgClass}`}>
          <span className="material-symbols-rounded text-lg">{icon}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ children, variant = 'blue' }) {
  const variants = {
    blue:   'badge-blue',
    purple: 'badge-purple',
    green:  'badge-green',
    orange: 'badge-orange',
    red:    'badge-red',
  };
  return <span className={`badge ${variants[variant] || 'badge-blue'}`}>{children}</span>;
}

// ─── Button ───────────────────────────────────────────────────────────────────
export function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = variant === 'primary' ? 'btn-primary'
             : variant === 'secondary' ? 'btn-secondary'
             : 'btn-ghost';
  return (
    <button className={`${base} ${className}`} {...props}>
      {children}
    </button>
  );
}

// ─── InputField ──────────────────────────────────────────────────────────────
export function InputField({ label, icon, error, className = '', ...props }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold" style={{ color: 'var(--clr-muted)' }}>
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-rounded text-base" style={{ color: 'var(--clr-muted)' }}>
            {icon}
          </span>
        )}
        <input
          className={`input-field ${icon ? 'pl-10' : ''}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ─── CategoryChip ─────────────────────────────────────────────────────────────
export function CategoryChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-pill text-xs font-black transition-all duration-150 border ${
        active ? 'bg-primary-500 border-primary-500 shadow-lvl1' : ''
      }`}
      style={{
        color: active ? 'var(--clr-primary)' : 'var(--clr-muted)',
        background: active ? 'var(--clr-yellow)' : 'var(--clr-cream)',
        borderColor: 'var(--clr-border)',
      }}
    >
      {label}
    </button>
  );
}

// ─── EventRow ─────────────────────────────────────────────────────────────────
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { getEventCoverStyle, hasCustomCover } from '../../utils/eventArt';
import EventCoverMedia from './EventCoverMedia';

export function EventRow({ event, showStatus }) {
  const statusColor = event.status === 'UPCOMING'
    ? 'badge-green'
    : event.status === 'PAST' || event.status === 'REJECTED'
      ? 'badge-red'
      : 'badge-orange';
  const coverStyle = getEventCoverStyle(event);

  return (
    <Link
      to={`/events/${event.id}`}
      className="flex items-center gap-4 p-3 rounded-lg transition-colors group no-underline cursor-pointer"
      style={{ border: '2px solid transparent' }}
    >
      {/* Event mark */}
      <div className={`w-10 h-10 rounded-lg event-cover flex items-center justify-center shrink-0 ${hasCustomCover(event) ? 'has-custom-cover' : ''}`} style={coverStyle}>
        <EventCoverMedia event={event} />
        {!hasCustomCover(event) && (
          <span className="material-symbols-rounded text-sm relative z-10" style={{ color: 'var(--clr-primary)' }}>event</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate group-hover:text-primary-400 transition-colors" style={{ color: 'var(--clr-text)' }}>
          {event.title}
        </p>
        <div className="flex items-center gap-3 text-xs mt-0.5" style={{ color: 'var(--clr-muted)' }}>
          <span className="flex items-center gap-1">
            <Calendar size={10} />
            {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {event.time}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={10} />
            {event.location}
          </span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 shrink-0">
        {showStatus && <span className={`badge ${statusColor}`}>{event.status}</span>}
        {event.isRegistered && <span className="badge badge-blue">REGISTERED</span>}
        <span className="btn-secondary py-1 px-3 text-xs">
          View
        </span>
      </div>
    </Link>
  );
}
