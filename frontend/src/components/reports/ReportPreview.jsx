export default function ReportPreview({ report, type }) {
  if (!report) return null;

  const { summary } = report;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatBox label="Total Tasks" value={summary.total || summary.totalTasks} />
        <StatBox label="Completed" value={summary.completed} color="text-emerald-600" />
        <StatBox label="Overdue" value={summary.overdue} color="text-red-600" />
        <StatBox label="Compliance" value={`${summary.complianceRate}%`} color="text-blue-600" />
      </div>

      {/* Tasks table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">Title</th>
              <th className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">Status</th>
              <th className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">Priority</th>
              <th className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">Due Date</th>
              <th className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">Assigned To</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {(report.tasks || []).map((t) => (
              <tr key={t.id} className="text-gray-800 dark:text-gray-200">
                <td className="px-3 py-2">{t.title?.substring(0, 40)}</td>
                <td className="px-3 py-2 capitalize">{t.status?.replace('_', ' ')}</td>
                <td className="px-3 py-2 capitalize">{t.priority}</td>
                <td className="px-3 py-2">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '-'}</td>
                <td className="px-3 py-2">{t.assignedTo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatBox({ label, value, color = 'text-gray-900 dark:text-white' }) {
  return (
    <div className="rounded-md border p-3 text-center dark:border-gray-700">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`mt-1 text-lg font-bold ${color}`}>{value}</p>
    </div>
  );
}
