import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import { useTheme } from '../../context/ThemeContext';
import NotificationBell from '../notifications/NotificationBell';
import { Menu, Sun, Moon } from 'lucide-react';

export default function Topbar({ title }) {
  const { user } = useAuth();
  const { toggle } = useSidebar();
  const { dark, toggle: toggleTheme } = useTheme();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-4">
        <button onClick={toggle} className="text-slate-500 hover:text-slate-700 lg:hidden dark:text-slate-400 dark:hover:text-slate-200">
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <NotificationBell />
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
          {initials}
        </div>
      </div>
    </header>
  );
}
