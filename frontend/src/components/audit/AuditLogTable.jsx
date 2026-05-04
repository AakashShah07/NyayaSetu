import Badge from '../ui/Badge';

const ACTION_COLORS = {
  create: 'green',
  update: 'blue',
  delete: 'red',
  reassign: 'amber',
  status_change: 'purple',
};

export default function AuditLogTable({ logs }) {
  if (!logs.length) {
    return <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">No audit logs found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">Time</th>
            <th className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">User</th>
            <th className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">Action</th>
            <th className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">Entity</th>
            <th className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-gray-700">
          {logs.map((log) => (
            <tr key={log._id} className="text-gray-800 dark:text-gray-200">
              <td className="whitespace-nowrap px-3 py-2 text-xs">
                {new Date(log.createdAt).toLocaleString()}
              </td>
              <td className="px-3 py-2">{log.userName || log.user?.name || 'System'}</td>
              <td className="px-3 py-2">
                <Badge color={ACTION_COLORS[log.action] || 'slate'}>{log.action}</Badge>
              </td>
              <td className="px-3 py-2 capitalize">{log.entity}</td>
              <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-400">
                {log.description || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
