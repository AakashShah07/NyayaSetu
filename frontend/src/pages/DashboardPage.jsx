import { useState, useEffect } from 'react';
import Topbar from '../components/layout/Topbar';
import StatsCards from '../components/dashboard/StatsCards';
import UpcomingDeadlines from '../components/dashboard/UpcomingDeadlines';
import RecentActivity from '../components/dashboard/RecentActivity';
import Spinner from '../components/ui/Spinner';
import { getTasks } from '../api/tasks';
import { getStatusUpdates } from '../api/statusUpdates';

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getTasks({ limit: 200, sort: 'dueDate' }),
      getStatusUpdates({ limit: 10, sort: '-createdAt' }),
    ])
      .then(([tasksRes, updatesRes]) => {
        setTasks(tasksRes.data || []);
        setUpdates(updatesRes.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

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
        <StatsCards tasks={tasks} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <UpcomingDeadlines tasks={tasks} />
          <RecentActivity updates={updates} />
        </div>
      </div>
    </>
  );
}
