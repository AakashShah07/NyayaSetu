import { useState } from 'react';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { TASK_STATUSES } from '../../utils/constants';
import { updateTask } from '../../api/tasks';
import toast from 'react-hot-toast';

export default function TaskStatusUpdateForm({ task, onUpdated }) {
  const [status, setStatus] = useState(task.status);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === task.status && !notes) return;
    setLoading(true);
    try {
      await updateTask(task._id, { status, notes });
      toast.success('Task updated');
      setNotes('');
      onUpdated();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Select
        id="task-status"
        label="Update Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        options={TASK_STATUSES.map((s) => ({ value: s, label: s.replace(/_/g, ' ') }))}
      />
      <div>
        <label htmlFor="notes" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="block w-full rounded-md border-slate-300 shadow-sm focus:border-navy focus:ring-navy sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
          placeholder="Add a note about this update..."
        />
      </div>
      <Button type="submit" loading={loading} size="sm">
        Update Task
      </Button>
    </form>
  );
}
