import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Clock, XCircle, Eye } from 'lucide-react';
import Card from '../ui/Card';

export default function StatsCards({ tasks, needsReviewCount = 0 }) {
  const navigate = useNavigate();
  const now = new Date();
  const sevenDays = new Date(now.getTime() + 7 * 86400000);

  const completed = tasks.filter((t) => t.status === 'completed').length;
  const overdue = tasks.filter(
    (t) => t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < now
  ).length;
  const atRisk = tasks.filter(
    (t) =>
      t.status !== 'completed' &&
      t.dueDate &&
      new Date(t.dueDate) >= now &&
      new Date(t.dueDate) <= sevenDays
  ).length;
  const onSchedule = tasks.filter(
    (t) => t.status !== 'completed' && t.dueDate && new Date(t.dueDate) > sevenDays
  ).length;

  const cards = [
    { label: 'On Schedule', count: onSchedule, icon: Clock, color: 'text-blue-600 bg-blue-50', filter: '' },
    { label: 'At Risk', count: atRisk, icon: AlertTriangle, color: 'text-amber-600 bg-amber-50', filter: '' },
    { label: 'Overdue', count: overdue, icon: XCircle, color: 'text-red-600 bg-red-50', filter: 'status=overdue' },
    { label: 'Completed', count: completed, icon: CheckCircle, color: 'text-green-600 bg-green-50', filter: 'status=completed' },
    ...(needsReviewCount > 0
      ? [{ label: 'Needs Review', count: needsReviewCount, icon: Eye, color: 'text-amber-700 bg-amber-50', path: '/directives?reviewStatus=needs_review' }]
      : []),
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map(({ label, count, icon: Icon, color, filter, path }) => (
        <Card
          key={label}
          className="cursor-pointer transition-shadow hover:shadow-md"
          onClick={() => navigate(path || (filter ? `/tasks?${filter}` : '/tasks'))}
        >
          <div className="flex items-center gap-4 p-5">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
              <Icon size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{count}</p>
              <p className="text-sm text-slate-500">{label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
