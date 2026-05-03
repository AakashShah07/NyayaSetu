import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import NotificationBell from '../notifications/NotificationBell';
import { Menu } from 'lucide-react';

export default function Topbar({ title }) {
  const { user } = useAuth();
  const { toggle } = useSidebar();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <div className="flex items-center gap-4">
        <button onClick={toggle} className="text-slate-500 hover:text-slate-700 lg:hidden">
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <NotificationBell />
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
          {initials}
        </div>
      </div>
    </header>
  );
}
