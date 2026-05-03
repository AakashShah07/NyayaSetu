import { useState, useEffect } from 'react';
import Topbar from '../components/layout/Topbar';
import Card, { CardHeader, CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import { getSystemStats } from '../api/nlp';
import { Activity, Database, FileText, CheckSquare, AlertTriangle } from 'lucide-react';

export default function SystemHealthPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSystemStats()
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <Topbar title="System Health" />
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      </>
    );
  }

  if (!stats) {
    return (
      <>
        <Topbar title="System Health" />
        <p className="py-20 text-center text-slate-500">Could not load system stats</p>
      </>
    );
  }

  return (
    <>
      <Topbar title="System Health" />
      <div className="space-y-6">
        {/* NLP Service */}
        <Card>
          <CardHeader><h3 className="text-sm font-semibold text-slate-800">NLP Service</h3></CardHeader>
          <CardBody>
            <div className="flex items-center gap-3">
              <Activity size={20} className={stats.nlpService.healthy ? 'text-green-500' : 'text-red-500'} />
              <Badge color={stats.nlpService.healthy ? 'green' : 'red'}>
                {stats.nlpService.healthy ? 'Healthy' : 'Unavailable'}
              </Badge>
            </div>
          </CardBody>
        </Card>

        {/* Counts */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: 'Judgments', count: stats.counts.judgments, icon: FileText, color: 'text-blue-600' },
            { label: 'Directives', count: stats.counts.directives, icon: Database, color: 'text-purple-600' },
            { label: 'Tasks', count: stats.counts.tasks, icon: CheckSquare, color: 'text-green-600' },
          ].map(({ label, count, icon: Icon, color }) => (
            <Card key={label}>
              <CardBody>
                <div className="flex items-center gap-3">
                  <Icon size={20} className={color} />
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{count}</p>
                    <p className="text-sm text-slate-500">{label}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Extraction Status */}
        <Card>
          <CardHeader><h3 className="text-sm font-semibold text-slate-800">Extraction Status</h3></CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <AlertTriangle size={20} className="text-amber-500" />
                <div>
                  <p className="text-lg font-bold">{stats.extraction.pending}</p>
                  <p className="text-xs text-slate-500">Pending</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AlertTriangle size={20} className="text-red-500" />
                <div>
                  <p className="text-lg font-bold">{stats.extraction.failed}</p>
                  <p className="text-xs text-slate-500">Failed</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AlertTriangle size={20} className="text-amber-600" />
                <div>
                  <p className="text-lg font-bold">{stats.extraction.needsReview}</p>
                  <p className="text-xs text-slate-500">Needs Admin Review</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Queue */}
        <Card>
          <CardHeader><h3 className="text-sm font-semibold text-slate-800">Processing Queue</h3></CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-lg font-bold">{stats.queue.queueLength}</p>
                <p className="text-xs text-slate-500">In Queue</p>
              </div>
              <div>
                <p className="text-lg font-bold">{stats.queue.processing ? 'Yes' : 'Idle'}</p>
                <p className="text-xs text-slate-500">Processing</p>
              </div>
              <div>
                <p className="text-lg font-bold">{stats.queue.completed}</p>
                <p className="text-xs text-slate-500">Completed</p>
              </div>
              <div>
                <p className="text-lg font-bold">{stats.queue.failed}</p>
                <p className="text-xs text-slate-500">Failed</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
