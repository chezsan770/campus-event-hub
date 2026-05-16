import { Routes, Route, Navigate } from 'react-router-dom';
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
import { DUMMY_TICKETS } from '../data/dummyData';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

function MyTicketsPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--clr-bg)' }}>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">
        <h1 className="text-headline-md font-bold mb-6" style={{ color: 'var(--clr-text)' }}>My Tickets</h1>
        <div className="space-y-4">
          {DUMMY_TICKETS.map(ticket => (
            <Link
              key={ticket.id}
              to={`/tickets/${ticket.id}`}
              className="card block p-5 hover:border-primary-500/50 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-base mb-1" style={{ color: 'var(--clr-text)' }}>{ticket.eventTitle}</h3>
                  <p className="text-sm" style={{ color: 'var(--clr-muted)' }}>
                    {new Date(ticket.eventDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {ticket.eventTime}
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--clr-muted)' }}>{ticket.location}</p>
                </div>
                <span className={`badge ${ticket.status === 'VALID' ? 'badge-green' : ticket.status === 'USED' ? 'bg-slate-500/15 text-slate-400' : 'badge-red'}`}>
                  {ticket.status}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs font-mono" style={{ color: 'var(--clr-muted)' }}>{ticket.id}</p>
                <span className="text-xs text-primary-400 font-semibold">View QR →</span>
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
      <Route path="/events"     element={<EventsPage />} />
      <Route path="/events/:id" element={<EventDetailPage />} />

      {/* Authenticated */}
      <Route path="/my-tickets" element={<RequireAuth><MyTicketsPage /></RequireAuth>} />
      <Route path="/tickets/:id" element={<RequireAuth><QRTicketPage /></RequireAuth>} />

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
