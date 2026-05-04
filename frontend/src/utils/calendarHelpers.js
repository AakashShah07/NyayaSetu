const PRIORITY_COLORS = {
  critical: '#dc2626',
  high: '#ea580c',
  medium: '#ca8a04',
  low: '#16a34a',
};

export function tasksToEvents(tasks) {
  return tasks
    .filter((t) => t.dueDate)
    .map((t) => ({
      id: t._id,
      title: t.title,
      start: new Date(t.dueDate),
      end: new Date(t.dueDate),
      allDay: true,
      resource: { type: 'task', status: t.status, priority: t.priority, ...t },
      color: PRIORITY_COLORS[t.priority] || '#6b7280',
    }));
}

export function directivesToEvents(directives) {
  return directives
    .filter((d) => d.deadline)
    .map((d) => ({
      id: d._id,
      title: d.directiveText?.substring(0, 50) || 'Directive',
      start: new Date(d.deadline),
      end: new Date(d.deadline),
      allDay: true,
      resource: { type: 'directive', department: d.responsibleDepartment, ...d },
      color: '#7c3aed',
    }));
}
