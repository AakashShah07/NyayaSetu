import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/layout/Topbar';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Select from '../components/ui/Select';
import Spinner from '../components/ui/Spinner';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import { getDirectives } from '../api/directives';
import { usePagination } from '../hooks/usePagination';
import { formatDate, truncate, statusLabel } from '../utils/formatters';
import { DEPARTMENTS, REVIEW_STATUSES, REVIEW_COLORS } from '../utils/constants';
import { FileText } from 'lucide-react';

export default function DirectivesListPage() {
  const navigate = useNavigate();
  const { page, setPage } = usePagination();
  const [filters, setFilters] = useState({ department: '', reviewStatus: '' });
  const [data, setData] = useState({ items: [], pagination: null });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20, sort: '-createdAt' };
      if (filters.department) params.department = filters.department;
      if (filters.reviewStatus) params.reviewStatus = filters.reviewStatus;
      const res = await getDirectives(params);
      setData({ items: res.data || [], pagination: res.pagination });
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <>
      <Topbar title="Directives" />
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Select
            id="dept-filter"
            className="w-40"
            value={filters.department}
            onChange={(e) => { setFilters({ ...filters, department: e.target.value }); setPage(1); }}
            options={[{ value: '', label: 'All Departments' }, ...DEPARTMENTS.map((d) => ({ value: d, label: d }))]}
          />
          <Select
            id="review-filter"
            className="w-44"
            value={filters.reviewStatus}
            onChange={(e) => { setFilters({ ...filters, reviewStatus: e.target.value }); setPage(1); }}
            options={[{ value: '', label: 'All Review Statuses' }, ...REVIEW_STATUSES.map((s) => ({ value: s, label: statusLabel(s) }))]}
          />
        </div>

        <Card>
          {loading ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : data.items.length === 0 ? (
            <EmptyState icon={FileText} message="No directives found" />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Directive</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Deadline</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Confidence</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Review</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {data.items.map((d) => (
                      <tr
                        key={d._id}
                        className="cursor-pointer hover:bg-slate-50"
                        onClick={() => d.judgment && navigate(`/judgments/${typeof d.judgment === 'string' ? d.judgment : d.judgment._id}`)}
                      >
                        <td className="px-6 py-4 text-sm text-slate-800">{truncate(d.directiveText, 80)}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{d.responsibleDepartment || '—'}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{formatDate(d.deadline)}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                          {d.confidence != null ? `${Math.round(d.confidence * 100)}%` : '—'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <Badge color={REVIEW_COLORS[d.reviewStatus] || 'slate'}>
                            {statusLabel(d.reviewStatus)}
                          </Badge>
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
    </>
  );
}
