import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { StatCard, EventRow } from '../components/ui/components';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../api/dashboardService';
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

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    dashboardService.getStudentDashboard()
      .then(setData)
      .catch(() => setData(null));
  }, []);

  const stats = data?.stats || {};
  const myTickets = (data?.myTickets || []).filter(ticket => ticket.status === 'VALID');
  const registeredEventIds = new Set(myTickets.map(ticket => Number(ticket.eventId)));
  const upcomingEvents = (data?.upcomingEvents || []).map(event => ({
    ...event,
    isRegistered: registeredEventIds.has(Number(event.id)),
  }));
  const myEvents = data?.myEvents || [];

  return (
    <DashboardLayout
      title={`Welcome back, ${user?.name?.split(' ')[0] || 'Student'}! 👋`}
      subtitle="Ready to discover what's happening on campus today?"
      actions={
        <Link to="/events" className="btn-primary text-sm">
          <span className="material-symbols-rounded text-base">search</span>
          Explore Events
        </Link>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="event"              label="Events Attended"  value={stats.eventsAttended || 0} color="blue" />
        <StatCard icon="calendar_today"     label="Upcoming Events"  value={stats.upcomingEvents || 0} color="purple" />
        <StatCard icon="confirmation_number" label="Active Tickets"  value={stats.activeTickets || 0}  color="green"  />
        <StatCard icon="star"               label="Points Earned"    value={stats.pointsEarned || 0}   color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-base" style={{ color: 'var(--clr-text)' }}>Upcoming Events</h2>
            <Link to="/events" className="text-xs text-primary-400 hover:underline">View All</Link>
          </div>
          <div className="space-y-1">
            {upcomingEvents.map(event => <EventRow key={event.id} event={event} showStatus />)}
          </div>
        </div>

        {/* My Tickets */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-base" style={{ color: 'var(--clr-text)' }}>My Active Tickets</h2>
            <Link to="/my-tickets" className="text-xs text-primary-400 hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {myTickets.map(ticket => (
              <Link
                key={ticket.id}
                to={`/tickets/${ticket.id}`}
                className="flex gap-3 p-3 rounded-lg border hover:border-primary-500/50 transition-all group"
                style={{ borderColor: 'var(--clr-border)', background: 'var(--clr-surface-cont)' }}
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
                <p className="text-sm font-semibold line-clamp-1 group-hover:text-primary-400 transition-colors" style={{ color: 'var(--clr-text)' }}>
                  {ticket.eventTitle}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--clr-muted)' }}>
                  {new Date(ticket.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {ticket.eventTime}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--clr-muted)' }}>{ticket.location}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="badge badge-green text-xs">VALID</span>
                  <span className="text-xs text-primary-400">View QR →</span>
                </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* My Registered Events */}
      <div className="card p-5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-base" style={{ color: 'var(--clr-text)' }}>My Registered Events</h2>
          <Link to="/events" className="text-xs text-primary-400 hover:underline">Browse More</Link>
        </div>
        <div className="space-y-1">
          {myEvents.map(event => <EventRow key={event.id} event={event} showStatus />)}
        </div>
      </div>

      {/* Notification */}
      <div className="mt-6 p-4 rounded-card border-l-4 border-l-primary-500 flex items-start gap-3" style={{ background: 'var(--clr-surface-cont)', borderColor: 'transparent' }}>
        <span className="material-symbols-rounded text-primary-400 text-xl shrink-0">campaign</span>
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--clr-text)' }}>Organizer Update</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--clr-muted)' }}>Venue changed for Career Fair 2024. Please check your ticket for the updated location.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
