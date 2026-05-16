import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Share2, Heart, ArrowLeft, Check } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { eventService } from '../api/eventService';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../data/dummyData';

const categoryColors = { blue: 'badge-blue', purple: 'badge-purple', green: 'badge-green', orange: 'badge-orange' };

export default function EventDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    eventService.getEventById(id)
      .then(setEvent)
      .catch(() => navigate('/events'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRegister = async () => {
    if (!user) { navigate('/login'); return; }
    setRegistering(true);
    try {
      await eventService.registerForEvent(id);
      setRegistered(true);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--clr-bg)' }}>
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 pt-24 space-y-4">
          <div className="h-64 rounded-card shimmer" />
          <div className="h-8 w-1/2 rounded shimmer" />
          <div className="h-4 w-3/4 rounded shimmer" />
        </div>
      </div>
    );
  }

  if (!event) return null;

  const cat = CATEGORIES.find(c => c.id === event.category);
  const spotsLeft = event.capacity - event.registered;
  const fillPct = Math.min(100, Math.round((event.registered / event.capacity) * 100));

  return (
    <div className="min-h-screen" style={{ background: 'var(--clr-bg)' }}>
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 pt-20 pb-12">
        {/* Back */}
        <Link to="/events" className="inline-flex items-center gap-2 mt-4 mb-6 text-sm hover:text-primary-400 transition-colors" style={{ color: 'var(--clr-muted)' }}>
          <ArrowLeft size={16} /> Back to Events
        </Link>

        {/* Hero Banner */}
        <div className={`relative h-56 md:h-72 rounded-hero bg-gradient-to-br ${event.imageGradient} overflow-hidden mb-6 flex items-end p-6`}>
          {event.featured && (
            <span className="absolute top-4 right-4 badge bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
              <span className="material-symbols-rounded text-xs">star</span> Featured
            </span>
          )}
          <div>
            <span className={`${categoryColors[cat?.color] || 'badge-blue'} badge mb-2`}>{cat?.label}</span>
            <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">{event.title}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left – Main info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="card p-6">
              <h2 className="text-headline-sm font-bold mb-3" style={{ color: 'var(--clr-text)' }}>About this Event</h2>
              <p className="text-body-sm leading-relaxed" style={{ color: 'var(--clr-muted)' }}>{event.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {event.tags.map(tag => (
                  <span key={tag} className="badge badge-blue">{tag}</span>
                ))}
              </div>
            </div>

            {/* Event Details */}
            <div className="card p-6">
              <h2 className="text-headline-sm font-bold mb-4" style={{ color: 'var(--clr-text)' }}>Event Details</h2>
              <div className="space-y-4">
                {[
                  { icon: <Calendar size={18} />, label: 'Date & Time', value: `${new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • ${event.time} – ${event.endTime}` },
                  { icon: <MapPin size={18} />,    label: 'Venue',      value: `${event.location} • ${event.venue}` },
                  { icon: <Users size={18} />,     label: 'Capacity',   value: `${event.registered} / ${event.capacity} registered (${spotsLeft} spots left)` },
                  { icon: <span className="material-symbols-rounded text-lg">manage_accounts</span>, label: 'Organizer', value: event.organizer },
                ].map(item => (
                  <div key={item.label} className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-primary-500/10 text-primary-400 flex items-center justify-center shrink-0">{item.icon}</div>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: 'var(--clr-muted)' }}>{item.label}</p>
                      <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--clr-text)' }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right – Registration Card */}
          <div className="space-y-4">
            <div className="card p-6 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-black text-primary-400">
                  {event.price === 0 ? 'FREE' : `$${event.price}`}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => setSaved(!saved)} className={`p-2 rounded-lg border transition-all ${saved ? 'text-red-400 border-red-400/30 bg-red-400/10' : 'hover:bg-white/5'}`} style={{ borderColor: saved ? undefined : 'var(--clr-border)' }}>
                    <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
                  </button>
                  <button className="p-2 rounded-lg border hover:bg-white/5 transition-all" style={{ borderColor: 'var(--clr-border)', color: 'var(--clr-muted)' }}>
                    <Share2 size={16} />
                  </button>
                </div>
              </div>

              {/* Capacity Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--clr-muted)' }}>
                  <span>{event.registered} registered</span>
                  <span>{fillPct}% full</span>
                </div>
                <div className="w-full h-2 rounded-pill overflow-hidden" style={{ background: 'var(--clr-surface-high)' }}>
                  <div className={`h-full rounded-pill ${spotsLeft <= 0 ? 'bg-red-500' : spotsLeft <= 10 ? 'bg-orange-400' : 'bg-primary-500'}`} style={{ width: `${fillPct}%` }} />
                </div>
              </div>

              {registered ? (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-semibold">
                  <Check size={16} /> Successfully Registered!
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={registering || spotsLeft <= 0}
                  className="btn-primary w-full justify-center py-3"
                >
                  {registering ? 'Registering...' : spotsLeft <= 0 ? 'Event Full' : 'Register Now'}
                </button>
              )}

              {registered && (
                <Link to="/my-tickets" className="btn-secondary w-full justify-center py-2.5 mt-3 text-sm">
                  View My Ticket
                </Link>
              )}

              {!user && (
                <p className="text-xs text-center mt-3" style={{ color: 'var(--clr-muted)' }}>
                  <Link to="/login" className="text-primary-400 hover:underline">Sign in</Link> to register
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
