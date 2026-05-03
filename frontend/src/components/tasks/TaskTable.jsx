import { useNavigate } from 'react-router-dom';
import StatusBadge from '../ui/StatusBadge';
import PriorityBadge from '../ui/PriorityBadge';
import EmptyState from '../ui/EmptyState';
import { formatDate, daysUntilDue, truncate } from '../../utils/formatters';
import { CheckSquare, Flame } from 'lucide-react';
import clsx from 'clsx';

export default function TaskTable({ tasks }) {
  const navigate = useNavigate();

  if (!tasks || tasks.length === 0) {
    return <EmptyState icon={CheckSquare} message="No tasks found" />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead className="bg-slate-50 dark:bg-slate-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Department</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Priority</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Due Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-700 dark:bg-slate-800">
          {tasks.map((task) => {
            const days = daysUntilDue(task.dueDate);
            return (
              <tr
                key={task._id}
                className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
                onClick={() => navigate(`/tasks/${task._id}`)}
              >
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-800 dark:text-slate-100">
                  <span className="inline-flex items-center gap-1.5">
                    {task.escalationLevel > 0 && (
                      <Flame size={14} className="text-red-500" title={`Escalation level ${task.escalationLevel}`} />
                    )}
                    {truncate(task.title, 50)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                  {task.department || '—'}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <span className="text-slate-600 dark:text-slate-300">{formatDate(task.dueDate)}</span>
                  {days !== null && task.status !== 'completed' && (
                    <span
                      className={clsx(
                        'ml-2 text-xs font-medium',
                        days < 0 ? 'text-red-600' : days <= 7 ? 'text-amber-600' : 'text-slate-400'
                      )}
                    >
                      {days < 0 ? `${Math.abs(days)}d overdue` : `${days}d left`}
                    </span>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <StatusBadge status={task.status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
