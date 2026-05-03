import { useNavigate } from 'react-router-dom';
import Card, { CardHeader, CardBody } from '../ui/Card';
import StatusBadge from '../ui/StatusBadge';
import PriorityBadge from '../ui/PriorityBadge';
import { formatDate, daysUntilDue } from '../../utils/formatters';
import clsx from 'clsx';

export default function UpcomingDeadlines({ tasks }) {
  const navigate = useNavigate();

  const upcoming = tasks
    .filter((t) => t.status !== 'completed' && t.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-semibold text-slate-800">Upcoming Deadlines</h3>
      </CardHeader>
      <CardBody className="p-0">
        {upcoming.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-slate-500">No upcoming deadlines</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {upcoming.map((task) => {
              const days = daysUntilDue(task.dueDate);
              return (
                <div
                  key={task._id}
                  className="flex cursor-pointer items-center justify-between px-6 py-3 hover:bg-slate-50 dark:hover:bg-slate-700"
                  onClick={() => navigate(`/tasks/${task._id}`)}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{task.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <StatusBadge status={task.status} />
                      <PriorityBadge priority={task.priority} />
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-sm text-slate-500 dark:text-slate-400">{formatDate(task.dueDate)}</p>
                    <p
                      className={clsx(
                        'text-xs font-medium',
                        days < 0 ? 'text-red-600' : days <= 7 ? 'text-amber-600' : 'text-green-600'
                      )}
                    >
                      {days < 0
                        ? `${Math.abs(days)} days overdue`
                        : days === 0
                          ? 'Due today'
                          : `${days} days left`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
