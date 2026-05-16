import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { eventService } from '../api/eventService';
import { CATEGORIES } from '../data/dummyData';

const INITIAL = {
  title: '', description: '', category: 'tech', date: '', time: '', endTime: '',
  location: '', venue: '', capacity: 100, price: 0, tags: '',
};

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
      await eventService.createEvent(data);
      navigate('/dashboard/organizer');
    } catch (err) {
      setError(err.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const gradients = [
    { value: 'from-blue-600 to-purple-600',   label: 'Ocean' },
    { value: 'from-purple-600 to-pink-600',    label: 'Dusk' },
    { value: 'from-orange-500 to-red-500',     label: 'Sunset' },
    { value: 'from-green-500 to-teal-500',     label: 'Forest' },
    { value: 'from-cyan-500 to-blue-500',      label: 'Sky' },
    { value: 'from-violet-600 to-blue-600',    label: 'Galaxy' },
  ];
  const [selectedGradient, setSelectedGradient] = useState(gradients[0].value);

  return (
    <DashboardLayout title="Create New Event" subtitle="Fill in the details to publish your event">
      <div className="max-w-3xl mx-auto">
        {/* Step Indicator */}
        <div className="flex items-center gap-3 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-3">
              <button
                onClick={() => setStep(s)}
                className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                  s === step ? 'bg-primary-500 text-white shadow-glow-primary' :
                  s < step  ? 'bg-green-500 text-white' : ''
                }`}
                style={{ background: s > step ? 'var(--clr-surface-high)' : undefined, color: s > step ? 'var(--clr-muted)' : undefined }}
              >
                {s < step ? '✓' : s}
              </button>
              <span className={`text-xs font-medium ${s === step ? 'text-primary-400' : ''}`} style={{ color: s !== step ? 'var(--clr-muted)' : undefined }}>
                {s === 1 ? 'Basic Info' : s === 2 ? 'Details' : 'Publish'}
              </span>
              {s < 3 && <div className="w-16 h-px ml-1" style={{ background: 'var(--clr-border)' }} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1 – Basic Info */}
          {step === 1 && (
            <div className="card p-6 space-y-5 animate-fade-in">
              <h2 className="font-bold text-base" style={{ color: 'var(--clr-text)' }}>Basic Information</h2>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold" style={{ color: 'var(--clr-muted)' }}>Event Title *</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Annual Tech Symposium 2025" className="input-field" required />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold" style={{ color: 'var(--clr-muted)' }}>Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe what attendees can expect..." className="input-field resize-none" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold" style={{ color: 'var(--clr-muted)' }}>Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className="input-field">
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold" style={{ color: 'var(--clr-muted)' }}>Price ($)</label>
                  <input name="price" type="number" min="0" value={form.price} onChange={handleChange} className="input-field" placeholder="0 for free" />
                </div>
              </div>

              {/* Cover Gradient Picker */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold" style={{ color: 'var(--clr-muted)' }}>Cover Style</label>
                <div className="flex flex-wrap gap-2">
                  {gradients.map(g => (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => setSelectedGradient(g.value)}
                      className={`w-12 h-8 rounded-lg bg-gradient-to-br ${g.value} transition-all ${selectedGradient === g.value ? 'ring-2 ring-white ring-offset-2 ring-offset-dark-bg scale-110' : 'hover:scale-105'}`}
                      title={g.label}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={() => setStep(2)} className="btn-primary px-6">Continue →</button>
              </div>
            </div>
          )}

          {/* Step 2 – Details */}
          {step === 2 && (
            <div className="card p-6 space-y-5 animate-fade-in">
              <h2 className="font-bold text-base" style={{ color: 'var(--clr-text)' }}>Event Details</h2>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold" style={{ color: 'var(--clr-muted)' }}>Date *</label>
                  <input name="date" type="date" value={form.date} onChange={handleChange} className="input-field" required />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold" style={{ color: 'var(--clr-muted)' }}>Start Time *</label>
                  <input name="time" type="time" value={form.time} onChange={handleChange} className="input-field" required />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold" style={{ color: 'var(--clr-muted)' }}>End Time</label>
                  <input name="endTime" type="time" value={form.endTime} onChange={handleChange} className="input-field" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold" style={{ color: 'var(--clr-muted)' }}>Location Name *</label>
                <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Main Auditorium" className="input-field" required />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold" style={{ color: 'var(--clr-muted)' }}>Full Venue Address</label>
                <input name="venue" value={form.venue} onChange={handleChange} placeholder="e.g. Engineering Building, Room 101" className="input-field" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold" style={{ color: 'var(--clr-muted)' }}>Capacity *</label>
                  <input name="capacity" type="number" min="1" value={form.capacity} onChange={handleChange} className="input-field" required />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold" style={{ color: 'var(--clr-muted)' }}>Tags (comma-separated)</label>
                  <input name="tags" value={form.tags} onChange={handleChange} placeholder="AI, Networking, Workshop" className="input-field" />
                </div>
              </div>

              <div className="flex justify-between">
                <button type="button" onClick={() => setStep(1)} className="btn-ghost">← Back</button>
                <button type="button" onClick={() => setStep(3)} className="btn-primary px-6">Review →</button>
              </div>
            </div>
          )}

          {/* Step 3 – Review & Publish */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="card p-6">
                <h2 className="font-bold text-base mb-4" style={{ color: 'var(--clr-text)' }}>Event Preview</h2>
                {/* Preview card */}
                <div className="rounded-card overflow-hidden border" style={{ borderColor: 'var(--clr-border)' }}>
                  <div className={`h-32 bg-gradient-to-br ${selectedGradient} flex items-end p-4`}>
                    <span className="badge badge-blue">{CATEGORIES.find(c => c.id === form.category)?.label}</span>
                  </div>
                  <div className="p-4" style={{ background: 'var(--clr-surface-cont)' }}>
                    <h3 className="font-bold text-base mb-1" style={{ color: 'var(--clr-text)' }}>{form.title || 'Untitled Event'}</h3>
                    <p className="text-xs line-clamp-2 mb-3" style={{ color: 'var(--clr-muted)' }}>{form.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: 'var(--clr-muted)' }}>
                      <span>📅 {form.date || 'TBD'} • {form.time || '--:--'}</span>
                      <span>📍 {form.location || 'TBD'}</span>
                      <span>👥 Capacity: {form.capacity}</span>
                      <span>💰 {form.price == 0 ? 'FREE' : `$${form.price}`}</span>
                    </div>
                  </div>
                </div>
              </div>

              {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">{error}</div>}

              <div className="flex justify-between">
                <button type="button" onClick={() => setStep(2)} className="btn-ghost">← Back</button>
                <button type="submit" disabled={loading} className="btn-primary px-8 py-3">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Publishing...
                    </span>
                  ) : (
                    <><span className="material-symbols-rounded text-base">publish</span> Publish Event</>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </DashboardLayout>
  );
}
