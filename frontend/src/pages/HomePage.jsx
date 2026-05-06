import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Scale,
  FileText,
  Bell,
  BarChart3,
  Shield,
  Clock,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  Users,
  Building2,
  Gavel,
  Sun,
  Moon,
} from 'lucide-react';

function useOnScreen(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

function AnimatedSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const visible = useOnScreen(ref);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function CountUp({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const visible = useOnScreen(ref);
  useEffect(() => {
    if (!visible) return;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(current);
    }, 30);
    return () => clearInterval(timer);
  }, [visible, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

const features = [
  {
    icon: FileText,
    title: 'PDF Extraction',
    desc: 'Automatically extract directives, deadlines, and named entities from court judgment PDFs using NLP.',
  },
  {
    icon: Clock,
    title: 'Deadline Tracking',
    desc: 'Never miss a compliance deadline with smart calendar views and automated reminders.',
  },
  {
    icon: Bell,
    title: 'Smart Alerts',
    desc: 'Escalation-based notifications alert officers and department heads before deadlines lapse.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    desc: 'Real-time charts and reports to track compliance rates across departments.',
  },
  {
    icon: Shield,
    title: 'Audit Trail',
    desc: 'Full audit logging of every action for transparency and accountability.',
  },
  {
    icon: Users,
    title: 'Role-Based Access',
    desc: 'Granular permissions for admins, department heads, and officers.',
  },
];

const stats = [
  { value: 500, suffix: '+', label: 'Court Orders Tracked' },
  { value: 98, suffix: '%', label: 'Compliance Rate' },
  { value: 12, suffix: '', label: 'Departments Served' },
  { value: 2000, suffix: '+', label: 'Directives Processed' },
];

const steps = [
  { num: '01', title: 'Upload Judgment', desc: 'Upload court order PDFs to the platform.' },
  { num: '02', title: 'AI Extraction', desc: 'NLP engine extracts directives, deadlines, and entities.' },
  { num: '03', title: 'Track & Comply', desc: 'Assign tasks, set reminders, and track compliance.' },
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setDark((d) => !d);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-bg-dark dark:text-slate-200">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-white">
              <Scale size={20} />
            </div>
            <span className="text-xl font-bold text-navy dark:text-blue-400">NyayaSetu</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
            >
              {dark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="rounded-lg bg-navy px-5 py-2.5 text-sm font-medium text-white shadow-md hover:bg-navy-light transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg px-5 py-2.5 text-sm font-medium text-navy hover:bg-slate-100 dark:text-blue-400 dark:hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg bg-navy px-5 py-2.5 text-sm font-medium text-white shadow-md hover:bg-navy-light transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-6 py-24 lg:py-36">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-navy/5 via-transparent to-accent/5 dark:from-navy/20 dark:to-accent/10" />
        <div className="mx-auto max-w-4xl text-center">
          <AnimatedSection>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-navy/10 px-4 py-2 text-sm font-medium text-navy dark:bg-navy-light/20 dark:text-blue-300">
              <Gavel size={16} />
              AI-Powered Court Compliance
            </div>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Track Court Order{' '}
              <span className="text-navy dark:text-blue-400">Compliance</span>{' '}
              with Intelligence
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              NyayaSetu helps Indian government departments extract directives from court judgments,
              track deadlines, and ensure timely compliance — powered by NLP and smart automation.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={300}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to={isAuthenticated ? '/dashboard' : '/signup'}
                className="group flex items-center gap-2 rounded-xl bg-navy px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-navy-light hover:shadow-xl transition-all"
              >
                {isAuthenticated ? 'Open Dashboard' : 'Start Tracking'}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#features"
                className="flex items-center gap-2 rounded-xl border border-slate-300 px-8 py-3.5 text-base font-semibold text-slate-700 hover:border-navy hover:text-navy dark:border-slate-600 dark:text-slate-300 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-colors"
              >
                Learn More
                <ChevronDown size={18} />
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-slate-200 bg-white py-16 dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
          {stats.map((s, i) => (
            <AnimatedSection key={s.label} delay={i * 100} className="text-center">
              <div className="text-3xl font-extrabold text-navy dark:text-blue-400 lg:text-4xl">
                <CountUp target={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">{s.label}</div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <AnimatedSection className="mb-16 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Everything You Need for{' '}
              <span className="text-navy dark:text-blue-400">Compliance</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
              A comprehensive platform designed specifically for tracking and managing court order compliance.
            </p>
          </AnimatedSection>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <AnimatedSection key={f.title} delay={i * 100}>
                <div className="group h-full rounded-xl border border-slate-200 bg-white p-8 shadow-sm hover:border-navy/30 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500/30 transition-all">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-navy/10 text-navy dark:bg-blue-500/10 dark:text-blue-400 group-hover:bg-navy group-hover:text-white dark:group-hover:bg-blue-600 transition-colors">
                    <f.icon size={24} />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{f.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="border-y border-slate-200 bg-white px-6 py-24 dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl">
          <AnimatedSection className="mb-16 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              How It <span className="text-navy dark:text-blue-400">Works</span>
            </h2>
          </AnimatedSection>
          <div className="grid gap-12 md:grid-cols-3">
            {steps.map((s, i) => (
              <AnimatedSection key={s.num} delay={i * 150} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy text-xl font-bold text-white shadow-lg">
                  {s.num}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{s.desc}</p>
                {i < steps.length - 1 && (
                  <ArrowRight size={20} className="mx-auto mt-4 hidden text-accent md:block" />
                )}
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-24">
        <AnimatedSection>
          <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-br from-navy to-navy-dark p-12 text-center shadow-2xl">
            <Building2 size={40} className="mx-auto mb-6 text-accent" />
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to Ensure Compliance?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">
              Join government departments across India using NyayaSetu to stay on top of court order directives.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to={isAuthenticated ? '/dashboard' : '/signup'}
                className="group flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-base font-semibold text-navy-dark shadow-lg hover:bg-yellow-400 transition-colors"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Create Account'}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-white/30 px-8 py-3.5 text-base font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 bg-white px-6 py-10 dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Scale size={16} className="text-navy dark:text-blue-400" />
            NyayaSetu — AI-Powered Court Order Compliance
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
            <a href="#features" className="hover:text-navy dark:hover:text-blue-400 transition-colors">Features</a>
            <Link to="/login" className="hover:text-navy dark:hover:text-blue-400 transition-colors">Sign In</Link>
            <Link to="/signup" className="hover:text-navy dark:hover:text-blue-400 transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
