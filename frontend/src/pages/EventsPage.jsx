import { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import EventCard from '../components/ui/EventCard';
import { CategoryChip } from '../components/ui/components';
import { eventService } from '../api/eventService';
import { ticketService } from '../api/ticketService';
import { useAuth } from '../context/AuthContext';

export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [activeStatus, setActiveStatus] = useState('');
  const [categories, setCategories] = useState([]);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const [data, tickets] = await Promise.all([
        eventService.getEvents({ category: activeCategory, status: activeStatus, search }),
        user ? ticketService.getMyTickets().catch(() => []) : Promise.resolve([]),
      ]);
      const registeredEventIds = new Set(tickets.map(ticket => Number(ticket.eventId)));
      setEvents((data.content || []).map(event => ({
        ...event,
        isRegistered: registeredEventIds.has(Number(event.id)),
      })));
    } finally {
      setLoading(false);
    }
  }, [activeCategory, activeStatus, search, user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    eventService.getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const STATUSES = [
    { value: '',         label: 'All' },
    { value: 'UPCOMING', label: 'Upcoming' },
    { value: 'PAST',     label: 'Past' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--clr-bg)' }}>
      {!user && <Navbar />}

      {/* Page Header */}
      <div className={`${user ? 'pt-8' : 'pt-20'} pb-8 px-4`} style={{ background: 'var(--clr-surface)' }}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-headline-lg font-black mt-4 mb-1" style={{ color: 'var(--clr-text)' }}>Explore Events</h1>
          <p className="text-body-sm" style={{ color: 'var(--clr-muted)' }}>Discover what's happening around campus</p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-6 flex gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--clr-muted)' }} />
              <input
                type="text"
                placeholder="Search events, clubs, topics..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-11"
              />
            </div>
            <button type="submit" className="btn-primary px-5">Search</button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex items-center gap-1.5 mr-2">
            <SlidersHorizontal size={14} style={{ color: 'var(--clr-muted)' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--clr-muted)' }}>Filter:</span>
          </div>

          {/* Status tabs */}
          {STATUSES.map(s => (
            <CategoryChip
              key={s.value}
              label={s.label}
              active={activeStatus === s.value}
              onClick={() => setActiveStatus(s.value)}
            />
          ))}

          <div className="w-px h-5 mx-1" style={{ background: 'var(--clr-border)' }} />

          {/* Category chips */}
          <CategoryChip label="All Categories" active={activeCategory === ''} onClick={() => setActiveCategory('')} />
          {categories.map(cat => (
            <CategoryChip
              key={cat.id}
              label={cat.label}
              active={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
            />
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm" style={{ color: 'var(--clr-muted)' }}>
            {loading ? 'Loading...' : `${events.length} events found`}
          </p>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card h-72 shimmer" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-24">
            <span className="material-symbols-rounded text-6xl text-blue-400/30 block mb-4">search_off</span>
            <h3 className="text-headline-sm font-bold mb-2" style={{ color: 'var(--clr-text)' }}>No events found</h3>
            <p className="text-sm" style={{ color: 'var(--clr-muted)' }}>Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-fade-in">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
