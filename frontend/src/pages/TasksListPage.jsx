import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Topbar from '../components/layout/Topbar';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskTable from '../components/tasks/TaskTable';
import Pagination from '../components/ui/Pagination';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { getTasks } from '../api/tasks';
import { usePagination } from '../hooks/usePagination';

export default function TasksListPage() {
  const [searchParams] = useSearchParams();
  const { page, setPage } = usePagination();
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    department: searchParams.get('department') || '',
    priority: searchParams.get('priority') || '',
  });
  const [data, setData] = useState({ tasks: [], pagination: null });
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20, sort: 'dueDate' };
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      const res = await getTasks(params);
      setData({ tasks: res.data || [], pagination: res.pagination });
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <>
      <Topbar title="Tasks" />
      <div className="space-y-4">
        <TaskFilters filters={filters} onChange={handleFilterChange} />
        <Card>
          {loading ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : (
            <>
              <TaskTable tasks={data.tasks} />
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
