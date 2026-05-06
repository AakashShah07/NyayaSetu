import { NavLink, useNavigate } from 'react-router-dom';
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
  ScrollText,
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
  { to: '/admin/audit-log', icon: ScrollText, label: 'Audit Log' },
];

export default function Sidebar() {
  const { user, logout, hasRole } = useAuth();
  const { isOpen, close } = useSidebar();
  const navigate = useNavigate();

  const items = hasRole('admin') ? [...navItems, ...adminItems] : navItems;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={close} />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-gradient-to-b from-navy via-navy-dark to-navy text-white transition-transform lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo — clickable to go Home */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <button
            onClick={() => { close(); navigate('/'); }}
            className="flex items-center gap-3 group transition-all"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent/90 to-yellow-500 shadow-lg shadow-accent/20 transition-transform group-hover:scale-110">
              <Scale size={18} className="text-navy-dark" />
            </div>
            <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "var(--font-heading, 'Playfair Display', Georgia, serif)" }}>
              <span className="text-white">Nyaya</span>
              <span className="text-accent">Setu</span>
            </span>
          </button>
          <button onClick={close} className="lg:hidden text-white/70 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {items.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={close}
              className={({ isActive }) =>
                clsx(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-white/15 text-white shadow-sm shadow-white/5'
                    : 'text-white/60 hover:bg-white/8 hover:text-white'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className={clsx(
                    'flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-accent/20 text-accent'
                      : 'text-white/50 group-hover:text-white/80'
                  )}>
                    <Icon size={18} />
                  </div>
                  <span>{label}</span>
                  {isActive && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-accent shadow-sm shadow-accent/50" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 px-4 py-4">
          <div className="mb-3 rounded-xl bg-white/5 px-3 py-3">
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="text-xs text-white/40">{user?.department} &middot; {user?.role?.replace('_', ' ')}</p>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/50 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
