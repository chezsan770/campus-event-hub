import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus, ChevronRight, MapPin, Calendar, Users } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { eventService } from '../api/eventService';
import { getEventArtStyle } from '../utils/eventArt';

/* ── Data ───────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: 'bolt',
    title: 'Ease of Use',
    desc: 'An intuitive dashboard that lets organizers create events in minutes, and students find them in seconds. No training required.',
    color: '#4A6163',
    bg: '#FFC94B',
  },
  {
    icon: 'qr_code_scanner',
    title: 'QR Ticketing',
    desc: 'Say goodbye to paper lists. Instant QR code generation for tickets ensures smooth, lightning-fast check-ins at the door.',
    color: '#FFFFFF',
    bg: '#F17A7E',
  },
  {
    icon: 'analytics',
    title: 'Smart Analytics',
    desc: 'Track attendance, monitor engagement, and gather feedback seamlessly to make your next campus event even better.',
    color: '#4A6163',
    bg: '#F9A66C',
  },
];

/* ── Helpers ─────────────────────────────────────────────── */
function formatDate(dateStr, timeStr) {
  const d = new Date(dateStr);
  return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${timeStr}`;
}

function getCatLabel(catId) {
  return catId?.categoryLabel || catId?.category || catId;
}

/* ── Inline event-card for the featured grid ─────────────── */
function FeaturedCard({ event, large = false }) {
  const artStyle = getEventArtStyle(event.imageGradient);

  if (large) {
    return (
      <Link
        to={`/events/${event.id}`}
        className="featured-card-large event-art group"
        style={artStyle}
      >
        {/* Overlay */}
        <div className="featured-card-overlay" />

        {/* Badges */}
        <div className="featured-card-top">
          <span className="event-badge-cat">{getCatLabel(event)}</span>
          {event.price === 0
            ? <span className="event-badge-free">FREE</span>
            : <span className="event-badge-paid">${event.price}</span>}
        </div>

        {/* Info */}
        <div className="featured-card-bottom">
          <p className="featured-card-meta">
            <Calendar size={12} style={{ display:'inline', marginRight:4, verticalAlign:'middle' }} />
            {formatDate(event.date, event.time)}
          </p>
          <h3 className="featured-card-title">{event.title}</h3>
          <p className="featured-card-desc">{event.description}</p>
          <div className="featured-card-footer">
            <span className="featured-card-location">
              <MapPin size={12} style={{ display:'inline', marginRight:4, verticalAlign:'middle' }} />
              {event.location}
            </span>
            <span className="featured-card-attendees">
              <Users size={12} style={{ display:'inline', marginRight:4, verticalAlign:'middle' }} />
              {event.registered}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/events/${event.id}`}
      className="featured-card-small group"
    >
      <div className="featured-card-small-img event-art" style={artStyle} />
      <div className="featured-card-small-body">
        <p className="featured-card-small-meta">
          <Calendar size={11} style={{ display:'inline', marginRight:3, verticalAlign:'middle' }} />
          {formatDate(event.date, event.time)}
        </p>
        <h4 className="featured-card-small-title group-hover:text-primary-400">{event.title}</h4>
        <p className="featured-card-small-desc">{event.description}</p>
        <span className="featured-card-small-loc">
          <MapPin size={11} style={{ display:'inline', marginRight:3, verticalAlign:'middle' }} />
          {event.location}
        </span>
      </div>
    </Link>
  );
}

