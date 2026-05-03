import { useState, useEffect, useCallback, useRef } from 'react';
import Topbar from '../components/layout/Topbar';
import StatsCards from '../components/dashboard/StatsCards';
import UpcomingDeadlines from '../components/dashboard/UpcomingDeadlines';
import RecentActivity from '../components/dashboard/RecentActivity';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { getTasks } from '../api/tasks';
import { getStatusUpdates } from '../api/statusUpdates';
import { getJudgments } from '../api/judgments';
import { RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [needsReviewCount, setNeedsReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const [tasksRes, updatesRes, judgmentsRes] = await Promise.all([
        getTasks({ limit: 200, sort: 'dueDate' }),
        getStatusUpdates({ limit: 10, sort: '-createdAt' }),
        getJudgments({ needsAdminReview: true, limit: 1 }),
      ]);
      setTasks(tasksRes.data || []);
      setUpdates(updatesRes.data || []);
      setNeedsReviewCount(judgmentsRes.pagination?.total || 0);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, 60000);
    return () => clearInterval(intervalRef.current);
  }, [fetchData]);

  if (loading) {
    return (
      <>
        <Topbar title="Dashboard" />
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      </>
    );
  }

  return (
    <>
      <Topbar title="Dashboard" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {lastUpdated && `Last updated: ${lastUpdated.toLocaleTimeString()}`}
          </div>
          <Button size="sm" variant="ghost" onClick={fetchData}>
            <RefreshCw size={14} /> Refresh
          </Button>
        </div>
        <StatsCards tasks={tasks} needsReviewCount={needsReviewCount} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <UpcomingDeadlines tasks={tasks} />
          <RecentActivity updates={updates} />
        </div>
      </div>
    </>
  );
}
