import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import {
  LayoutDashboard,
  Scale,
  FileText,
  CheckSquare,
  Upload,
  Bell,
  Users,
  BarChart3,
  ClipboardList,
  CalendarDays,
  Activity,
  LogOut,
  X,
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/judgments', icon: Scale, label: 'Court Orders' },
  { to: '/directives', icon: FileText, label: 'Directives' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/judgments/upload', icon: Upload, label: 'Upload Judgment' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/reports', icon: ClipboardList, label: 'Reports' },
  { to: '/calendar', icon: CalendarDays, label: 'Calendar' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
];

const adminItems = [
  { to: '/users', icon: Users, label: 'User Management' },
  { to: '/admin/health', icon: Activity, label: 'System Health' },
];

export default function Sidebar() {
  const { user, logout, hasRole } = useAuth();
  const { isOpen, close } = useSidebar();

  const items = hasRole('admin') ? [...navItems, ...adminItems] : navItems;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={close} />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-navy text-white transition-transform lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <Scale size={24} className="text-accent" />
            <span className="text-lg font-bold">NyayaSetu</span>
          </div>
          <button onClick={close} className="lg:hidden text-white/70 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {items.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={close}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 px-4 py-4">
          <div className="mb-3 px-2">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-white/50">{user?.department} &middot; {user?.role?.replace('_', ' ')}</p>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
