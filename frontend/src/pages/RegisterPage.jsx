import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  { value: 'STUDENT',   label: 'Student',   icon: 'school',       desc: 'Discover and attend events' },
  { value: 'ORGANIZER', label: 'Organizer', icon: 'manage_accounts', desc: 'Create and manage events' },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'STUDENT', department: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      await register(form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--clr-bg)' }}>
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-rounded text-green-400 text-4xl">check_circle</span>
          </div>
          <h2 className="text-headline-md font-bold mb-2" style={{ color: 'var(--clr-text)' }}>Registration Successful!</h2>
          <p className="text-sm" style={{ color: 'var(--clr-muted)' }}>Redirecting you to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'var(--clr-bg)' }}>
      <div className="w-full max-w-lg animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="material-symbols-rounded text-white text-sm">event</span>
            </div>
            <span className="font-bold" style={{ color: 'var(--clr-text)' }}>Campus<span className="text-primary-500">Event</span>Hub</span>
          </Link>
          <h1 className="text-headline-md font-bold mb-1" style={{ color: 'var(--clr-text)' }}>Create your account</h1>
          <p className="text-body-sm" style={{ color: 'var(--clr-muted)' }}>Join thousands of students on campus</p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {ROLES.map(r => (
            <button
              key={r.value}
              type="button"
              onClick={() => setForm(f => ({ ...f, role: r.value }))}
              className={`p-4 rounded-card border text-left transition-all duration-150 ${
                form.role === r.value
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'hover:border-white/20'
              }`}
              style={{ borderColor: form.role === r.value ? undefined : 'var(--clr-border)' }}
            >
              <span className={`material-symbols-rounded text-xl mb-1 block ${form.role === r.value ? 'text-primary-400' : ''}`}
                style={{ color: form.role === r.value ? undefined : 'var(--clr-muted)' }}>
                {r.icon}
              </span>
              <p className={`text-sm font-semibold ${form.role === r.value ? 'text-primary-400' : ''}`}
                style={{ color: form.role === r.value ? undefined : 'var(--clr-text)' }}>
                {r.label}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--clr-muted)' }}>{r.desc}</p>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold" style={{ color: 'var(--clr-muted)' }}>Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--clr-muted)' }} />
              <input name="name" value={form.name} onChange={handleChange} type="text" placeholder="John Doe" className="input-field pl-10" required />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold" style={{ color: 'var(--clr-muted)' }}>Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--clr-muted)' }} />
              <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="you@campus.edu" className="input-field pl-10" required />
            </div>
          </div>

          {/* Department */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold" style={{ color: 'var(--clr-muted)' }}>Department / Club</label>
            <div className="relative">
              <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--clr-muted)' }} />
              <input name="department" value={form.department} onChange={handleChange} type="text" placeholder="e.g. Computer Science" className="input-field pl-10" />
            </div>
          </div>

          {/* Password */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold" style={{ color: 'var(--clr-muted)' }}>Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--clr-muted)' }} />
                <input name="password" value={form.password} onChange={handleChange}
                  type={showPass ? 'text' : 'password'} placeholder="8+ characters" className="input-field pl-10 pr-8" required minLength={8} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--clr-muted)' }}>
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold" style={{ color: 'var(--clr-muted)' }}>Confirm</label>
              <input name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                type={showPass ? 'text' : 'password'} placeholder="Re-enter" className="input-field" required />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">{error}</div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-sm text-center mt-6" style={{ color: 'var(--clr-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 font-semibold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
