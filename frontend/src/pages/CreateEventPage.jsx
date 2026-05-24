import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { eventService } from '../api/eventService';
import { useAuth } from '../context/AuthContext';
import { getEventArtStyle, getEventCoverStyle, hasCustomCover } from '../utils/eventArt';
import EventCoverMedia from '../components/ui/EventCoverMedia';

const INITIAL = {
  title: '', description: '', category: 'tech', date: '', time: '', endTime: '',
  location: '', venue: '', capacity: 100, price: 0, tags: '',
};

const COVER_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export default function CreateEventPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [coverImage, setCoverImage] = useState('');
  const [coverPositionX, setCoverPositionX] = useState(50);
  const [coverPositionY, setCoverPositionY] = useState(50);
  const [coverZoom, setCoverZoom] = useState(100);
  const [coverImageSize, setCoverImageSize] = useState({ width: 0, height: 0 });
  const [coverFrameSize, setCoverFrameSize] = useState({ width: 0, height: 0 });
  const coverPreviewRef = useRef(null);

  useEffect(() => {
    eventService.getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleCoverUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!COVER_IMAGE_TYPES.includes(file.type)) {
      setError('Please upload a JPG, PNG, WEBP, or GIF cover image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = String(reader.result || '');
      const image = new Image();
      image.onload = () => {
        setCoverImageSize({ width: image.naturalWidth, height: image.naturalHeight });
      };
      image.src = imageUrl;
      setCoverImage(imageUrl);
      setCoverPositionX(50);
      setCoverPositionY(50);
      setCoverZoom(100);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = {
        ...form,
        imageGradient: selectedGradient,
        coverImage,
        coverPositionX: effectiveCoverPositionX,
        coverPositionY: effectiveCoverPositionY,
        coverZoom: effectiveCoverZoom,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      await eventService.createEvent(data);
      navigate(user?.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/organizer');
    } catch (err) {
      setError(err.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const gradients = [
    { value: 'from-blue-600 to-purple-600',   label: 'Yellow' },
    { value: 'from-purple-600 to-pink-600',   label: 'Coral' },
    { value: 'from-orange-500 to-red-500',    label: 'Peach' },
    { value: 'from-green-500 to-teal-500',    label: 'Mint' },
    { value: 'from-cyan-500 to-blue-500',     label: 'Cream' },
    { value: 'from-violet-600 to-blue-600',   label: 'Blush' },
  ];
  const [selectedGradient, setSelectedGradient] = useState(gradients[0].value);
  const coverAspect = coverImageSize.width && coverImageSize.height
    ? coverImageSize.width / coverImageSize.height
    : 1;
  const frameAspect = coverFrameSize.width && coverFrameSize.height
    ? coverFrameSize.width / coverFrameSize.height
    : 1;
  const minCoverZoom = 100;
  const effectiveCoverZoom = coverImage ? Math.max(coverZoom, minCoverZoom) : coverZoom;
  const coverImageOverflowsX = coverAspect > frameAspect;
  const coverImageOverflowsY = coverAspect < frameAspect;
  const renderedCoverWidth = coverImageOverflowsX
    ? coverFrameSize.height * coverAspect * (effectiveCoverZoom / 100)
    : coverFrameSize.width * (effectiveCoverZoom / 100);
  const renderedCoverHeight = coverImageOverflowsY
    ? (coverFrameSize.width / coverAspect) * (effectiveCoverZoom / 100)
    : coverFrameSize.height * (effectiveCoverZoom / 100);
  const canMoveCoverX = Boolean(coverImage && renderedCoverWidth > coverFrameSize.width + 1);
  const canMoveCoverY = Boolean(coverImage && renderedCoverHeight > coverFrameSize.height + 1);
  const effectiveCoverPositionX = canMoveCoverX ? coverPositionX : 50;
  const effectiveCoverPositionY = canMoveCoverY ? coverPositionY : 50;
  const maxCoverZoom = Math.max(200, minCoverZoom + 100);
  const coverPreview = {
    imageGradient: selectedGradient,
    coverImage,
    coverPositionX: effectiveCoverPositionX,
    coverPositionY: effectiveCoverPositionY,
    coverZoom: effectiveCoverZoom,
  };

  useEffect(() => {
    const frame = coverPreviewRef.current;
    if (!frame) return undefined;

    const updateFrameSize = () => {
      setCoverFrameSize({ width: frame.clientWidth, height: frame.clientHeight });
    };
    updateFrameSize();

    const observer = new ResizeObserver(updateFrameSize);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [coverImage]);

  return (
    <DashboardLayout title="Create New Event" subtitle="Fill in the details and submit it for admin review">
      <div className="max-w-3xl mx-auto">
        {/* Step Indicator */}
        <div className="flex items-center gap-3 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-3">
              <button
                onClick={() => setStep(s)}
                className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                  s === step ? 'bg-primary-500 text-white shadow-lvl1' :
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
                    {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
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
                      className={`w-12 h-8 rounded-lg event-cover transition-all ${selectedGradient === g.value ? 'scale-110' : 'hover:scale-105'}`}
                      style={{
                        ...getEventArtStyle(g.value),
                        outline: selectedGradient === g.value ? '3px solid var(--clr-coral)' : 'none',
                        outlineOffset: '3px',
                      }}
                      title={g.label}
                    />
                  ))}
                </div>
              </div>

              <div className="cover-upload-panel">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <label className="block text-xs font-semibold" style={{ color: 'var(--clr-muted)' }}>Custom Cover Image</label>
                    <p className="text-xs mt-1" style={{ color: 'var(--clr-muted)' }}>Upload a JPG, PNG, WEBP, or GIF and adjust the crop for event cards and detail pages.</p>
                  </div>
                  <label className="btn-secondary px-4 py-2 text-xs cursor-pointer">
                    <span className="material-symbols-rounded text-base">upload</span>
                    Upload Image
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={handleCoverUpload} />
                  </label>
                </div>

                {coverImage && (
                  <div className="mt-4 space-y-4">
                    <div
                      ref={coverPreviewRef}
                      className="cover-crop-preview has-custom-cover"
                      style={getEventCoverStyle(coverPreview)}
                    >
                      <EventCoverMedia event={coverPreview} />
                      <span className="badge badge-blue">{categories.find(c => c.id === form.category)?.label || form.category}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label className="cover-range">
                        <span>Horizontal</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={effectiveCoverPositionX}
                          disabled={!canMoveCoverX}
                          onChange={e => canMoveCoverX && setCoverPositionX(Number(e.target.value))}
                        />
                      </label>
                      <label className="cover-range">
                        <span>Vertical</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={effectiveCoverPositionY}
                          disabled={!canMoveCoverY}
                          onChange={e => canMoveCoverY && setCoverPositionY(Number(e.target.value))}
                        />
                      </label>
                      <label className="cover-range">
                        <span>Zoom</span>
                        <input type="range" min={minCoverZoom} max={maxCoverZoom} value={effectiveCoverZoom} onChange={e => setCoverZoom(Number(e.target.value))} />
                      </label>
                    </div>

                    <button
                      type="button"
                      className="btn-ghost px-4 py-2 text-xs"
                      onClick={() => {
                        setCoverImage('');
                        setCoverImageSize({ width: 0, height: 0 });
                        setCoverFrameSize({ width: 0, height: 0 });
                      }}
                    >
                      <span className="material-symbols-rounded text-base">hide_image</span>
                      Use flat cover style
                    </button>
                  </div>
                )}
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
                  <div
                    className={`h-32 event-preview-cover flex items-end p-4 ${hasCustomCover(coverPreview) ? 'has-custom-cover' : ''}`}
                    style={getEventCoverStyle(coverPreview)}
                  >
                    <EventCoverMedia event={coverPreview} />
                    <span className="badge badge-blue">{categories.find(c => c.id === form.category)?.label || form.category}</span>
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

              <div className="p-4 rounded-card border text-sm font-semibold" style={{ background: 'var(--clr-yellow)', borderColor: 'var(--clr-border)', color: 'var(--clr-primary)' }}>
                Organizer events are sent to the admin review queue first. Students can register only after approval.
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
                      Submitting...
                    </span>
                  ) : (
                    <><span className="material-symbols-rounded text-base">approval</span> Submit for Review</>
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
