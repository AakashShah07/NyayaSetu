import { CheckCircle2, AlertTriangle, Clock, BarChart3 } from 'lucide-react';

export default function ReportPreview({ report, type }) {
  if (!report) return null;

  const { summary } = report;

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatBox
          label="Total Tasks"
          value={summary.total || summary.totalTasks}
          icon={BarChart3}
          color="from-navy to-navy-light"
          textColor="text-navy dark:text-blue-400"
        />
        <StatBox
          label="Completed"
          value={summary.completed}
          icon={CheckCircle2}
          color="from-emerald-500 to-teal-500"
          textColor="text-emerald-600 dark:text-emerald-400"
        />
        <StatBox
          label="Overdue"
          value={summary.overdue}
          icon={AlertTriangle}
          color="from-red-500 to-rose-500"
          textColor="text-red-600 dark:text-red-400"
        />
        <StatBox
          label="Compliance"
          value={`${summary.complianceRate}%`}
          icon={Clock}
          color="from-accent to-yellow-500"
          textColor="text-accent"
        />
      </div>

      {/* Tasks table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80">
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Title</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Priority</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Due Date</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Assigned To</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {(report.tasks || []).map((t, i) => (
              <tr key={t.id || i} className="text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/40">
                <td className="px-4 py-3 font-medium">{t.title?.substring(0, 50)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={t.status} />
                </td>
                <td className="px-4 py-3">
                  <PriorityBadge priority={t.priority} />
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '-'}
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{t.assignedTo || '-'}</td>
              </tr>
            ))}
            {(report.tasks || []).length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                  No tasks found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatBox({ label, value, icon: Icon, color, textColor }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/50">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${color} text-white shadow-sm`}>
          <Icon size={14} />
        </div>
      </div>
      <p className={`text-2xl font-extrabold ${textColor}`} style={{ fontFamily: 'var(--font-heading)' }}>
        {value}
      </p>
    </div>
  );
}

const statusStyles = {
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  overdue: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
  not_started: 'bg-slate-100 text-slate-600 dark:bg-slate-600/20 dark:text-slate-400',
  archived: 'bg-slate-100 text-slate-500 dark:bg-slate-600/20 dark:text-slate-500',
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${statusStyles[status] || statusStyles.not_started}`}>
      {status?.replace('_', ' ')}
    </span>
  );
}

const priorityStyles = {
  critical: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
  high: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  low: 'bg-slate-100 text-slate-600 dark:bg-slate-600/20 dark:text-slate-400',
};

function PriorityBadge({ priority }) {
  return (
    <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold capitalize ${priorityStyles[priority] || priorityStyles.low}`}>
      {priority}
    </span>
  );
}
