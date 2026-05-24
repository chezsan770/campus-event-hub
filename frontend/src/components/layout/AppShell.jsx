import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';

export default function AppShell({ children }) {
  const { user } = useAuth();

  if (!user) return children;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--clr-bg)' }}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto animate-fade-in">
        {children}
      </main>
    </div>
  );
}
