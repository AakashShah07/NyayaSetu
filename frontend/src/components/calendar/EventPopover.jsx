import Badge from '../ui/Badge';

export default function EventPopover({ event, onClose }) {
  if (!event) return null;
  const { resource } = event;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <Badge color={resource.type === 'task' ? 'blue' : 'purple'}>
            {resource.type === 'task' ? 'Task' : 'Directive'}
          </Badge>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            &times;
          </button>
        </div>
        <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">{event.title}</h3>
        <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
          <p><span className="font-medium">Due:</span> {event.start.toLocaleDateString()}</p>
          {resource.status && <p><span className="font-medium">Status:</span> {resource.status.replace('_', ' ')}</p>}
          {resource.priority && <p><span className="font-medium">Priority:</span> {resource.priority}</p>}
          {resource.department && <p><span className="font-medium">Dept:</span> {resource.department}</p>}
          {resource.responsibleDepartment && <p><span className="font-medium">Dept:</span> {resource.responsibleDepartment}</p>}
        </div>
      </div>
    </div>
  );
}
