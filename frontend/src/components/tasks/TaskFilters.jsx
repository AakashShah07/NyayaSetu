import Select from '../ui/Select';
import { TASK_STATUSES, PRIORITIES, DEPARTMENTS } from '../../utils/constants';

export default function TaskFilters({ filters, onChange }) {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="flex flex-wrap gap-3">
      <Select
        id="status-filter"
        className="w-40"
        value={filters.status || ''}
        onChange={(e) => update('status', e.target.value)}
        options={[{ value: '', label: 'All Statuses' }, ...TASK_STATUSES.map((s) => ({ value: s, label: s.replace(/_/g, ' ') }))]}
      />
      <Select
        id="dept-filter"
        className="w-40"
        value={filters.department || ''}
        onChange={(e) => update('department', e.target.value)}
        options={[{ value: '', label: 'All Departments' }, ...DEPARTMENTS.map((d) => ({ value: d, label: d }))]}
      />
      <Select
        id="priority-filter"
        className="w-40"
        value={filters.priority || ''}
        onChange={(e) => update('priority', e.target.value)}
        options={[{ value: '', label: 'All Priorities' }, ...PRIORITIES.map((p) => ({ value: p, label: p }))]}
      />
    </div>
  );
}
