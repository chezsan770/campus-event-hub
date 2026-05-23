import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Download, ArrowLeft, CheckCircle, Share2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { ticketService } from '../api/ticketService';

const STATUS_CONFIG = {
  VALID: { label: 'Valid',   color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/30',  icon: 'check_circle' },
  USED:  { label: 'Used',   color: 'text-slate-400',   bg: 'bg-slate-500/10',  border: 'border-slate-500/30',  icon: 'task_alt' },
  VOID:  { label: 'Voided', color: 'text-red-400',     bg: 'bg-red-500/10',    border: 'border-red-500/30',    icon: 'cancel' },
};

export default function QRTicketPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    ticketService.getTicketById(id)
      .then(setTicket)
      .catch(() => setError('Ticket not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--clr-bg)' }}>
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--clr-bg)' }}>
        <div className="text-center">
          <span className="material-symbols-rounded text-6xl text-red-400/50 block mb-4">error</span>
          <h2 className="text-headline-sm font-bold mb-2" style={{ color: 'var(--clr-text)' }}>Ticket Not Found</h2>
          <Link to="/my-tickets" className="btn-primary mt-4">← My Tickets</Link>
        </div>
      </div>
    );
  }

  const status = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.VALID;

  return (
    <div className="min-h-screen" style={{ background: 'var(--clr-bg)' }}>
      <Navbar />

      <div className="max-w-md mx-auto px-4 pt-20 pb-12">
        <Link to="/my-tickets" className="inline-flex items-center gap-2 mt-4 mb-6 text-sm hover:text-primary-400 transition-colors" style={{ color: 'var(--clr-muted)' }}>
          <ArrowLeft size={16} /> My Tickets
        </Link>

        {/* Ticket Card */}
        <div className="animate-slide-up">
          {/* Top ribbon */}
          <div className="h-2 rounded-t-hero bg-gradient-primary" />

          {/* Main ticket body */}
          <div className="border border-t-0 rounded-b-hero overflow-hidden" style={{ background: 'var(--clr-surface)', borderColor: 'var(--clr-border)' }}>
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--clr-border)' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="brand-mark w-6 h-6 rounded bg-gradient-primary flex items-center justify-center">
                    <span className="material-symbols-rounded text-white text-xs">event</span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: 'var(--clr-muted)' }}>CAMPUS EVENT HUB</span>
                </div>
                <span className={`badge border ${status.color} ${status.bg} ${status.border}`}>
                  <span className="material-symbols-rounded text-xs">{status.icon}</span>
                  {status.label}
                </span>
              </div>
              <h1 className="text-lg font-black leading-tight" style={{ color: 'var(--clr-text)' }}>
                {ticket.eventTitle}
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--clr-muted)' }}>
                {new Date(ticket.eventDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            {/* Details Grid */}
            <div className="px-6 py-4 grid grid-cols-2 gap-4 border-b" style={{ borderColor: 'var(--clr-border)' }}>
              {[
                { label: 'TIME',     value: ticket.eventTime },
                { label: 'LOCATION', value: ticket.location },
                { label: 'HOLDER',   value: ticket.holderName },
                { label: 'SEAT',     value: ticket.seatInfo },
              ].map(d => (
                <div key={d.label}>
                  <p className="text-xs font-bold tracking-widest mb-0.5" style={{ color: 'var(--clr-muted)' }}>{d.label}</p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--clr-text)' }}>{d.value}</p>
                </div>
              ))}
            </div>

            {/* Dashed Tear Line */}
            <div className="flex items-center px-4 py-1">
              <div className="flex-1 border-t border-dashed" style={{ borderColor: 'var(--clr-border)' }} />
              <div className="flex gap-1 mx-2">
                <div className="w-3 h-3 rounded-full" style={{ background: 'var(--clr-bg)' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: 'var(--clr-bg)' }} />
              </div>
              <div className="flex-1 border-t border-dashed" style={{ borderColor: 'var(--clr-border)' }} />
            </div>

            {/* QR Code Section */}
            <div className="px-6 pb-6 pt-2 flex flex-col items-center">
              <p className="text-xs font-semibold mb-4 tracking-widest" style={{ color: 'var(--clr-muted)' }}>SCAN FOR ENTRY</p>

              {/* QR Ring */}
              <div className="qr-ring mb-4">
                <div className="rounded-2xl overflow-hidden p-4 flex items-center justify-center"
                  style={{ background: ticket.status === 'USED' ? '#1a1a2e' : '#ffffff' }}>
                  <QRCodeSVG
                    value={ticket.qrData}
                    size={160}
                    bgColor={ticket.status === 'USED' ? '#1a1a2e' : '#ffffff'}
                    fgColor={ticket.status === 'USED' ? '#475569' : '#0D0F1A'}
                    level="H"
                    includeMargin={false}
                  />
                </div>
              </div>

              {ticket.status === 'USED' && (
                <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold mb-4">
                  <CheckCircle size={16} /> Ticket already scanned
                </div>
              )}

              <p className="text-xs font-mono tracking-widest" style={{ color: 'var(--clr-muted)' }}>
                {ticket.id}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <button className="btn-primary flex-1 justify-center py-3">
              <Download size={16} /> Download
            </button>
            <button className="btn-secondary flex-1 justify-center py-3">
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
