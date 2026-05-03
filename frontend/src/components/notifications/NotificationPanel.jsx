import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotifications, markRead, markAllRead, dismissNotification, snoozeNotification } from '../../api/notifications';
import Badge from '../ui/Badge';
import { formatRelative } from '../../utils/formatters';
import { PRIORITY_COLORS } from '../../utils/constants';
import { AlertTriangle, Clock, ArrowUpRight, CheckCircle, X, BellOff } from 'lucide-react';
import clsx from 'clsx';

const TYPE_ICONS = {
  deadline_reminder: Clock,
  escalation: AlertTriangle,
  status_change: ArrowUpRight,
  assignment: CheckCircle,
  system: AlertTriangle,
};

export default function NotificationPanel({ onClose, onCountChange }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications({ limit: 20, sort: '-createdAt' });
      setNotifications(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleClick = async (n) => {
    if (!n.read) {
      await markRead(n._id);
      onCountChange?.();
    }
    if (n.task) {
      navigate(`/tasks/${typeof n.task === 'string' ? n.task : n.task._id}`);
    } else if (n.judgment) {
      navigate(`/judgments/${typeof n.judgment === 'string' ? n.judgment : n.judgment._id}`);
    }
    onClose();
  };

  const handleMarkAllRead = async () => {
    await markAllRead();
    fetchNotifications();
    onCountChange?.();
  };

  const handleDismiss = async (e, id) => {
    e.stopPropagation();
    await dismissNotification(id);
    fetchNotifications();
    onCountChange?.();
  };

  const handleSnooze = async (e, id, hours) => {
    e.stopPropagation();
    const until = new Date(Date.now() + hours * 3600000).toISOString();
    await snoozeNotification(id, until);
    fetchNotifications();
    onCountChange?.();
  };

  return (
    <div className="absolute right-0 top-12 z-50 w-96 rounded-lg border border-slate-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-800">Notifications</h3>
        <div className="flex gap-2">
          <button
            onClick={handleMarkAllRead}
            className="text-xs text-blue-600 hover:underline"
          >
            Mark all read
          </button>
          <button onClick={() => { navigate('/notifications'); onClose(); }} className="text-xs text-blue-600 hover:underline">
            View all
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <p className="py-8 text-center text-sm text-slate-400">Loading...</p>
        ) : notifications.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">No notifications</p>
        ) : (
          notifications.map((n) => {
            const Icon = TYPE_ICONS[n.type] || AlertTriangle;
            return (
              <div
                key={n._id}
                onClick={() => handleClick(n)}
                className={clsx(
                  'flex cursor-pointer gap-3 border-b border-slate-100 px-4 py-3 hover:bg-slate-50',
                  !n.read && 'bg-blue-50/50'
                )}
              >
                <div className={clsx('mt-0.5 shrink-0', n.priority === 'critical' ? 'text-red-500' : 'text-slate-400')}>
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={clsx('text-sm', !n.read ? 'font-medium text-slate-800' : 'text-slate-600')}>
                      {n.title}
                    </p>
                    <Badge color={PRIORITY_COLORS[n.priority] || 'slate'} className="text-[10px]">
                      {n.priority}
                    </Badge>
                  </div>
                  {n.message && <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">{n.message}</p>}
                  <p className="mt-1 text-[10px] text-slate-400">{formatRelative(n.createdAt)}</p>
                </div>
                <div className="flex shrink-0 items-start gap-1">
                  <button
                    onClick={(e) => handleSnooze(e, n._id, 24)}
                    className="rounded p-1 text-slate-300 hover:bg-slate-100 hover:text-slate-500"
                    title="Snooze 24h"
                  >
                    <BellOff size={12} />
                  </button>
                  <button
                    onClick={(e) => handleDismiss(e, n._id)}
                    className="rounded p-1 text-slate-300 hover:bg-slate-100 hover:text-red-500"
                    title="Dismiss"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
