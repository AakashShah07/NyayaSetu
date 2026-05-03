import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/layout/Topbar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Select from '../components/ui/Select';
import Spinner from '../components/ui/Spinner';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import { getNotifications, markRead, markAllRead, dismissNotification } from '../api/notifications';
import { useAuth } from '../context/AuthContext';
import { triggerAlertCheck } from '../api/notifications';
import { usePagination } from '../hooks/usePagination';
import { formatRelative } from '../utils/formatters';
import { PRIORITY_COLORS } from '../utils/constants';
import { Bell, AlertTriangle, Clock, Zap } from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const { page, setPage } = usePagination();
  const [filters, setFilters] = useState({ type: '', read: '' });
  const [data, setData] = useState({ items: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20, sort: '-createdAt' };
      if (filters.type) params.type = filters.type;
      if (filters.read) params.read = filters.read;
      const res = await getNotifications(params);
      setData({ items: res.data || [], pagination: res.pagination });
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleClick = async (n) => {
    if (!n.read) await markRead(n._id);
    if (n.task) navigate(`/tasks/${typeof n.task === 'string' ? n.task : n.task._id}`);
    else if (n.judgment) navigate(`/judgments/${typeof n.judgment === 'string' ? n.judgment : n.judgment._id}`);
  };

  const handleMarkAllRead = async () => {
    await markAllRead();
    toast.success('All marked as read');
    fetchData();
  };

  const handleTriggerCheck = async () => {
    setTriggering(true);
    try {
      const res = await triggerAlertCheck();
      toast.success(`Alert check complete. ${res.data?.alertsCreated || 0} alerts created.`);
      fetchData();
    } catch (err) {
      toast.error('Alert check failed');
    } finally {
      setTriggering(false);
    }
  };

  return (
    <>
      <Topbar title="Notifications" />
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-3">
            <Select
              id="type-filter"
              className="w-44"
              value={filters.type}
              onChange={(e) => { setFilters({ ...filters, type: e.target.value }); setPage(1); }}
              options={[
                { value: '', label: 'All Types' },
                { value: 'deadline_reminder', label: 'Deadline Reminder' },
                { value: 'escalation', label: 'Escalation' },
                { value: 'status_change', label: 'Status Change' },
                { value: 'system', label: 'System' },
              ]}
            />
            <Select
              id="read-filter"
              className="w-32"
              value={filters.read}
              onChange={(e) => { setFilters({ ...filters, read: e.target.value }); setPage(1); }}
              options={[
                { value: '', label: 'All' },
                { value: 'false', label: 'Unread' },
                { value: 'true', label: 'Read' },
              ]}
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={handleMarkAllRead}>Mark All Read</Button>
            {hasRole('admin') && (
              <Button size="sm" loading={triggering} onClick={handleTriggerCheck}>
                <Zap size={14} /> Run Alert Check
              </Button>
            )}
          </div>
        </div>

        <Card>
          {loading ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : data.items.length === 0 ? (
            <EmptyState icon={Bell} message="No notifications" />
          ) : (
            <>
              <div className="divide-y divide-slate-100">
                {data.items.map((n) => (
                  <div
                    key={n._id}
                    onClick={() => handleClick(n)}
                    className={clsx(
                      'flex cursor-pointer items-center gap-4 px-6 py-4 hover:bg-slate-50',
                      !n.read && 'bg-blue-50/50'
                    )}
                  >
                    <div className={clsx('shrink-0', n.type === 'escalation' ? 'text-red-500' : 'text-slate-400')}>
                      {n.type === 'escalation' ? <AlertTriangle size={18} /> : <Clock size={18} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={clsx('text-sm', !n.read ? 'font-medium text-slate-800' : 'text-slate-600')}>{n.title}</p>
                      {n.message && <p className="mt-0.5 text-xs text-slate-500">{n.message}</p>}
                    </div>
                    <Badge color={PRIORITY_COLORS[n.priority] || 'slate'}>{n.priority}</Badge>
                    <span className="shrink-0 text-xs text-slate-400">{formatRelative(n.createdAt)}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); dismissNotification(n._id).then(fetchData); }}
                      className="shrink-0 text-xs text-slate-400 hover:text-red-500"
                    >
                      Dismiss
                    </button>
                  </div>
                ))}
              </div>
              <Pagination
                page={data.pagination?.page || 1}
                pages={data.pagination?.pages || 1}
                total={data.pagination?.total || 0}
                onPageChange={setPage}
              />
            </>
          )}
        </Card>
      </div>
    </>
  );
}
