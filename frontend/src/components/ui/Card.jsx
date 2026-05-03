import clsx from 'clsx';

export default function Card({ children, className, ...props }) {
  return (
    <div
      className={clsx('rounded-lg bg-white shadow-sm border border-slate-200', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return (
    <div className={clsx('border-b border-slate-200 px-6 py-4', className)}>
      {children}
    </div>
  );
}

export function CardBody({ children, className }) {
  return <div className={clsx('px-6 py-4', className)}>{children}</div>;
}
