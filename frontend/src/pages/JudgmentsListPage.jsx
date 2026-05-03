import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/layout/Topbar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDeleteModal from '../components/admin/ConfirmDeleteModal';
import { getJudgments, deleteJudgment } from '../api/judgments';
import { extractDirectives } from '../api/nlp';
import { useAuth } from '../context/AuthContext';
import { usePagination } from '../hooks/usePagination';
import { formatDate, statusLabel } from '../utils/formatters';
import { EXTRACTION_COLORS } from '../utils/constants';
import { Scale, Upload, Zap, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function JudgmentsListPage() {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const { page, setPage } = usePagination();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [data, setData] = useState({ items: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [extractingId, setExtractingId] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getJudgments({ page, limit: 20, sort: '-createdAt' });
      setData({ items: res.data || [], pagination: res.pagination });
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleExtract = async (e, id) => {
    e.stopPropagation();
    setExtractingId(id);
    try {
      const res = await extractDirectives(id);
      toast.success(`Extracted ${res.data?.directivesFound || 0} directives`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Extraction failed');
    } finally {
      setExtractingId(null);
    }
  };

  return (
    <>
      <Topbar title="Court Orders" />
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => navigate('/judgments/upload')}>
            <Upload size={16} />
            Upload Judgment
          </Button>
        </div>
        <Card>
          {loading ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : data.items.length === 0 ? (
            <EmptyState icon={Scale} message="No judgments uploaded yet" />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Case ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Court</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Judgment Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Extraction</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {data.items.map((j) => (
                      <tr
                        key={j._id}
                        className="cursor-pointer hover:bg-slate-50"
                        onClick={() => navigate(`/judgments/${j._id}`)}
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-800">{j.caseId}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{j.courtName || '—'}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{formatDate(j.judgmentDate)}</td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <Badge color={EXTRACTION_COLORS[j.extractionStatus] || 'slate'}>
                            {statusLabel(j.extractionStatus)}
                          </Badge>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex gap-1">
                            {j.extractionStatus !== 'completed' && (
                              <Button
                                size="sm"
                                variant="secondary"
                                loading={extractingId === j._id}
                                onClick={(e) => handleExtract(e, j._id)}
                              >
                                <Zap size={14} />
                                Extract
                              </Button>
                            )}
                            {hasRole('admin') && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-500 hover:bg-red-50"
                                onClick={(e) => { e.stopPropagation(); setDeleteTarget(j); }}
                              >
                                <Trash2 size={14} />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                page={data.pagination?.page || 1}
                pages={data.pagination?.pages || 1}
                total={data.pagination?.total || 0}
                onPageChange={setPage}
              />
            </>
          )}
        </Card>
      </div>

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        loading={deleting}
        title="Delete Judgment"
        message={`Delete "${deleteTarget?.caseId}"? This will also delete all associated directives and tasks.`}
        onConfirm={async () => {
          setDeleting(true);
          try {
            await deleteJudgment(deleteTarget._id);
            toast.success('Judgment deleted');
            setDeleteTarget(null);
            fetchData();
          } catch (err) {
            toast.error(err.response?.data?.message || 'Delete failed');
          } finally {
            setDeleting(false);
          }
        }}
      />
    </>
  );
}
