import { useState, useEffect, useCallback } from 'react';
import Topbar from '../components/layout/Topbar';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Select from '../components/ui/Select';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import { getUsers, updateUser } from '../api/users';
import { ROLES, DEPARTMENTS } from '../utils/constants';
import { Users } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ role: '', department: '', isActive: true });
  const [saving, setSaving] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUsers({ limit: 100 });
      setUsers(res.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const openEdit = (user) => {
    setEditing(user);
    setForm({ role: user.role, department: user.department, isActive: user.isActive });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUser(editing._id, form);
      toast.success('User updated');
      setEditing(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Topbar title="User Management" />
      <Card>
        {loading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : users.length === 0 ? (
          <EmptyState icon={Users} message="No users found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Active</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-800">{u.name}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{u.email}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Badge color={u.role === 'admin' ? 'purple' : 'blue'}>{u.role?.replace('_', ' ')}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{u.department}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Badge color={u.isActive ? 'green' : 'red'}>{u.isActive ? 'Active' : 'Inactive'}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Button size="sm" variant="secondary" onClick={() => openEdit(u)}>Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={`Edit ${editing?.name}`}>
        <div className="space-y-4">
          <Select
            id="edit-role"
            label="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            options={ROLES.map((r) => ({ value: r, label: r.replace('_', ' ') }))}
          />
          <Select
            id="edit-dept"
            label="Department"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="edit-active"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="rounded border-slate-300 text-navy focus:ring-navy"
            />
            <label htmlFor="edit-active" className="text-sm text-slate-700">Active</label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
            <Button loading={saving} onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
