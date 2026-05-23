import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';

export default function LoginPage() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const routeUser = (user) => {
    if (user.role === 'ADMIN') navigate('/dashboard/admin');
    else if (user.role === 'ORGANIZER') navigate('/dashboard/organizer');
    else navigate('/dashboard/student');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form);
      routeUser(user);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredential = async (credential) => {
    setError('');
    setLoading(true);
    try {
      const user = await googleLogin(credential);
      routeUser(user);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Google login failed. Please create an account first.');
    } finally {
      setLoading(false);
    }
  };

  // Demo credentials hint
  const DEMO = [
    { label: 'Student',   email: 'alex@campus.edu',  role: 'STUDENT' },
    { label: 'Organizer', email: 'sarah@campus.edu', role: 'ORGANIZER' },
    { label: 'Admin',     email: 'admin@campus.edu', role: 'ADMIN' },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--clr-bg)' }}>
      {/* Left – Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12"
        style={{ background: 'var(--clr-yellow)', borderRight: '4px solid var(--clr-border)' }}>
        <div className="absolute inset-0 hero-bg opacity-40" />
        <div className="relative z-10 text-center max-w-md">
          <div className="brand-mark w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 shadow-lvl1 animate-float">
            <span className="material-symbols-rounded text-white text-3xl">event</span>
          </div>
          <h2 className="text-3xl font-black mb-4" style={{ color: 'var(--clr-text)' }}>Campus Event Hub</h2>
          <p className="text-body-md" style={{ color: 'var(--clr-muted)' }}>
            Discover events, manage tickets, and connect with your campus community — all in one place.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-3 text-left">
            {['QR Ticketing', 'Smart Analytics', 'Easy Check-in', 'Role-based Access'].map(f => (
              <div key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--clr-muted)' }}>
                <span className="w-5 h-5 rounded-full bg-primary-500/20 flex items-center justify-center">
                  <span className="material-symbols-rounded text-primary-400 text-xs">check</span>
                </span>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right – Form Panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="brand-mark w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="material-symbols-rounded text-white text-sm">event</span>
            </div>
            <span className="font-bold" style={{ color: 'var(--clr-text)' }}>Campus<span className="text-primary-500">Event</span>Hub</span>
          </div>

          <h1 className="text-headline-md font-bold mb-1" style={{ color: 'var(--clr-text)' }}>Welcome back</h1>
          <p className="text-body-sm mb-8" style={{ color: 'var(--clr-muted)' }}>Sign in to manage your events and tickets.</p>

          <div className="mb-5">
            <GoogleAuthButton label="signin_with" onCredential={handleGoogleCredential} disabled={loading} />
          </div>

          <div className="flex items-center gap-3 mb-5">
            <span className="h-0.5 flex-1" style={{ background: 'var(--clr-border)' }} />
            <span className="text-xs font-black uppercase" style={{ color: 'var(--clr-muted)' }}>or</span>
            <span className="h-0.5 flex-1" style={{ background: 'var(--clr-border)' }} />
          </div>

          {/* Demo credentials */}
          <div className="mb-6 p-3 rounded-lg border" style={{ background: 'var(--clr-surface-cont)', borderColor: 'var(--clr-border)' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--clr-muted)' }}>Demo credentials (password: <code className="text-primary-400">password123</code>):</p>
            <div className="flex flex-wrap gap-2">
              {DEMO.map(d => (
                <button
                  key={d.role}
                  onClick={() => setForm({ email: d.email, password: 'password123' })}
                  className="badge-blue badge cursor-pointer hover:bg-blue-500/25 transition-colors text-xs"
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold" style={{ color: 'var(--clr-muted)' }}>Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--clr-muted)' }} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@campus.edu"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold" style={{ color: 'var(--clr-muted)' }}>Password</label>
                <button type="button" className="text-xs text-primary-400 hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--clr-muted)' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--clr-muted)' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-sm text-center mt-6" style={{ color: 'var(--clr-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 font-semibold hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
