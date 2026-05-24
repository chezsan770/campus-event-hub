import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

import LandingPage       from '../pages/LandingPage';
import LoginPage         from '../pages/LoginPage';
import RegisterPage      from '../pages/RegisterPage';
import EventsPage        from '../pages/EventsPage';
import EventDetailPage   from '../pages/EventDetailPage';
import StudentDashboard  from '../pages/StudentDashboard';
import AdminDashboard    from '../pages/AdminDashboard';
import OrganizerDashboard from '../pages/OrganizerDashboard';
import CreateEventPage   from '../pages/CreateEventPage';
import QRTicketPage      from '../pages/QRTicketPage';
import AppShell          from '../components/layout/AppShell';

// ─── Route Guards ─────────────────────────────────────────────────────────────
function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--clr-bg)' }}>
    <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
  </div>;
  return user ? children : <Navigate to="/login" replace />;
}

function RequireRole({ children, roles }) {
  const { user } = useAuth();
  if (!user || !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

// ─── My Tickets Page (simple list) ────────────────────────────────────────────
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { ticketService } from '../api/ticketService';
import EventCoverMedia from '../components/ui/EventCoverMedia';
import { getEventCoverStyle, hasCustomCover } from '../utils/eventArt';

function ticketEventCover(ticket) {
  return {
    imageGradient: ticket.imageGradient,
    coverImage: ticket.coverImage,
    coverPositionX: ticket.coverPositionX,
    coverPositionY: ticket.coverPositionY,
    coverZoom: ticket.coverZoom,
  };
}

function MyTicketsPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [ticketsError, setTicketsError] = useState('');

  useEffect(() => {
    ticketService.getMyTickets()
      .then(setTickets)
      .catch(() => {
        setTickets([]);
        setTicketsError('We could not load your tickets right now.');
      })
      .finally(() => setLoadingTickets(false));
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--clr-bg)' }}>
      {!user && <Navbar />}
      <div className={`max-w-4xl mx-auto px-4 ${user ? 'pt-8' : 'pt-24'} pb-12`}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-6">
          <div>
            <h1 className="text-headline-md font-black" style={{ color: 'var(--clr-text)' }}>My Tickets</h1>
            <p className="text-sm font-semibold mt-1" style={{ color: 'var(--clr-muted)' }}>
              Your registered event passes and QR tickets appear here.
            </p>
          </div>
          {tickets.length > 0 && (
            <Link to="/events" className="btn-primary px-5 py-2.5">
              <span className="material-symbols-rounded text-base">add_circle</span>
              Explore Events
            </Link>
          )}
        </div>

        {loadingTickets && (
          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg shimmer" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-2/3 rounded shimmer" />
                <div className="h-3 w-1/2 rounded shimmer" />
              </div>
            </div>
          </div>
        )}

        {!loadingTickets && ticketsError && (
          <div className="card p-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-black mb-1" style={{ color: 'var(--clr-text)' }}>Tickets are taking a break</h2>
              <p className="text-sm font-semibold" style={{ color: 'var(--clr-muted)' }}>{ticketsError}</p>
            </div>
            <button type="button" className="btn-secondary px-5 py-2.5" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        )}

        {!loadingTickets && !ticketsError && tickets.length === 0 && (
          <section className="empty-tickets-card">
            <div className="empty-ticket-art" aria-hidden="true">
              <div className="empty-ticket-stub empty-ticket-stub-a">
                <span className="material-symbols-rounded">confirmation_number</span>
              </div>
              <div className="empty-ticket-stub empty-ticket-stub-b">
                <span className="material-symbols-rounded">qr_code_2</span>
              </div>
              <div className="empty-ticket-main">
                <span className="material-symbols-rounded">event_available</span>
              </div>
            </div>
            <div className="empty-tickets-copy">
              <span className="badge badge-orange">No tickets yet</span>
              <h2>Pick an event and your ticket will land here.</h2>
              <p>
                Once you register for an approved event, this page will show your pass, QR code, venue, time, and ticket status.
              </p>
              <div className="empty-tickets-actions">
                <Link to="/events" className="btn-primary px-6 py-3">
                  <span className="material-symbols-rounded text-base">search</span>
                  Browse Events
                </Link>
                <Link to="/dashboard/student" className="btn-ghost px-6 py-3">
                  <span className="material-symbols-rounded text-base">home</span>
                  Dashboard
                </Link>
              </div>
            </div>
          </section>
        )}

        <div className="space-y-4">
          {!loadingTickets && !ticketsError && tickets.map(ticket => (
            <Link
              key={ticket.id}
              to={`/tickets/${ticket.id}`}
              className="card flex gap-4 p-5 hover:border-primary-500/50 transition-all no-underline"
            >
              <div
                className={`ticket-event-thumb event-cover ${hasCustomCover(ticketEventCover(ticket)) ? 'has-custom-cover' : ''}`}
                style={getEventCoverStyle(ticketEventCover(ticket))}
              >
                <EventCoverMedia event={ticketEventCover(ticket)} />
                {!hasCustomCover(ticketEventCover(ticket)) && (
                  <span className="material-symbols-rounded text-sm relative z-10" style={{ color: 'var(--clr-primary)' }}>event</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-base mb-1 truncate" style={{ color: 'var(--clr-text)' }}>{ticket.eventTitle}</h3>
                  <p className="text-sm" style={{ color: 'var(--clr-muted)' }}>
                    {new Date(ticket.eventDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {ticket.eventTime}
                  </p>
                  <p className="text-sm mt-0.5 truncate" style={{ color: 'var(--clr-muted)' }}>{ticket.location}</p>
                </div>
                <span className={`badge shrink-0 ${ticket.status === 'VALID' ? 'badge-green' : ticket.status === 'USED' ? 'bg-slate-500/15 text-slate-400' : 'badge-red'}`}>
                  {ticket.status}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-xs font-mono truncate" style={{ color: 'var(--clr-muted)' }}>{ticket.id}</p>
                <span className="text-xs text-primary-400 font-semibold">View QR →</span>
              </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 404 Page ─────────────────────────────────────────────────────────────────
function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--clr-bg)' }}>
      <div className="text-center animate-fade-in">
        <p className="text-8xl font-black gradient-text mb-4">404</p>
        <h1 className="text-headline-md font-bold mb-2" style={{ color: 'var(--clr-text)' }}>Page Not Found</h1>
        <p className="text-body-sm mb-8" style={{ color: 'var(--clr-muted)' }}>The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary px-8 py-3">Go Home</Link>
      </div>
    </div>
  );
}

// ─── Main Router ──────────────────────────────────────────────────────────────
export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"           element={<LandingPage />} />
      <Route path="/login"      element={<LoginPage />} />
      <Route path="/register"   element={<RegisterPage />} />
      <Route path="/events"     element={<AppShell><EventsPage /></AppShell>} />
      <Route path="/events/:id" element={<AppShell><EventDetailPage /></AppShell>} />

      {/* Authenticated */}
      <Route path="/my-tickets" element={<RequireAuth><AppShell><MyTicketsPage /></AppShell></RequireAuth>} />
      <Route path="/tickets/:id" element={<RequireAuth><AppShell><QRTicketPage /></AppShell></RequireAuth>} />

      {/* Student */}
      <Route path="/dashboard/student" element={<RequireAuth><StudentDashboard /></RequireAuth>} />

      {/* Admin */}
      <Route path="/dashboard/admin" element={
        <RequireAuth><RequireRole roles={['ADMIN']}><AdminDashboard /></RequireRole></RequireAuth>
      } />

      {/* Organizer */}
      <Route path="/dashboard/organizer" element={
        <RequireAuth><RequireRole roles={['ORGANIZER','ADMIN']}><OrganizerDashboard /></RequireRole></RequireAuth>
      } />
      <Route path="/events/create" element={
        <RequireAuth><RequireRole roles={['ORGANIZER','ADMIN']}><CreateEventPage /></RequireRole></RequireAuth>
      } />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
