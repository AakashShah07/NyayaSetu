import clsx from 'clsx';

export default function Input({ label, error, className, id, ...props }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <input
        id={id}
        className={clsx(
          'block w-full rounded-md shadow-sm sm:text-sm dark:bg-slate-700 dark:text-slate-200',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-slate-300 focus:border-navy focus:ring-navy dark:border-slate-600'
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
