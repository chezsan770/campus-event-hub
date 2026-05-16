import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { StatCard, EventRow } from '../components/ui/components';
import { useAuth } from '../context/AuthContext';
import { DUMMY_EVENTS, ORGANIZER_STATS } from '../data/dummyData';

const myEvents = DUMMY_EVENTS.filter(e => e.organizerId === 2);

export default function OrganizerDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout
      title="Organizer Dashboard"
      subtitle={`Manage your events and track performance, ${user?.name?.split(' ')[0]}.`}
      actions={
        <Link to="/events/create" className="btn-primary text-sm">
          <span className="material-symbols-rounded text-base">add_circle</span>
          Create New Event
        </Link>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="event"        label="Total Events"    value={ORGANIZER_STATS.totalEvents}   color="blue"   />
        <StatCard icon="event_available" label="Active Events" value={ORGANIZER_STATS.activeEvents} color="green"  />
        <StatCard icon="group"        label="Total Attendees" value={ORGANIZER_STATS.totalAttendees.toLocaleString()} color="purple" />
        <StatCard icon="star"         label="Avg. Rating"     value={`${ORGANIZER_STATS.avgRating} ★`} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* My Events Table */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-base" style={{ color: 'var(--clr-text)' }}>My Events</h2>
            <Link to="/events/create" className="btn-secondary text-xs py-1.5 px-3">+ Create Event</Link>
          </div>
          <div className="space-y-1">
            {myEvents.map(event => <EventRow key={event.id} event={event} showStatus />)}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-5">
          <h2 className="font-bold text-base mb-4" style={{ color: 'var(--clr-text)' }}>Quick Actions</h2>
          <div className="space-y-2">
            {[
              { icon: 'add_circle',    label: 'Create New Event',    to: '/events/create',   color: 'blue' },
              { icon: 'group',         label: 'View Attendees',       to: '#attendees',       color: 'purple' },
              { icon: 'qr_code',       label: 'Scan Ticket QR',      to: '#scan',            color: 'green' },
              { icon: 'analytics',     label: 'View Analytics',       to: '#analytics',       color: 'orange' },
              { icon: 'campaign',      label: 'Send Announcement',    to: '#announce',        color: 'purple' },
            ].map(action => (
              <Link
                key={action.label}
                to={action.to}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group"
              >
                <div className={`w-8 h-8 rounded-lg bg-${action.color}-500/10 text-${action.color}-400 flex items-center justify-center shrink-0`}>
                  <span className="material-symbols-rounded text-base">{action.icon}</span>
                </div>
                <span className="text-sm font-medium group-hover:text-primary-400 transition-colors" style={{ color: 'var(--clr-text)' }}>{action.label}</span>
                <span className="material-symbols-rounded text-sm ml-auto" style={{ color: 'var(--clr-muted)' }}>chevron_right</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="card p-5" id="analytics">
        <h2 className="font-bold text-base mb-4" style={{ color: 'var(--clr-text)' }}>Analytics Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Avg. Attendance Rate', value: '78%',  bar: 78,  color: 'bg-primary-500' },
            { label: 'Ticket Scan Rate',      value: '92%',  bar: 92,  color: 'bg-green-500' },
            { label: 'Repeat Attendees',      value: '45%',  bar: 45,  color: 'bg-purple-500' },
          ].map(m => (
            <div key={m.label} className="p-4 rounded-card" style={{ background: 'var(--clr-surface-cont)' }}>
              <p className="text-xs font-medium mb-2" style={{ color: 'var(--clr-muted)' }}>{m.label}</p>
              <p className="text-2xl font-black mb-2" style={{ color: 'var(--clr-text)' }}>{m.value}</p>
              <div className="w-full h-1.5 rounded-pill overflow-hidden" style={{ background: 'var(--clr-surface-high)' }}>
                <div className={`h-full rounded-pill ${m.color}`} style={{ width: m.value }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
