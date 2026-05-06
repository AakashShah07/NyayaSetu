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
  ArrowRight,
  ChevronDown,
  Users,
  Building2,
  Gavel,
  Sun,
  Moon,
  Upload,
  Brain,
  ListChecks,
  Sparkles,
  Zap,
  TrendingUp,
} from 'lucide-react';

/* ── Intersection Observer hook ── */
function useOnScreen(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

/* ── Animated wrapper ── */
function Reveal({ children, className = '', delay = 0, direction = 'up' }) {
  const ref = useRef(null);
  const visible = useOnScreen(ref);
  const dirs = { up: 'translate-y-12', down: '-translate-y-12', left: 'translate-x-12', right: '-translate-x-12' };
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${dirs[direction]}`} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ── Animated counter ── */
function CountUp({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const visible = useOnScreen(ref);
  useEffect(() => {
    if (!visible) return;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 50));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(current);
    }, 25);
    return () => clearInterval(timer);
  }, [visible, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ── Floating particle dots ── */
function Particles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-accent/20 dark:bg-accent/10"
          style={{
            width: `${6 + i * 4}px`,
            height: `${6 + i * 4}px`,
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            animation: `float ${3 + i * 0.7}s ease-in-out ${i * 0.3}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Data ── */
const features = [
  { icon: FileText, title: 'Smart PDF Extraction', desc: 'AI-powered extraction of directives, deadlines, and named entities from court judgment PDFs using advanced NLP pipelines.', color: 'from-blue-500 to-cyan-500' },
  { icon: Clock, title: 'Deadline Intelligence', desc: 'Smart calendar views with auto-resolved deadlines, countdown alerts, and department-wise compliance timelines.', color: 'from-amber-500 to-orange-500' },
  { icon: Bell, title: 'Escalation Alerts', desc: 'Multi-tier notification system that escalates to department heads when officers miss compliance windows.', color: 'from-rose-500 to-pink-500' },
  { icon: BarChart3, title: 'Live Analytics', desc: 'Real-time dashboards tracking compliance rates, department performance, and trend analysis with exportable reports.', color: 'from-emerald-500 to-teal-500' },
  { icon: Shield, title: 'Full Audit Trail', desc: 'Tamper-proof logging of every action — uploads, status changes, assignments — for complete transparency.', color: 'from-violet-500 to-purple-500' },
  { icon: Users, title: 'Role-Based Access', desc: 'Granular permissions for admins, department heads, and field officers with department-scoped data isolation.', color: 'from-sky-500 to-indigo-500' },
];

const stats = [
  { value: 95, suffix: '%', label: 'Extraction Accuracy', icon: Brain },
  { value: 90, suffix: '%', label: 'Deadline Detection', icon: Clock },
  { value: 80, suffix: '%', label: 'Faster Compliance', icon: TrendingUp },
  { value: 99, suffix: '%', label: 'Uptime Reliability', icon: Zap },
];

const steps = [
  { num: '01', title: 'Upload Judgment', desc: 'Upload court order PDFs — scanned or digital. Our OCR handles both.', icon: Upload, color: 'from-blue-500 to-cyan-400' },
  { num: '02', title: 'AI Extraction', desc: 'NLP engine identifies directives, parties, deadlines, and legal sections automatically.', icon: Brain, color: 'from-accent to-yellow-400' },
  { num: '03', title: 'Track & Comply', desc: 'Assign tasks, set reminders, escalate alerts, and close out compliance — all in one place.', icon: ListChecks, color: 'from-emerald-500 to-green-400' },
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setDark((d) => !d);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-bg-dark" style={{ fontFamily: "var(--font-body)" }}>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-navy to-navy-light text-white shadow-lg shadow-navy/25 transition-transform group-hover:scale-105">
              <Scale size={20} className="anim-glow" />
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
              <span className="text-navy dark:text-white">Nyaya</span>
              <span className="text-accent">Setu</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all"
              aria-label="Toggle theme"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="rounded-xl bg-gradient-to-r from-navy to-navy-light px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-navy/25 hover:shadow-xl hover:shadow-navy/30 transition-all hover:scale-[1.02]"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors sm:block"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="rounded-xl bg-gradient-to-r from-navy to-navy-light px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-navy/25 hover:shadow-xl hover:shadow-navy/30 transition-all hover:scale-[1.02]"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-6 pt-20 pb-28 lg:pt-32 lg:pb-40">
        <Particles />
        {/* Gradient orbs */}
        <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-navy/8 blur-3xl dark:bg-navy/20" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-accent/8 blur-3xl dark:bg-accent/15" />

        <div className="relative mx-auto max-w-5xl text-center">
          <Reveal>
            <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-navy/15 bg-navy/5 px-5 py-2.5 text-sm font-semibold text-navy backdrop-blur-sm dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-300">
              <Sparkles size={16} className="anim-icon-bounce text-accent" />
              AI-Powered Court Compliance Platform
            </div>
          </Reveal>
          <Reveal delay={120}>
            <h1
              className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <span className="text-slate-900 dark:text-white">Track Court Order</span>
              <br />
              <span className="bg-gradient-to-r from-navy via-navy-light to-accent bg-clip-text text-transparent anim-gradient-shift">
                Compliance
              </span>
              <br />
              <span className="text-slate-900 dark:text-white">with Intelligence</span>
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400 sm:text-xl">
              NyayaSetu helps Indian government departments extract directives from court judgments,
              track deadlines, and ensure timely compliance — powered by
              <span className="font-semibold text-navy dark:text-blue-400"> NLP</span> and
              <span className="font-semibold text-accent"> smart automation</span>.
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to={isAuthenticated ? '/dashboard' : '/signup'}
                className="group relative flex items-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-navy to-navy-light px-10 py-4 text-base font-bold text-white shadow-2xl shadow-navy/30 transition-all hover:scale-[1.03] hover:shadow-navy/40"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                {isAuthenticated ? 'Open Dashboard' : 'Start Tracking Now'}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1.5" />
              </Link>
              <a
                href="#features"
                className="group flex items-center gap-2 rounded-2xl border-2 border-slate-300 px-8 py-4 text-base font-semibold text-slate-700 hover:border-navy hover:text-navy dark:border-slate-600 dark:text-slate-300 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all"
              >
                Explore Features
                <ChevronDown size={18} className="transition-transform group-hover:translate-y-0.5" />
              </a>
            </div>
          </Reveal>

          {/* Hero decorative icons */}
          <div className="pointer-events-none absolute top-10 left-8 hidden lg:block anim-float-slow">
            <div className="rounded-2xl bg-white/80 p-4 shadow-xl dark:bg-slate-800/80">
              <Gavel size={28} className="text-navy dark:text-blue-400" />
            </div>
          </div>
          <div className="pointer-events-none absolute top-20 right-12 hidden lg:block anim-float" style={{ animationDelay: '1s' }}>
            <div className="rounded-2xl bg-white/80 p-4 shadow-xl dark:bg-slate-800/80">
              <Shield size={28} className="text-accent" />
            </div>
          </div>
          <div className="pointer-events-none absolute bottom-8 left-20 hidden lg:block anim-float" style={{ animationDelay: '2s' }}>
            <div className="rounded-2xl bg-white/80 p-4 shadow-xl dark:bg-slate-800/80">
              <BarChart3 size={28} className="text-emerald-500" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="relative border-y border-slate-200/60 bg-gradient-to-r from-navy via-navy-dark to-navy py-20 dark:border-slate-700/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,168,67,0.1),transparent_60%)]" />
        <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-10 px-6 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 100} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                <s.icon size={24} className="text-accent anim-icon-bounce" style={{ animationDelay: `${i * 0.3}s` }} />
              </div>
              <div className="text-3xl font-extrabold text-white lg:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
                <CountUp target={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-sm font-medium text-slate-300">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-20 text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-accent">Capabilities</p>
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-heading)" }}>
              <span className="text-slate-900 dark:text-white">Everything You Need for </span>
              <span className="bg-gradient-to-r from-navy to-accent bg-clip-text text-transparent">Compliance</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              A comprehensive platform designed specifically for Indian government departments to manage court order compliance end-to-end.
            </p>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:bg-slate-800">
                  {/* Hover gradient glow */}
                  <div className={`absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br ${f.color} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20`} />
                  <div className="relative">
                    <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      <f.icon size={26} />
                    </div>
                    <h3 className="mb-3 text-lg font-bold text-slate-900 dark:text-white" style={{ fontFamily: "var(--font-heading)" }}>
                      {f.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{f.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="relative overflow-hidden border-y border-slate-200/60 bg-gradient-to-b from-slate-900 via-navy-dark to-slate-900 px-6 py-28 dark:border-slate-700/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(45,90,142,0.3),transparent_60%)]" />
        <div className="relative mx-auto max-w-5xl">
          <Reveal className="mb-20 text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-accent">Workflow</p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-heading)" }}>
              How It <span className="text-accent">Works</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-slate-400">
              Three simple steps from court order to full compliance.
            </p>
          </Reveal>

          <div className="relative grid gap-8 md:grid-cols-3 md:gap-6">
            {/* Connector line (desktop) */}
            <div className="pointer-events-none absolute top-[72px] left-[16.6%] right-[16.6%] hidden h-[2px] md:block">
              <svg width="100%" height="2" className="overflow-visible">
                <line x1="0" y1="1" x2="100%" y2="1" stroke="rgba(212,168,67,0.4)" strokeWidth="2" strokeDasharray="8 6" style={{ animation: 'dash-flow 1.5s linear infinite' }} />
              </svg>
            </div>

            {steps.map((s, i) => (
              <Reveal key={s.num} delay={i * 180}>
                <div className="group relative flex flex-col items-center text-center">
                  {/* Step circle */}
                  <div className="relative mb-8">
                    {/* Pulse ring */}
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${s.color} opacity-40`} style={{ animation: 'pulse-ring 2.5s ease-out infinite', animationDelay: `${i * 0.6}s` }} />
                    <div className={`relative flex h-[88px] w-[88px] items-center justify-center rounded-full bg-gradient-to-br ${s.color} shadow-2xl transition-transform duration-300 group-hover:scale-110`}>
                      <s.icon size={36} className="text-white drop-shadow-md" />
                    </div>
                    {/* Step number badge */}
                    <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-extrabold text-navy shadow-lg dark:bg-slate-800 dark:text-blue-400">
                      {s.num}
                    </div>
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                    {s.title}
                  </h3>
                  <p className="max-w-xs text-sm leading-relaxed text-slate-400">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trusted by / Social proof ── */}
      <section className="px-6 py-20">
        <Reveal className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-slate-200/60 bg-gradient-to-br from-white to-slate-50 p-10 shadow-sm dark:border-slate-700/50 dark:from-slate-800/50 dark:to-slate-900/50 md:p-14">
            <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12">
              <div className="flex-1 text-center md:text-left">
                <p className="mb-2 text-sm font-bold uppercase tracking-widest text-accent">Built For India</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl" style={{ fontFamily: "var(--font-heading)" }}>
                  Designed for Government Departments
                </h3>
                <p className="mt-4 text-slate-600 dark:text-slate-400">
                  Purpose-built to handle Indian court order formats, legal terminology, and department hierarchies.
                  Supports High Court and Supreme Court judgment structures.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'High Court', icon: Building2 },
                  { label: 'Supreme Court', icon: Gavel },
                  { label: 'NLP Engine', icon: Brain },
                  { label: 'OCR Support', icon: FileText },
                ].map((item, i) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center gap-2 rounded-2xl bg-white p-5 shadow-md dark:bg-slate-800"
                  >
                    <item.icon size={24} className="text-navy dark:text-blue-400 anim-icon-bounce" style={{ animationDelay: `${i * 0.4}s` }} />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-24">
        <Reveal>
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-navy-dark to-navy-light p-14 text-center shadow-2xl sm:p-20">
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -top-20 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-blue-500/15 blur-3xl" />

            <div className="relative">
              <Scale size={48} className="mx-auto mb-8 text-accent anim-glow" />
              <h2
                className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Ready to Ensure
                <br />
                <span className="text-accent">Compliance?</span>
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg text-slate-300">
                Join government departments across India using NyayaSetu to stay on top of court order directives.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  to={isAuthenticated ? '/dashboard' : '/signup'}
                  className="group relative flex items-center gap-2.5 overflow-hidden rounded-2xl bg-accent px-10 py-4 text-base font-bold text-navy-dark shadow-xl transition-all hover:scale-[1.03] hover:bg-yellow-400"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  {isAuthenticated ? 'Go to Dashboard' : 'Create Free Account'}
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1.5" />
                </Link>
                <Link
                  to="/login"
                  className="rounded-2xl border-2 border-white/25 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-all"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200/60 bg-white px-6 py-12 dark:border-slate-700/50 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-navy to-navy-light text-white">
              <Scale size={16} />
            </div>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              NyayaSetu — AI-Powered Court Order Compliance
            </span>
          </div>
          <div className="flex items-center gap-8 text-sm font-medium text-slate-500 dark:text-slate-400">
            <a href="#features" className="hover:text-navy dark:hover:text-blue-400 transition-colors">Features</a>
            <Link to="/login" className="hover:text-navy dark:hover:text-blue-400 transition-colors">Sign In</Link>
            <Link to="/signup" className="hover:text-navy dark:hover:text-blue-400 transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
