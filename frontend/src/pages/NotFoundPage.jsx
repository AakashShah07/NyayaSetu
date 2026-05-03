import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4 text-center">
      <h1 className="text-6xl font-bold text-navy">404</h1>
      <p className="mt-2 text-lg text-slate-600">Page not found</p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-light"
      >
        <Home size={16} />
        Back to Dashboard
      </Link>
    </div>
  );
}
