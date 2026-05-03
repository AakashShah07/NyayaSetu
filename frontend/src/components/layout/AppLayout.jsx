import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-bg-dark">
      <Sidebar />
      <div className="lg:pl-64">
        <main className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
