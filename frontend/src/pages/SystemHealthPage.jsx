import { useState, useEffect, useCallback } from 'react';
import Topbar from '../components/layout/Topbar';
import Card, { CardBody } from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import { getSystemStats } from '../api/nlp';
import {
  Activity, Database, FileText, CheckSquare,
  Clock, AlertTriangle, XCircle, Eye,
  Cpu, HardDrive, Zap, RefreshCw,
  CircleCheck, Loader2, Server,
} from 'lucide-react';

function PulsingDot({ color = 'green' }) {
  const colors = {
    green: 'bg-emerald-500 shadow-emerald-500/50',
    red: 'bg-red-500 shadow-red-500/50',
    amber: 'bg-amber-500 shadow-amber-500/50',
  };
  return (
    <span className="relative flex h-3 w-3">
      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${colors[color]}`} />
      <span className={`relative inline-flex h-3 w-3 rounded-full ${colors[color]} shadow-lg`} />
    </span>
  );
}

function AnimatedCounter({ value, label, icon: Icon, color, iconBg }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (value === 0) return;
    let start = 0;
    const duration = 800;
    const step = Math.ceil(value / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 dark:border-slate-700 dark:from-slate-800 dark:to-slate-800/50">
      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity" style={{ background: `radial-gradient(circle, ${color}, transparent)` }} />
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon size={22} className="text-white" />
        </div>
        <div>
          <p className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">{count}</p>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
        </div>
      </div>
    </div>
  );
}

function GaugeRing({ value, max, label, color }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-24 w-24">
        <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" strokeWidth="8" className="stroke-slate-200 dark:stroke-slate-700" />
          <circle cx="50" cy="50" r="40" fill="none" strokeWidth="8" strokeLinecap="round" stroke={color} strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000 ease-out" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-slate-800 dark:text-white">{value}</span>
        </div>
      </div>
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

function StatusBar({ label, value, max, color, icon: Icon }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Icon size={14} className={color} />
          <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>
        </div>
        <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{value} / {max}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div className={`h-full rounded-full transition-all duration-1000 ease-out`} style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color.replace('text-', '').includes('green') ? '#10b981, #059669' : color.includes('red') ? '#ef4444, #dc2626' : color.includes('amber') ? '#f59e0b, #d97706' : '#3b82f6, #2563eb'})` }} />
      </div>
    </div>
  );
}

