import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { StatCard, EventRow } from '../components/ui/components';
import { dashboardService } from '../api/dashboardService';

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    dashboardService.getAdminDashboard()
      .then(setData)
      .catch(() => setData(null));
  }, []);

  const stats = data || {};
  const monthlyGrowth = stats.monthlyGrowth || {};
  const topCategories = stats.topCategories || [];
  const recentActivity = stats.recentActivity || [];
  const recentEvents = stats.recentEvents || [];

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
        <StatCard icon="confirmation_number" label="Tickets Sold"   value={(stats.ticketsSold || 0).toLocaleString()} color="green" change={monthlyGrowth.tickets} />
        <StatCard icon="payments"           label="Platform Revenue" value={`$${((stats.platformRevenue || 0)/1000).toFixed(1)}k`} color="orange" change={monthlyGrowth.revenue} />
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
          {recentEvents.map(event => <EventRow key={event.id} event={event} showStatus />)}
        </div>
      </div>
    </DashboardLayout>
  );
}
