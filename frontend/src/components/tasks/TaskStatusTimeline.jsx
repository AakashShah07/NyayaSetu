import { formatDateTime, statusLabel } from '../../utils/formatters';
import { ArrowRight } from 'lucide-react';

export default function TaskStatusTimeline({ updates }) {
  if (!updates || updates.length === 0) {
    return <p className="py-4 text-center text-sm text-slate-500 dark:text-slate-400">No status history yet</p>;
  }

  return (
    <div className="space-y-4">
      {updates.map((u, i) => (
        <div key={u._id || i} className="relative flex gap-3 pl-6">
          <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 border-navy bg-white dark:bg-slate-800" />
          {i < updates.length - 1 && (
            <div className="absolute left-[5px] top-4 h-full w-0.5 bg-slate-200 dark:bg-slate-600" />
          )}
          <div className="flex-1 pb-4">
            <div className="flex items-center gap-2 text-sm">
              {u.previousStatus && (
                <>
                  <span className="text-slate-500 dark:text-slate-400">{statusLabel(u.previousStatus)}</span>
                  <ArrowRight size={12} className="text-slate-400" />
                </>
              )}
              <span className="font-medium text-slate-800 dark:text-slate-100">{statusLabel(u.newStatus)}</span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {u.updatedBy?.name || 'System'} &middot; {formatDateTime(u.createdAt)}
            </p>
            {u.notes && (
              <p className="mt-1 rounded bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:bg-slate-700 dark:text-slate-300">{u.notes}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
