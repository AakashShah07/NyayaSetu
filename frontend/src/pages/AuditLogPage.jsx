import { useState, useEffect, useCallback } from 'react';
import Topbar from '../components/layout/Topbar';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import Pagination from '../components/ui/Pagination';
import AuditFilters from '../components/audit/AuditFilters';
import AuditLogTable from '../components/audit/AuditLogTable';
import { getAuditLogs } from '../api/auditLogs';

export default function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [filters, setFilters] = useState({ entity: '', action: '', startDate: '', endDate: '' });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, limit: 30 };
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      const res = await getAuditLogs(params);
      setLogs(res.data.data || []);
      if (res.data.pagination) setPagination((p) => ({ ...p, pages: res.data.pagination.pages }));
    } finally {
      setLoading(false);
    }
  }, [pagination.page, filters]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  return (
    <>
      <Topbar title="Audit Log" />
      <div className="mt-6 space-y-5">
        <Card>
          <div className="p-4">
            <AuditFilters filters={filters} onChange={(f) => { setFilters(f); setPagination((p) => ({ ...p, page: 1 })); }} />
          </div>
        </Card>

        <Card>
          <div className="p-4">
            {loading ? (
              <div className="flex justify-center py-10"><Spinner /></div>
            ) : (
              <AuditLogTable logs={logs} />
            )}
          </div>
        </Card>

        {pagination.pages > 1 && (
          <Pagination
            page={pagination.page}
            pages={pagination.pages}
            onPageChange={(p) => setPagination((prev) => ({ ...prev, page: p }))}
          />
        )}
      </div>
    </>
  );
}
