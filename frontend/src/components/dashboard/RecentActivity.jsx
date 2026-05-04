import Card, { CardHeader, CardBody } from '../ui/Card';
import { formatRelative, statusLabel } from '../../utils/formatters';
import { ArrowRight } from 'lucide-react';

export default function RecentActivity({ updates }) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Recent Activity</h3>
      </CardHeader>
      <CardBody className="p-0">
        {(!updates || updates.length === 0) ? (
          <p className="px-6 py-8 text-center text-sm text-slate-500">No recent activity</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {updates.map((u) => (
              <div key={u._id} className="px-6 py-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {u.updatedBy?.name || 'System'}
                  </span>
                  <span className="text-slate-400">changed status</span>
                  {u.previousStatus && (
                    <>
                      <span className="text-slate-500 dark:text-slate-400">{statusLabel(u.previousStatus)}</span>
                      <ArrowRight size={12} className="text-slate-400" />
                    </>
                  )}
                  <span className="font-medium text-slate-700 dark:text-slate-200">{statusLabel(u.newStatus)}</span>
                </div>
                {u.notes && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{u.notes}</p>
                )}
                <p className="mt-1 text-xs text-slate-400">{formatRelative(u.createdAt)}</p>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
