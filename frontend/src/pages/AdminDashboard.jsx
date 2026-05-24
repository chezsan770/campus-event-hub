import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { StatCard, EventRow } from '../components/ui/components';
import { dashboardService } from '../api/dashboardService';
import { eventService } from '../api/eventService';
import ConfirmDialog from '../components/ui/ConfirmDialog';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [approvingId, setApprovingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  const fetchDashboard = useCallback(() => {
    dashboardService.getAdminDashboard()
      .then(setData)
      .catch(() => setData(null));
  }, []);

  useEffect(() => {
    fetchDashboard();
    const interval = window.setInterval(fetchDashboard, 15000);
    return () => window.clearInterval(interval);
  }, [fetchDashboard]);

  const handleApprove = async (eventId) => {
    setDeleteError('');
    setApprovingId(eventId);
    try {
      await eventService.approveEvent(eventId);
      await fetchDashboard();
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (eventId) => {
    setDeleteError('');
    setRejectingId(eventId);
    try {
      await eventService.rejectEvent(eventId);
      await fetchDashboard();
    } finally {
      setRejectingId(null);
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setDeleteError('');
    setDeletingId(pendingDelete.id);
    try {
      await eventService.deleteEvent(pendingDelete.id);
      await fetchDashboard();
    } catch (err) {
      setDeleteError(err.response?.data?.message || err.message || 'Could not delete event.');
    } finally {
      setDeletingId(null);
      setPendingDelete(null);
    }
  };

  const stats = data || {};
  const monthlyGrowth = stats.monthlyGrowth || {};
  const topCategories = stats.topCategories || [];
  const recentActivity = stats.recentActivity || [];
  const recentEvents = stats.recentEvents || [];
  const pendingEvents = stats.pendingEvents || [];

  return (
    <DashboardLayout
      title="Admin Dashboard"
      subtitle="Overview of platform metrics and management tools."
      actions={
        <div className="flex gap-2">
          <Link to="/events/create" className="btn-primary text-sm">
            <span className="material-symbols-rounded text-base">add</span>
            New Event
          </Link>
        </div>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="group"              label="Total Users"      value={(stats.totalUsers || 0).toLocaleString()} color="blue"   change={monthlyGrowth.users} />
        <StatCard icon="event"              label="Active Events"    value={stats.activeEvents || 0}                color="purple" change={monthlyGrowth.events} />
        <StatCard icon="notifications_active" label="Pending Reviews" value={stats.pendingEventsCount || 0} color="orange" />
        <StatCard icon="confirmation_number" label="Tickets Sold"   value={(stats.ticketsSold || 0).toLocaleString()} color="green" change={monthlyGrowth.tickets} />
      </div>

      <div className="card p-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="font-bold text-base" style={{ color: 'var(--clr-text)' }}>Organizer Event Reviews</h2>
            <p className="text-xs mt-1" style={{ color: 'var(--clr-muted)' }}>
              New organizer events stay hidden from students until approved.
            </p>
          </div>
          <span className="badge badge-orange">
            {pendingEvents.length} pending
          </span>
        </div>

        {pendingEvents.length === 0 ? (
          <div className="p-4 rounded-card text-sm font-semibold" style={{ background: 'var(--clr-surface-cont)', color: 'var(--clr-muted)' }}>
            No event approvals waiting right now.
          </div>
        ) : (
          <div className="space-y-2">
            {deleteError && (
              <div className="p-3 rounded-card border text-sm font-semibold text-red-400" style={{ background: 'var(--clr-surface-cont)', borderColor: 'var(--clr-border)' }}>
                {deleteError}
              </div>
            )}
            {pendingEvents.map(event => (
              <div key={event.id} className="admin-review-row">
                <EventRow event={event} showStatus />
                <div className="admin-review-actions">
                  <button
                    type="button"
                    className="btn-primary px-4 py-2 text-xs"
                    disabled={approvingId === event.id || rejectingId === event.id}
                    onClick={() => handleApprove(event.id)}
                  >
                    <span className="material-symbols-rounded text-base">verified</span>
                    {approvingId === event.id ? 'Approving...' : 'Approve'}
                  </button>
                  <button
                    type="button"
                    className="btn-reject px-4 py-2 text-xs"
                    disabled={approvingId === event.id || rejectingId === event.id}
                    onClick={() => handleReject(event.id)}
                  >
                    <span className="material-symbols-rounded text-base">block</span>
                    {rejectingId === event.id ? 'Rejecting...' : 'Reject'}
                  </button>
                  <button
                    type="button"
                    className="btn-ghost px-4 py-2 text-xs"
                    disabled={approvingId === event.id || rejectingId === event.id || deletingId === event.id}
                    onClick={() => setPendingDelete(event)}
                  >
                    <span className="material-symbols-rounded text-base">delete</span>
                    {deletingId === event.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Top Categories */}
        <div className="card p-5">
          <h2 className="font-bold text-base mb-4" style={{ color: 'var(--clr-text)' }}>Top Categories</h2>
          <div className="space-y-3">
            {topCategories.map(cat => (
              <div key={cat.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span style={{ color: 'var(--clr-text)' }}>{cat.name}</span>
                  <span style={{ color: 'var(--clr-muted)' }}>{cat.count} events</span>
                </div>
                <div className="w-full h-1.5 rounded-pill overflow-hidden" style={{ background: 'var(--clr-surface-high)' }}>
                  <div className="h-full rounded-pill bg-primary-500" style={{ width: `${cat.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 card p-5">
          <h2 className="font-bold text-base mb-4" style={{ color: 'var(--clr-text)' }}>Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((act, i) => {
              const iconMap = { EVENT_CREATED: 'add_circle', USER_REGISTERED: 'person_add', EVENT_PENDING: 'pending', TICKET_SOLD: 'confirmation_number' };
              const colorMap = { EVENT_CREATED: 'text-green-400 bg-green-500/10', USER_REGISTERED: 'text-blue-400 bg-blue-500/10', EVENT_PENDING: 'text-orange-400 bg-orange-500/10', TICKET_SOLD: 'text-purple-400 bg-purple-500/10' };
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colorMap[act.type]}`}>
                    <span className="material-symbols-rounded text-sm">{iconMap[act.type]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--clr-text)' }}>{act.message}</p>
                    <p className="text-xs" style={{ color: 'var(--clr-muted)' }}>{act.user}</p>
                  </div>
                  <span className="text-xs shrink-0" style={{ color: 'var(--clr-muted)' }}>{act.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Management */}
      <div className="card p-5 mb-6">
        <h2 className="font-bold text-base mb-4" style={{ color: 'var(--clr-text)' }}>Quick Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: 'manage_accounts', iconSub: 'group', title: 'Manage Users', desc: 'Review roles, approve organizers, and handle account issues.', action: 'View Directory', to: '/admin/users', color: 'blue' },
            { icon: 'event_upcoming',  iconSub: 'event', title: 'Manage Events', desc: 'Approve pending events, feature content, and moderate listings.', action: 'Review Queue', to: '/events', color: 'purple' },
          ].map(item => (
            <div key={item.title} className="p-4 rounded-card border hover:border-primary-500/40 transition-all" style={{ background: 'var(--clr-surface-cont)', borderColor: 'var(--clr-border)' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex gap-2">
                  <div className={`w-9 h-9 rounded-lg bg-${item.color}-500/10 text-${item.color}-400 flex items-center justify-center`}>
                    <span className="material-symbols-rounded text-lg">{item.icon}</span>
                  </div>
                  <div className={`w-9 h-9 rounded-lg bg-${item.color}-500/05 text-${item.color}-400/60 flex items-center justify-center`}>
                    <span className="material-symbols-rounded text-lg">{item.iconSub}</span>
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--clr-text)' }}>{item.title}</h3>
              <p className="text-xs mb-3" style={{ color: 'var(--clr-muted)' }}>{item.desc}</p>
              <Link to={item.to} className="inline-flex items-center gap-1 text-xs text-primary-400 font-semibold hover:underline">
                {item.action} <span className="material-symbols-rounded text-sm">arrow_forward</span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Activity */}
      <div className="card p-5">
        <h2 className="font-bold text-base mb-4" style={{ color: 'var(--clr-text)' }}>Platform Activity (30 Days)</h2>
        <div className="space-y-1">
          {deleteError && (
            <div className="p-3 mb-3 rounded-card border text-sm font-semibold text-red-400" style={{ background: 'var(--clr-surface-cont)', borderColor: 'var(--clr-border)' }}>
              {deleteError}
            </div>
          )}
          {recentEvents.map(event => (
            <div key={event.id} className="admin-review-row">
              <EventRow event={event} showStatus />
              <div className="admin-review-actions">
                <button
                  type="button"
                  className="btn-ghost px-4 py-2 text-xs"
                  disabled={deletingId === event.id}
                  onClick={() => setPendingDelete(event)}
                >
                  <span className="material-symbols-rounded text-base">delete</span>
                  {deletingId === event.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete event?"
        message={pendingDelete ? `Delete "${pendingDelete.title}"? This will also remove any tickets for this event.` : ''}
        confirmLabel="Delete Event"
        loading={Boolean(deletingId)}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </DashboardLayout>
  );
}
