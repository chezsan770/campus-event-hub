import Sidebar from './Sidebar';

export default function DashboardLayout({ children, title, subtitle, actions }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--clr-bg)' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Bar */}
        <header
          className="flex items-center justify-between px-6 h-16 shrink-0 border-b"
          style={{ background: 'var(--clr-surface)', borderColor: 'var(--clr-border)' }}
        >
          <div>
            <h1 className="text-headline-sm font-bold" style={{ color: 'var(--clr-text)' }}>{title}</h1>
            {subtitle && <p className="text-xs" style={{ color: 'var(--clr-muted)' }}>{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            {actions}
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
