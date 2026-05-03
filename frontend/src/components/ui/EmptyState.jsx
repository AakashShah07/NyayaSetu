import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, message = 'No data found', children }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon size={48} className="mb-3 text-slate-300" />
      <p className="text-sm text-slate-500">{message}</p>
      {children}
    </div>
  );
}
