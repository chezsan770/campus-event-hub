import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Zap, QrCode, BarChart3, ChevronRight } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import EventCard from '../components/ui/EventCard';
import { DUMMY_EVENTS } from '../data/dummyData';

const FEATURED = DUMMY_EVENTS.filter(e => e.featured).slice(0, 3);

const FEATURES = [
  {
    icon: 'bolt',
    title: 'Ease of Use',
    desc: 'Create events in minutes, find them in seconds. An intuitive dashboard built for campus life.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: 'qr_code_scanner',
    title: 'QR Ticketing',
    desc: 'Instant QR code generation for every ticket. Lightning-fast check-ins – no paper lists needed.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    icon: 'analytics',
    title: 'Smart Analytics',
    desc: 'Track attendance, monitor engagement, and gather feedback to make your next event even better.',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--clr-bg)' }}>
      <Navbar />

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="hero-bg pt-28 pb-24 px-4 text-center relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto animate-slide-up">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 badge-blue border border-blue-500/30 mb-6 px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse-slow"></span>
            <span className="text-xs font-semibold text-blue-300">New: QR Ticketing is now live 🎉</span>
          </div>

          <h1 className="text-display font-black tracking-tight mb-6 leading-none" style={{ color: 'var(--clr-text)' }}>
            Your Campus,{' '}
            <span className="gradient-text">Your Events</span>
          </h1>

          <p className="text-body-lg max-w-2xl mx-auto mb-10" style={{ color: 'var(--clr-muted)' }}>
            The all-in-one platform for students to find experiences and organizers to manage them seamlessly. From workshops to weekend socials — connect with your campus community.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/events" className="btn-primary gap-2 px-6 py-3 text-base">
              Explore Events <ArrowRight size={18} />
            </Link>
            <Link to="/register" className="btn-secondary gap-2 px-6 py-3 text-base">
              <Plus size={18} /> Create Event
            </Link>
          </div>

          {/* Stats strip */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-14">
            {[
              { value: '12,450+', label: 'Students' },
              { value: '342',     label: 'Active Events' },
              { value: '8,920',   label: 'Tickets Issued' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-black gradient-text">{s.value}</p>
                <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--clr-muted)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Events ─────────────────────────────────── */}
      <section className="py-16 px-4" id="events">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Don't Miss What's Happening</h2>
              <p className="section-subtitle">Upcoming events around campus</p>
            </div>
            <Link to="/events" className="btn-ghost text-sm flex items-center gap-1">
              View all events <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURED.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────── */}
      <section className="py-16 px-4" id="features" style={{ background: 'var(--clr-surface)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title text-3xl">Built for Campus Life</h2>
            <p className="section-subtitle mt-2 max-w-xl mx-auto">
              Bridging the gap between organizers and attendees in the dynamic environment of university life.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="card p-6 hover:shadow-lvl2 transition-all">
                <div className={`w-12 h-12 rounded-card ${f.bg} flex items-center justify-center mb-4`}>
                  <span className={`material-symbols-rounded text-2xl ${f.color}`}>{f.icon}</span>
                </div>
                <h3 className="font-bold text-body-lg mb-2" style={{ color: 'var(--clr-text)' }}>{f.title}</h3>
                <p className="text-body-sm" style={{ color: 'var(--clr-muted)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-hero overflow-hidden p-10 text-center" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="absolute inset-0 bg-gradient-primary opacity-5" />
            <h2 className="text-3xl font-black mb-3 relative" style={{ color: 'var(--clr-text)' }}>
              Ready to explore campus life?
            </h2>
            <p className="text-body-md mb-8 relative" style={{ color: 'var(--clr-muted)' }}>
              Join thousands of students already using Campus Event Hub.
            </p>
            <div className="flex flex-wrap gap-3 justify-center relative">
              <Link to="/register" className="btn-primary px-8 py-3">Get Started Free</Link>
              <Link to="/events" className="btn-secondary px-8 py-3">Browse Events</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="py-8 px-4 border-t mt-auto" style={{ borderColor: 'var(--clr-border)' }}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-primary flex items-center justify-center">
              <span className="material-symbols-rounded text-white text-xs">event</span>
            </div>
            <span className="font-bold text-sm" style={{ color: 'var(--clr-text)' }}>Campus Event Hub</span>
          </div>
          <p className="text-xs" style={{ color: 'var(--clr-muted)' }}>© 2024 Campus Event Hub. Built for student life.</p>
          <div className="flex gap-4">
            {['Explore Events', 'Organizer Dashboard', 'Privacy Policy', 'Contact Us'].map(l => (
              <Link key={l} to="#" className="text-xs hover:text-primary-400 transition-colors" style={{ color: 'var(--clr-muted)' }}>{l}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
