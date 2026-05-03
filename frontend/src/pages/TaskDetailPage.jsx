import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Topbar from '../components/layout/Topbar';
import Card, { CardHeader, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import PriorityBadge from '../components/ui/PriorityBadge';
import Spinner from '../components/ui/Spinner';
import TaskStatusTimeline from '../components/tasks/TaskStatusTimeline';
import TaskStatusUpdateForm from '../components/tasks/TaskStatusUpdateForm';
import ReassignModal from '../components/admin/ReassignModal';
import { useAuth } from '../context/AuthContext';
import { getTask } from '../api/tasks';
import { getStatusUpdates } from '../api/statusUpdates';
import { formatDate, daysUntilDue } from '../utils/formatters';
import { UserPlus, Flame } from 'lucide-react';
import Badge from '../components/ui/Badge';
import client from '../api/client';
import toast from 'react-hot-toast';
import clsx from 'clsx';

export default function TaskDetailPage() {
  const { id } = useParams();
  const { hasRole } = useAuth();
  const [task, setTask] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReassign, setShowReassign] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [taskRes, updatesRes] = await Promise.all([
        getTask(id),
        getStatusUpdates({ task: id, sort: '-createdAt', limit: 50 }),
      ]);
      setTask(taskRes.data);
      setUpdates(updatesRes.data || []);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <>
        <Topbar title="Task Details" />
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      </>
    );
  }

  if (!task) {
    return (
      <>
        <Topbar title="Task Details" />
        <p className="py-20 text-center text-slate-500">Task not found</p>
      </>
    );
  }

  const days = daysUntilDue(task.dueDate);

  return (
    <>
      <Topbar title="Task Details" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardBody>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{task.title}</h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <StatusBadge status={task.status} />
                    <PriorityBadge priority={task.priority} />
                    {task.department && (
                      <span className="text-sm text-slate-500 dark:text-slate-400">{task.department}</span>
                    )}
                    {task.escalationLevel > 0 && (
                      <Badge color="red">
                        <Flame size={12} className="mr-1 inline" />
                        Escalation Level {task.escalationLevel}
                      </Badge>
                    )}
                    {hasRole('admin') && (
                      <>
                        <Button size="sm" variant="ghost" onClick={() => setShowReassign(true)}>
                          <UserPlus size={14} /> Reassign
                        </Button>
                        {task.status !== 'completed' && task.escalationLevel < 3 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:bg-red-50"
                            onClick={async () => {
                              try {
                                await client.put(`/api/tasks/${task._id}`, { escalationLevel: (task.escalationLevel || 0) + 1 });
                                toast.success('Task escalated');
                                fetchData();
                              } catch { toast.error('Escalation failed'); }
                            }}
                          >
                            <Flame size={14} /> Escalate
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Due: {formatDate(task.dueDate)}</p>
                  {days !== null && task.status !== 'completed' && (
                    <p
                      className={clsx(
                        'text-sm font-medium',
                        days < 0 ? 'text-red-600' : days <= 7 ? 'text-amber-600' : 'text-green-600'
                      )}
                    >
                      {days < 0 ? `${Math.abs(days)} days overdue` : days === 0 ? 'Due today' : `${days} days remaining`}
                    </p>
                  )}
                </div>
              </div>
              {task.description && (
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{task.description}</p>
              )}
            </CardBody>
          </Card>

          {task.judgment && (
            <Card>
              <CardHeader><h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Linked Judgment</h3></CardHeader>
              <CardBody>
                <Link to={`/judgments/${typeof task.judgment === 'string' ? task.judgment : task.judgment._id}`} className="text-sm text-blue-600 hover:underline">
                  {task.judgment.caseId || 'View Judgment'}
                </Link>
              </CardBody>
            </Card>
          )}

          {task.evidenceFiles?.length > 0 && (
            <Card>
              <CardHeader><h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Evidence Files</h3></CardHeader>
              <CardBody>
                <ul className="space-y-1">
                  {task.evidenceFiles.map((f, i) => (
                    <li key={i}>
                      <a href={f.fileUrl} className="text-sm text-blue-600 hover:underline">{f.fileName}</a>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Update Status</h3></CardHeader>
            <CardBody>
              <TaskStatusUpdateForm task={task} onUpdated={fetchData} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Status History</h3></CardHeader>
            <CardBody>
              <TaskStatusTimeline updates={updates} />
            </CardBody>
          </Card>
        </div>
      </div>

      {task && (
        <ReassignModal
          isOpen={showReassign}
          onClose={() => setShowReassign(false)}
          task={task}
          onReassigned={fetchData}
        />
      )}
    </>
  );
}
