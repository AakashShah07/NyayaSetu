import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { DEPARTMENTS } from '../../utils/constants';
import { getUsers } from '../../api/users';
import toast from 'react-hot-toast';
import client from '../../api/client';

export default function ReassignModal({ isOpen, onClose, task, onReassigned }) {
  const [department, setDepartment] = useState(task?.department || 'General');
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo?._id || '');
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && department) {
      getUsers({ department, limit: 100 })
        .then((res) => setOfficers(res.data || []))
        .catch(() => setOfficers([]));
    }
  }, [isOpen, department]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await client.put(`/api/tasks/${task._id}/reassign`, { department, assignedTo: assignedTo || undefined });
      toast.success('Task reassigned');
      onReassigned?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reassignment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reassign Task">
      <div className="space-y-4">
        <Select
          id="reassign-dept"
          label="Department"
          value={department}
          onChange={(e) => { setDepartment(e.target.value); setAssignedTo(''); }}
          options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
        />
        <Select
          id="reassign-officer"
          label="Assign To (optional)"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          options={[
            { value: '', label: 'Unassigned' },
            ...officers.map((u) => ({ value: u._id, label: `${u.name} (${u.role})` })),
          ]}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button loading={loading} onClick={handleSubmit}>Reassign</Button>
        </div>
      </div>
    </Modal>
  );
}
