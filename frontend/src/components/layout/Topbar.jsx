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
    <header className="sticky top-0 z-30 mx-1 mt-2 flex items-center justify-between rounded-2xl border border-slate-200/60 bg-gradient-to-r from-white via-white to-slate-50 px-6 py-4 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800/80">
      <div className="flex items-center gap-4">
        <button onClick={toggle} className="text-slate-500 hover:text-slate-700 lg:hidden dark:text-slate-400 dark:hover:text-slate-200">
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="rounded-xl p-2.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <NotificationBell />
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-navy to-navy-dark text-xs font-bold tracking-wide text-white shadow-sm">
          {initials}
        </div>
      </div>
    </header>
  );
}
