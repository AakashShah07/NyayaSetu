import { useNavigate } from 'react-router-dom';
import StatusBadge from '../ui/StatusBadge';
import PriorityBadge from '../ui/PriorityBadge';
import EmptyState from '../ui/EmptyState';
import { formatDate, daysUntilDue, truncate } from '../../utils/formatters';
import { CheckSquare } from 'lucide-react';
import clsx from 'clsx';

export default function TaskTable({ tasks }) {
  const navigate = useNavigate();

  if (!tasks || tasks.length === 0) {
    return <EmptyState icon={CheckSquare} message="No tasks found" />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Department</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Priority</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Due Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {tasks.map((task) => {
            const days = daysUntilDue(task.dueDate);
            return (
              <tr
                key={task._id}
                className="cursor-pointer hover:bg-slate-50"
                onClick={() => navigate(`/tasks/${task._id}`)}
              >
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-800">
                  {truncate(task.title, 50)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                  {task.department || '—'}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <span className="text-slate-600">{formatDate(task.dueDate)}</span>
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
