import clsx from 'clsx';

const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-12 w-12' };

export default function Spinner({ size = 'md', className, label }) {
  const isLarge = size === 'lg';

  return (
    <div className={clsx('flex flex-col items-center gap-4', className)}>
      <div className="relative">
        {/* Outer glow ring */}
        {isLarge && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-navy to-accent opacity-20 blur-md animate-pulse" />
        )}
        {/* Spinner ring */}
        <svg
          className={clsx('animate-spin', sizes[size])}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 48 48"
        >
          <circle
            cx="24" cy="24" r="20"
            stroke="currentColor"
            strokeWidth="4"
            className="text-slate-200 dark:text-slate-700"
          />
          <circle
            cx="24" cy="24" r="20"
            stroke="url(#spinner-gradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="80 50"
          />
          <defs>
            <linearGradient id="spinner-gradient" x1="0" y1="0" x2="48" y2="48">
              <stop offset="0%" stopColor="#1e3a5f" />
              <stop offset="100%" stopColor="#d4a843" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {isLarge && (
        <span className="text-sm font-medium text-slate-400 dark:text-slate-500 animate-pulse">
          {label || 'Loading...'}
        </span>
      )}
    </div>
  );
}
