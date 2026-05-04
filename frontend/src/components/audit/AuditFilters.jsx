export default function AuditFilters({ filters, onChange }) {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Entity</label>
        <select
          value={filters.entity || ''}
          onChange={(e) => update('entity', e.target.value)}
          className="rounded-md border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        >
          <option value="">All</option>
          <option value="task">Task</option>
          <option value="directive">Directive</option>
          <option value="judgment">Judgment</option>
          <option value="user">User</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Action</label>
        <select
          value={filters.action || ''}
          onChange={(e) => update('action', e.target.value)}
          className="rounded-md border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        >
          <option value="">All</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
          <option value="reassign">Reassign</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Start Date</label>
        <input
          type="date"
          value={filters.startDate || ''}
          onChange={(e) => update('startDate', e.target.value)}
          className="rounded-md border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">End Date</label>
        <input
          type="date"
          value={filters.endDate || ''}
          onChange={(e) => update('endDate', e.target.value)}
          className="rounded-md border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
      </div>
    </div>
  );
}