/* ── Page ────────────────────────────────────────────────── */
export default function LandingPage() {
  const pageRef = useRef(null);
  const orbRef = useRef(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    eventService.getEvents({ size: 5, status: 'UPCOMING' })
      .then(data => setEvents(data.content || []))
      .catch(() => setEvents([]));
  }, []);

  const heroEvent = events.find(event => event.featured) || events[0];
  const sideEvents = events.filter(event => event.id !== heroEvent?.id).slice(0, 2);
  const bottomEvents = events
    .filter(event => event.id !== heroEvent?.id && !sideEvents.some(side => side.id === event.id))
    .slice(0, 2);

  useEffect(() => {
    const page = pageRef.current;
    const orb = orbRef.current;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (!page || !orb || !canHover) {
      return undefined;
    }

    let frame = 0;
    const hoverSelector = 'a, button, .landing-hero-panel, .featured-card-large, .featured-card-small, .landing-feature-card';

    const moveOrb = (event) => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        orb.style.setProperty('--cursor-x', `${event.clientX}px`);
        orb.style.setProperty('--cursor-y', `${event.clientY}px`);
        orb.classList.add('is-visible');
        orb.classList.toggle('is-hovering', Boolean(event.target.closest(hoverSelector)));
      });
    };

    const syncHoverState = (event) => {
      const target = event.target.closest(hoverSelector);
      orb.classList.toggle('is-hovering', Boolean(target));
    };

    const showOrb = () => orb.classList.add('is-visible');
    const hideOrb = () => orb.classList.remove('is-visible', 'is-hovering');

    page.addEventListener('pointermove', moveOrb);
    page.addEventListener('pointerover', syncHoverState);
    page.addEventListener('pointerout', syncHoverState);
    page.addEventListener('pointerenter', showOrb);
    page.addEventListener('pointerleave', hideOrb);

    return () => {
      window.cancelAnimationFrame(frame);
      page.removeEventListener('pointermove', moveOrb);
      page.removeEventListener('pointerover', syncHoverState);
      page.removeEventListener('pointerout', syncHoverState);
      page.removeEventListener('pointerenter', showOrb);
      page.removeEventListener('pointerleave', hideOrb);
    };
  }, []);

  return (
    <div ref={pageRef} className="landing-page-shell min-h-screen flex flex-col" style={{ background: 'var(--clr-bg)' }}>
      <div ref={orbRef} className="landing-hover-orb" aria-hidden="true" />
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="landing-hero">
        <div className="landing-hero-inner">

          {/* Left: text */}
          <div className="landing-hero-text">
            {/* Pill badge */}
            <div className="landing-hero-pill">
              <Link to="/" className="landing-hero-pill-link">Your Campus Best Hub →</Link>
            </div>

            <h1 className="landing-hero-h1">
              Discover and Manage{' '}
              <span className="gradient-text">Campus Events</span>{' '}
              Easily
            </h1>

            <p className="landing-hero-sub">
              The all-in-one platform for students to find experiences and organizers to
              manage them seamlessly. From workshops to weekend socials, connect with
              your campus community.
            </p>

            <div className="landing-hero-actions">
              <Link to="/events" className="btn-primary gap-2 px-6 py-3 text-sm">
                Explore Events <ArrowRight size={16} />
              </Link>
              <Link to="/register" className="btn-secondary gap-2 px-6 py-3 text-sm">
                <Plus size={16} /> Create Event
              </Link>
            </div>
          </div>

          {/* Right: mock UI panel */}
          <div className="landing-hero-panel">
            {/* Panel header */}
            <div className="lhp-header">
              <div className="lhp-header-dot red" />
              <div className="lhp-header-dot yellow" />
              <div className="lhp-header-dot green" />
              <span className="lhp-header-title">Upcoming Events</span>
            </div>

            {/* Hero event card inside panel */}
            <div
              className="lhp-event-img event-art"
              style={getEventArtStyle(heroEvent?.imageGradient)}
            >
              <div className="lhp-event-img-overlay" />
              <div className="lhp-event-img-content">
                <span className="lhp-event-cat">Technology</span>
                <p className="lhp-event-title">Annual Tech Symposium 2024</p>
              </div>
            </div>

            {/* Mini cards inside panel */}
            {sideEvents.map(ev => {
              return (
                <div key={ev.id} className="lhp-mini-card">
                  <div className="lhp-mini-thumb event-art" style={getEventArtStyle(ev.imageGradient)} />
                  <div className="lhp-mini-info">
                    <p className="lhp-mini-title">{ev.title}</p>
                    <p className="lhp-mini-meta">
                      {formatDate(ev.date, ev.time)} · {ev.location}
                    </p>
                  </div>
                  <span className="lhp-mini-price">
                    {ev.price === 0 ? 'FREE' : `$${ev.price}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Featured Upcoming Events ──────────────────────── */}
      <section className="landing-events" id="events">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title text-2xl">Featured Upcoming Events</h2>
              <p className="section-subtitle">Don't miss out on what's happening around campus.</p>
            </div>
            <Link to="/events" className="btn-ghost text-sm flex items-center gap-1">
              View all events <ChevronRight size={15} />
            </Link>
          </div>

          {/* Asymmetric grid: large left + 2 stacked right */}
          <div className="landing-events-grid">
            {/* Large card */}
            {heroEvent && <FeaturedCard event={heroEvent} large />}

            {/* Right column: 2 stacked medium cards */}
            <div className="landing-events-side">
              {sideEvents.map(ev => (
                <FeaturedCard key={ev.id} event={ev} />
              ))}
            </div>
          </div>

          {/* Bottom row: 2 horizontal mini cards */}
          <div className="landing-events-bottom">
            {bottomEvents.map(ev => (
              <FeaturedCard key={ev.id} event={ev} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Why use Campus Event Hub? ─────────────────────── */}
      <section className="landing-features" id="features">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="section-title text-2xl mb-2">Why use Campus Event Hub?</h2>
          <p className="section-subtitle max-w-lg mx-auto mb-12">
            Built specifically for the dynamic environment of university life, bridging the gap
            between organizers and attendees.
          </p>

          <div className="landing-features-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="landing-feature-card">
                <div
                  className="landing-feature-icon"
                  style={{ background: f.bg, color: f.color }}
                >
                  <span className="material-symbols-rounded" style={{ fontSize: 22 }}>{f.icon}</span>
                </div>
                <h3 className="landing-feature-title">{f.title}</h3>
                <p className="landing-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="brand-mark w-6 h-6 rounded bg-gradient-primary flex items-center justify-center">
                <span className="material-symbols-rounded text-white" style={{ fontSize: 14 }}>event</span>
              </div>
              <span className="font-bold text-sm" style={{ color: 'var(--clr-text)' }}>Campus Event Hub</span>
            </div>
            <p className="text-xs" style={{ color: 'var(--clr-muted)' }}>© 2024 Campus Event Hub. Built for student life.</p>
          </div>
          <div className="flex gap-5">
            {['Explore Events', 'Organizer Dashboard', 'Privacy Policy', 'Contact Us'].map(l => (
              <Link key={l} to="#" className="text-xs hover:text-primary-400 transition-colors" style={{ color: 'var(--clr-muted)' }}>{l}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
