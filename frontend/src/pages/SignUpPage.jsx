import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEPARTMENTS } from '../utils/constants';
import {
  Scale,
  ArrowLeft,
  Eye,
  EyeOff,
  User,
  Mail,
  Building2,
  Lock,
  AlertCircle,
  ArrowRight,
  Gavel,
  Shield,
  FileText,
  Check,
  X,
} from 'lucide-react';

/* ── Password strength helper ── */
function getPasswordStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
  if (score <= 2) return { score: 2, label: 'Fair', color: 'bg-orange-500' };
  if (score <= 3) return { score: 3, label: 'Good', color: 'bg-amber-500' };
  if (score <= 4) return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
  return { score: 5, label: 'Excellent', color: 'bg-green-500' };
}

export default function SignUpPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!form.department) {
      setError('Please select a department.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        department: form.department,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(form.password);
  const passwordChecks = [
    { label: 'At least 8 characters', met: form.password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(form.password) },
    { label: 'Contains a number', met: /[0-9]/.test(form.password) },
  ];

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
            Join government departments across India ensuring court order compliance
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
        {/* Subtle orb */}
        <div className="pointer-events-none absolute -top-20 right-0 h-[300px] w-[300px] rounded-full bg-navy/5 blur-3xl dark:bg-navy/15" />

        <div className="relative w-full max-w-md">
          {/* Back to Home */}
          <div className="mb-6">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition-all hover:bg-slate-100 hover:text-navy dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
              Back to Home
            </Link>
          </div>

          {/* Mobile branding */}
          <div className="mb-6 text-center lg:hidden">
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
              Create your account
            </p>
          </div>

          {/* Glassmorphism form card */}
          <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-8 shadow-2xl backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-800/60 sm:p-10">
            <div className="mb-6">
              <h2
                className="text-2xl font-bold text-slate-900 dark:text-white"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Create Account
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Get started with NyayaSetu in minutes
              </p>
            </div>

            {/* Error display */}
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200/80 bg-red-50/80 px-4 py-3.5 backdrop-blur-sm dark:border-red-800/50 dark:bg-red-900/20">
                <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500 dark:text-red-400" />
                <p className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* ── Personal Info Section ── */}
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Personal Information
                </p>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <div className="group relative">
                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-navy dark:group-focus-within:text-blue-400">
                      <User size={18} />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      className="block w-full rounded-xl border border-slate-300/80 bg-white/50 py-3 pl-12 pr-4 text-sm text-slate-900 shadow-sm backdrop-blur-sm transition-all placeholder:text-slate-400 focus:border-navy focus:bg-white focus:shadow-md focus:ring-2 focus:ring-navy/20 focus:outline-none dark:border-slate-600/80 dark:bg-slate-700/50 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:bg-slate-700 dark:focus:ring-blue-400/20"
                      placeholder="Rajesh Sharma"
                    />
                  </div>
                </div>

                {/* Email */}
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
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      className="block w-full rounded-xl border border-slate-300/80 bg-white/50 py-3 pl-12 pr-4 text-sm text-slate-900 shadow-sm backdrop-blur-sm transition-all placeholder:text-slate-400 focus:border-navy focus:bg-white focus:shadow-md focus:ring-2 focus:ring-navy/20 focus:outline-none dark:border-slate-600/80 dark:bg-slate-700/50 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:bg-slate-700 dark:focus:ring-blue-400/20"
                      placeholder="you@department.gov.in"
                    />
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label htmlFor="department" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Department
                  </label>
                  <div className="group relative">
                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-navy dark:group-focus-within:text-blue-400">
                      <Building2 size={18} />
                    </div>
                    <select
                      id="department"
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                      className="block w-full appearance-none rounded-xl border border-slate-300/80 bg-white/50 py-3 pl-12 pr-10 text-sm text-slate-900 shadow-sm backdrop-blur-sm transition-all focus:border-navy focus:bg-white focus:shadow-md focus:ring-2 focus:ring-navy/20 focus:outline-none dark:border-slate-600/80 dark:bg-slate-700/50 dark:text-slate-200 dark:focus:border-blue-400 dark:focus:bg-slate-700 dark:focus:ring-blue-400/20"
                    >
                      <option value="">Select department...</option>
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    {/* Custom dropdown arrow */}
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Security Section ── */}
              <div className="space-y-4 pt-2">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Security
                </p>

                {/* Password */}
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
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={form.password}
                      onChange={handleChange}
                      className="block w-full rounded-xl border border-slate-300/80 bg-white/50 py-3 pl-12 pr-12 text-sm text-slate-900 shadow-sm backdrop-blur-sm transition-all placeholder:text-slate-400 focus:border-navy focus:bg-white focus:shadow-md focus:ring-2 focus:ring-navy/20 focus:outline-none dark:border-slate-600/80 dark:bg-slate-700/50 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:bg-slate-700 dark:focus:ring-blue-400/20"
                      placeholder="Min. 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Password strength indicator */}
                  {form.password && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-1.5 flex-1 gap-1 overflow-hidden rounded-full">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-full flex-1 rounded-full transition-all duration-300 ${
                                level <= strength.score
                                  ? strength.color
                                  : 'bg-slate-200 dark:bg-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className={`text-xs font-semibold ${
                          strength.score <= 1 ? 'text-red-500' :
                          strength.score <= 2 ? 'text-orange-500' :
                          strength.score <= 3 ? 'text-amber-500' :
                          'text-emerald-500'
                        }`}>
                          {strength.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {passwordChecks.map((check) => (
                          <div key={check.label} className="flex items-center gap-1.5">
                            {check.met ? (
                              <Check size={12} className="text-emerald-500" />
                            ) : (
                              <X size={12} className="text-slate-400" />
                            )}
                            <span className={`text-xs ${check.met ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                              {check.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Confirm Password
                  </label>
                  <div className="group relative">
                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-navy dark:group-focus-within:text-blue-400">
                      <Lock size={18} />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      required
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className={`block w-full rounded-xl border bg-white/50 py-3 pl-12 pr-12 text-sm text-slate-900 shadow-sm backdrop-blur-sm transition-all placeholder:text-slate-400 focus:bg-white focus:shadow-md focus:outline-none dark:bg-slate-700/50 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:bg-slate-700 ${
                        form.confirmPassword && form.confirmPassword !== form.password
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-600'
                          : form.confirmPassword && form.confirmPassword === form.password
                          ? 'border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-emerald-600'
                          : 'border-slate-300/80 focus:border-navy focus:ring-2 focus:ring-navy/20 dark:border-slate-600/80 dark:focus:border-blue-400 dark:focus:ring-blue-400/20'
                      }`}
                      placeholder="Re-enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((s) => !s)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {form.confirmPassword && form.confirmPassword !== form.password && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
                      <X size={12} />
                      Passwords do not match
                    </p>
                  )}
                  {form.confirmPassword && form.confirmPassword === form.password && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-500">
                      <Check size={12} />
                      Passwords match
                    </p>
                  )}
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="group relative mt-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-navy to-navy-light px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-navy/25 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-navy/30 focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2 disabled:opacity-60 disabled:hover:scale-100"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative">
                  {loading ? 'Creating account...' : 'Create Account'}
                </span>
                {!loading && <ArrowRight size={16} className="relative transition-transform group-hover:translate-x-1" />}
              </button>
            </form>

            {/* Sign in link */}
            <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-navy transition-colors hover:text-navy-light dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