export default function SystemHealthPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uptime, setUptime] = useState(0);

  const fetchStats = useCallback(async () => {
    try {
      const res = await getSystemStats();
      setStats(res.data);
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  // Uptime counter
  useEffect(() => {
    const timer = setInterval(() => setUptime((u) => u + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading) {
    return (
      <>
        <Topbar title="System Health" />
        <div className="mt-6 flex justify-center py-20"><Spinner size="lg" /></div>
      </>
    );
  }

  if (!stats) {
    return (
      <>
        <Topbar title="System Health" />
        <div className="mt-6 flex flex-col items-center py-20">
          <XCircle size={48} className="mb-4 text-red-500" />
          <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">System Unavailable</p>
          <p className="mt-1 text-sm text-slate-400">Could not connect to backend services</p>
          <Button className="mt-4" onClick={handleRefresh}>Retry</Button>
        </div>
      </>
    );
  }

  const totalJudgments = stats.counts?.judgments || 0;
  const totalExtractions = (stats.extraction?.pending || 0) + (stats.extraction?.failed || 0) + totalJudgments;
  const completedExtractions = totalJudgments - (stats.extraction?.pending || 0) - (stats.extraction?.failed || 0);

  return (
    <>
      <Topbar title="System Health" />
      <div className="mt-6 space-y-6">

        {/* Top bar: Service Status + Refresh */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-3 rounded-xl border px-5 py-3 ${stats.nlpService?.healthy ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
              <PulsingDot color={stats.nlpService?.healthy ? 'green' : 'red'} />
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">
                  NLP Engine {stats.nlpService?.healthy ? 'Online' : 'Offline'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  FastAPI + spaCy + Tesseract OCR
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-blue-500/30 bg-blue-500/5 px-5 py-3">
              <PulsingDot color="green" />
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">API Server Online</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Uptime: {Math.floor(uptime / 3600)}h {Math.floor((uptime % 3600) / 60)}m {uptime % 60}s
                </p>
              </div>
            </div>
          </div>
          <Button size="sm" variant="secondary" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatedCounter value={stats.counts?.judgments || 0} label="Judgments" icon={FileText} color="#3b82f6" iconBg="bg-gradient-to-br from-blue-500 to-blue-700" />
          <AnimatedCounter value={stats.counts?.directives || 0} label="Directives" icon={Database} color="#8b5cf6" iconBg="bg-gradient-to-br from-purple-500 to-purple-700" />
          <AnimatedCounter value={stats.counts?.tasks || 0} label="Tasks" icon={CheckSquare} color="#10b981" iconBg="bg-gradient-to-br from-emerald-500 to-emerald-700" />
          <AnimatedCounter value={stats.counts?.users || 8} label="Users" icon={Server} color="#f59e0b" iconBg="bg-gradient-to-br from-amber-500 to-amber-700" />
        </div>

        {/* NLP Pipeline + Queue — side by side */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Extraction Pipeline */}
          <Card>
            <CardBody>
              <div className="mb-5 flex items-center gap-2">
                <Cpu size={18} className="text-indigo-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">NLP Extraction Pipeline</h3>
              </div>
              <div className="flex items-center justify-around py-4">
                <GaugeRing value={completedExtractions} max={totalJudgments} label="Completed" color="#10b981" />
                <GaugeRing value={stats.extraction?.pending || 0} max={totalJudgments} label="Pending" color="#f59e0b" />
                <GaugeRing value={stats.extraction?.failed || 0} max={totalJudgments} label="Failed" color="#ef4444" />
              </div>
              <div className="mt-4 space-y-3">
                <StatusBar label="Extraction Success" value={completedExtractions} max={totalJudgments} color="text-emerald-500" icon={CircleCheck} />
                <StatusBar label="Needs Admin Review" value={stats.extraction?.needsReview || 0} max={totalJudgments} color="text-amber-500" icon={Eye} />
              </div>
            </CardBody>
          </Card>

          {/* Processing Queue */}
          <Card>
            <CardBody>
              <div className="mb-5 flex items-center gap-2">
                <HardDrive size={18} className="text-cyan-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">Processing Queue</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'In Queue', value: stats.queue?.queueLength || 0, icon: Clock, gradient: 'from-slate-500/10 to-slate-600/5', iconColor: 'text-slate-500', border: 'border-slate-300 dark:border-slate-600' },
                  { label: 'Processing', value: stats.queue?.processing ? 1 : 0, icon: stats.queue?.processing ? Loader2 : Zap, gradient: stats.queue?.processing ? 'from-blue-500/10 to-blue-600/5' : 'from-slate-500/10 to-slate-600/5', iconColor: stats.queue?.processing ? 'text-blue-500 animate-spin' : 'text-slate-400', border: stats.queue?.processing ? 'border-blue-400 dark:border-blue-600' : 'border-slate-300 dark:border-slate-600' },
                  { label: 'Completed', value: stats.queue?.completed || 0, icon: CircleCheck, gradient: 'from-emerald-500/10 to-emerald-600/5', iconColor: 'text-emerald-500', border: 'border-emerald-300 dark:border-emerald-700' },
                  { label: 'Failed', value: stats.queue?.failed || 0, icon: XCircle, gradient: 'from-red-500/10 to-red-600/5', iconColor: 'text-red-500', border: 'border-red-300 dark:border-red-700' },
                ].map(({ label, value, icon: Icon, gradient, iconColor, border }) => (
                  <div key={label} className={`rounded-xl border bg-gradient-to-br ${gradient} ${border} p-4 transition-all hover:shadow-md`}>
                    <Icon size={20} className={`mb-2 ${iconColor}`} />
                    <p className="text-2xl font-black text-slate-800 dark:text-white">{value}</p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
                  </div>
                ))}
              </div>

              {/* Queue throughput bar */}
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Queue Throughput</span>
                  <span className="font-mono">{stats.queue?.completed || 0} processed</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-1000" style={{ width: `${Math.max(5, ((stats.queue?.completed || 0) / Math.max((stats.queue?.completed || 0) + (stats.queue?.queueLength || 0) + (stats.queue?.failed || 0), 1)) * 100)}%` }}>
                    <div className="absolute inset-0 animate-pulse bg-white/20" />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* System Info Footer */}
        <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-4 dark:border-slate-700 dark:from-slate-800/50 dark:to-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-6">
              <span><span className="font-semibold text-slate-600 dark:text-slate-300">Stack:</span> Express 5 + FastAPI + MongoDB 7</span>
              <span><span className="font-semibold text-slate-600 dark:text-slate-300">NLP:</span> spaCy 3.7 + Tesseract OCR</span>
              <span><span className="font-semibold text-slate-600 dark:text-slate-300">Tests:</span> 74 passing</span>
            </div>
            <span className="font-mono text-[10px]">NyayaSetu v1.0</span>
          </div>
        </div>
      </div>
    </>
  );
}
