import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scale, ArrowLeft, Mail, Lock, AlertCircle, ArrowRight, Gavel, Shield, FileText } from 'lucide-react';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-bg-dark" style={{ fontFamily: 'var(--font-body)' }}>

      {/* ── Left branding panel ── */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-navy via-navy-dark to-navy-light lg:flex lg:flex-col lg:items-center lg:justify-center">
        {/* Decorative gradient orbs */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-500/15 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/8 blur-3xl" />

        {/* Floating decorative icons */}
        <div className="pointer-events-none absolute top-16 left-16 anim-float">
          <div className="rounded-2xl bg-white/10 p-4 shadow-xl backdrop-blur-sm">
            <Gavel size={28} className="text-accent" />
          </div>
        </div>
        <div className="pointer-events-none absolute top-24 right-20 anim-float" style={{ animationDelay: '1s' }}>
          <div className="rounded-2xl bg-white/10 p-4 shadow-xl backdrop-blur-sm">
            <Shield size={28} className="text-blue-300" />
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-20 left-24 anim-float" style={{ animationDelay: '2s' }}>
          <div className="rounded-2xl bg-white/10 p-4 shadow-xl backdrop-blur-sm">
            <FileText size={28} className="text-emerald-300" />
          </div>
        </div>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="pointer-events-none absolute rounded-full bg-accent/20"
            style={{
              width: `${6 + i * 4}px`,
              height: `${6 + i * 4}px`,
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animation: `float ${3 + i * 0.7}s ease-in-out ${i * 0.3}s infinite`,
            }}
          />
        ))}

        {/* Branding content */}
        <div className="relative z-10 px-12 text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 shadow-2xl backdrop-blur-sm">
            <Scale size={40} className="text-accent anim-glow" />
          </div>
          <h1
            className="text-4xl font-extrabold tracking-tight text-white xl:text-5xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <span>Nyaya</span>
            <span className="text-accent">Setu</span>
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-lg leading-relaxed text-slate-300">
            AI-Powered Court Order Compliance Tracking for Indian Government Departments
          </p>

          {/* Feature highlights */}
          <div className="mt-12 space-y-4">
            {[
              'Smart PDF Extraction with NLP',
              'Deadline Intelligence & Alerts',
              'Full Audit Trail & Compliance',
            ].map((text, i) => (
              <div
                key={text}
                className="flex items-center gap-3 rounded-xl bg-white/5 px-5 py-3 backdrop-blur-sm transition-all hover:bg-white/10"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/20">
                  <ArrowRight size={14} className="text-accent" />
                </div>
                <span className="text-sm font-medium text-slate-200">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="relative flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        {/* Subtle orb for light mode */}
        <div className="pointer-events-none absolute -top-20 right-0 h-[300px] w-[300px] rounded-full bg-navy/5 blur-3xl dark:bg-navy/15" />

        <div className="relative w-full max-w-md">
          {/* Back to Home */}
          <div className="mb-8">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition-all hover:bg-slate-100 hover:text-navy dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
              Back to Home
            </Link>
          </div>

          {/* Mobile branding (visible only on small screens) */}
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-navy to-navy-light text-white shadow-lg shadow-navy/25">
              <Scale size={32} className="anim-glow" />
            </div>
            <h1
              className="text-2xl font-extrabold tracking-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <span className="text-navy dark:text-white">Nyaya</span>
              <span className="text-accent">Setu</span>
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Court Order Compliance Tracker
            </p>
          </div>

          {/* Glassmorphism form card */}
          <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-8 shadow-2xl backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-800/60 sm:p-10">
            <div className="mb-8">
              <h2
                className="text-2xl font-bold text-slate-900 dark:text-white"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Welcome back
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Sign in to your account to continue
              </p>
            </div>

            {/* Error display */}
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200/80 bg-red-50/80 px-4 py-3.5 backdrop-blur-sm dark:border-red-800/50 dark:bg-red-900/20">
                <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500 dark:text-red-400" />
                <p className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email field */}
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="group relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-navy dark:group-focus-within:text-blue-400">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border border-slate-300/80 bg-white/50 py-3 pl-12 pr-4 text-sm text-slate-900 shadow-sm backdrop-blur-sm transition-all placeholder:text-slate-400 focus:border-navy focus:bg-white focus:shadow-md focus:ring-2 focus:ring-navy/20 focus:outline-none dark:border-slate-600/80 dark:bg-slate-700/50 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:bg-slate-700 dark:focus:ring-blue-400/20"
                    placeholder="you@department.gov.in"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="group relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-navy dark:group-focus-within:text-blue-400">
                    <Lock size={18} />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border border-slate-300/80 bg-white/50 py-3 pl-12 pr-4 text-sm text-slate-900 shadow-sm backdrop-blur-sm transition-all placeholder:text-slate-400 focus:border-navy focus:bg-white focus:shadow-md focus:ring-2 focus:ring-navy/20 focus:outline-none dark:border-slate-600/80 dark:bg-slate-700/50 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:bg-slate-700 dark:focus:ring-blue-400/20"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-navy to-navy-light px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-navy/25 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-navy/30 focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2 disabled:opacity-60 disabled:hover:scale-100"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative">
                  {loading ? 'Signing in...' : 'Sign In'}
                </span>
                {!loading && <ArrowRight size={16} className="relative transition-transform group-hover:translate-x-1" />}
              </button>
            </form>

            {/* Sign up link */}
            <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
              Don&apos;t have an account?{' '}
              <Link
                to="/signup"
                className="font-semibold text-navy transition-colors hover:text-navy-light dark:text-blue-400 dark:hover:text-blue-300"
              >
                Create Account
              </Link>
            </p>
          </div>

          {/* Test credentials hint */}
          <div className="mt-6 rounded-xl border border-slate-200/60 bg-white/40 px-5 py-4 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/30">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Demo Credentials
            </p>
            <div className="mt-2 space-y-1">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                <span className="font-medium text-slate-600 dark:text-slate-300">Admin:</span>{' '}
                admin@nyayasetu.gov.in / admin12345
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                <span className="font-medium text-slate-600 dark:text-slate-300">Officer:</span>{' '}
                sharma@environment.gov.in / officer12345
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
