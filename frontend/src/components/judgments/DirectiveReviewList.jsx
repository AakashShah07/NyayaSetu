import { useState } from 'react';
import Card, { CardBody } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { updateDirective, deleteDirective } from '../../api/directives';
import { REVIEW_COLORS, DEPARTMENTS } from '../../utils/constants';
import { formatDate, statusLabel } from '../../utils/formatters';
import { CheckCircle, Pencil, Trash2, X, Save } from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

export default function DirectiveReviewList({ directives, onUpdated, showFilter = false }) {
  const [verifying, setVerifying] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleting, setDeleting] = useState(null);
  const [filterLowConf, setFilterLowConf] = useState(false);

  const handleVerify = async (id) => {
    setVerifying(id);
    try {
      await updateDirective(id, { reviewStatus: 'manually_verified' });
      toast.success('Directive verified');
      onUpdated?.();
    } catch {
      toast.error('Verification failed');
    } finally {
      setVerifying(null);
    }
  };

  const startEdit = (d) => {
    setEditing(d._id);
    setEditForm({
      directiveText: d.directiveText,
      responsibleDepartment: d.responsibleDepartment || 'General',
      deadline: d.deadline ? d.deadline.split('T')[0] : '',
      mainAction: d.mainAction || '',
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      const data = { ...editForm };
      if (data.deadline) data.deadline = new Date(data.deadline).toISOString();
      else delete data.deadline;
      await updateDirective(id, data);
      toast.success('Directive updated');
      setEditing(null);
      onUpdated?.();
    } catch {
      toast.error('Update failed');
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await deleteDirective(id);
      toast.success('Directive deleted');
      onUpdated?.();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  if (!directives || directives.length === 0) {
    return <p className="py-4 text-center text-sm text-slate-500">No directives extracted</p>;
  }

  const filtered = filterLowConf
    ? directives.filter((d) => d.confidence < 0.9 || d.reviewStatus === 'needs_review')
    : directives;

  return (
    <div className="space-y-3">
      {showFilter && (
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={filterLowConf}
            onChange={(e) => setFilterLowConf(e.target.checked)}
            className="rounded border-slate-300 text-navy focus:ring-navy"
          />
          Show only low-confidence / needs review
        </label>
      )}

      {filtered.map((d) => {
        const conf = d.confidence || 0;
        const confColor = conf < 0.7 ? 'bg-red-500' : conf < 0.9 ? 'bg-amber-500' : 'bg-green-500';
        const isEditing = editing === d._id;

        return (
          <Card key={d._id} className="border-l-4 border-l-navy">
            <CardBody>
              {isEditing ? (
                <div className="space-y-3">
                  <textarea
                    className="block w-full rounded-md border-slate-300 text-sm shadow-sm focus:border-navy focus:ring-navy dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
                    rows={3}
                    value={editForm.directiveText}
                    onChange={(e) => setEditForm({ ...editForm, directiveText: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Select
                      value={editForm.responsibleDepartment}
                      onChange={(e) => setEditForm({ ...editForm, responsibleDepartment: e.target.value })}
                      options={DEPARTMENTS}
                    />
                    <Input
                      type="date"
                      value={editForm.deadline}
                      onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSaveEdit(d._id)}>
                      <Save size={14} /> Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(null)}>
                      <X size={14} /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-800 dark:text-slate-100">{d.directiveText}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      {d.responsibleDepartment && <span>{d.responsibleDepartment}</span>}
                      {d.deadline && <span>Due: {formatDate(d.deadline)}</span>}
                      {d.deadlineText && <span className="italic">"{d.deadlineText}"</span>}
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <Badge color={REVIEW_COLORS[d.reviewStatus] || 'slate'}>
                        {statusLabel(d.reviewStatus)}
                      </Badge>
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-16 rounded-full bg-slate-200">
                          <div
                            className={clsx('h-2 rounded-full', confColor)}
                            style={{ width: `${Math.round(conf * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">{Math.round(conf * 100)}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button size="sm" variant="ghost" onClick={() => startEdit(d)}>
                      <Pencil size={14} />
                    </Button>
                    {d.reviewStatus !== 'manually_verified' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        loading={verifying === d._id}
                        onClick={() => handleVerify(d._id)}
                      >
                        <CheckCircle size={14} />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      loading={deleting === d._id}
                      onClick={() => { if (confirm('Delete this directive?')) handleDelete(d._id); }}
                      className="text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
