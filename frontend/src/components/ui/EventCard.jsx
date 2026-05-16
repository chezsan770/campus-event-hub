import { Link } from 'react-router-dom';
import { MapPin, Clock, Users, Calendar } from 'lucide-react';
import { CATEGORIES } from '../../data/dummyData';

const categoryColors = {
  blue:   'badge-blue',
  purple: 'badge-purple',
  green:  'badge-green',
  orange: 'badge-orange',
  red:    'badge-red',
};

export default function EventCard({ event }) {
  const cat = CATEGORIES.find(c => c.id === event.category);
  const spotsLeft = event.capacity - event.registered;
  const isFull = spotsLeft <= 0;
  const isAlmostFull = spotsLeft <= 10 && !isFull;
  const fillPct = Math.min(100, Math.round((event.registered / event.capacity) * 100));

  return (
    <div className="card group cursor-pointer flex flex-col overflow-hidden">
      {/* Gradient Header */}
      <div className={`h-28 bg-gradient-to-br ${event.imageGradient} relative flex items-end p-3`}>
        {/* Featured Badge */}
        {event.featured && (
          <span className="absolute top-3 right-3 badge bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
            <span className="material-symbols-rounded text-xs">star</span> Featured
          </span>
        )}
        {/* Category */}
        <span className={`${categoryColors[cat?.color] || 'badge-blue'} badge`}>
          {cat?.label || event.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <h3 className="font-semibold text-body-md leading-snug line-clamp-2 group-hover:text-primary-400 transition-colors" style={{ color: 'var(--clr-text)' }}>
            {event.title}
          </h3>
          <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--clr-muted)' }}>
            {event.description}
          </p>
        </div>

        {/* Meta */}
        <div className="space-y-1.5 text-xs" style={{ color: 'var(--clr-muted)' }}>
          <div className="flex items-center gap-1.5">
            <Calendar size={12} className="shrink-0" />
            <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {event.time}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={12} className="shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={12} className="shrink-0" />
            <span>{event.registered} / {event.capacity} registered</span>
          </div>
        </div>

        {/* Capacity Bar */}
        <div>
          <div className="w-full h-1.5 rounded-pill overflow-hidden" style={{ background: 'var(--clr-surface-high)' }}>
            <div
              className={`h-full rounded-pill transition-all duration-500 ${
                isFull ? 'bg-red-500' : isAlmostFull ? 'bg-orange-400' : 'bg-primary-500'
              }`}
              style={{ width: `${fillPct}%` }}
            />
          </div>
          <p className="text-xs mt-0.5" style={{ color: 'var(--clr-muted)' }}>
            {isFull ? '🔴 Full' : isAlmostFull ? `⚠️ Only ${spotsLeft} spots left` : `${spotsLeft} spots available`}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t" style={{ borderColor: 'var(--clr-border)' }}>
          <span className="text-xs font-semibold text-primary-400">
            {event.price === 0 ? 'FREE' : `$${event.price}`}
          </span>
          <Link
            to={`/events/${event.id}`}
            className="btn-primary py-1.5 px-3 text-xs"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
