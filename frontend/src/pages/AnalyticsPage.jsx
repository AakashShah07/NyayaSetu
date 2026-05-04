import { useState, useEffect, useCallback } from 'react';
import Topbar from '../components/layout/Topbar';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import ComplianceChart from '../components/analytics/ComplianceChart';
import TasksByStatusChart from '../components/analytics/TasksByStatusChart';
import DepartmentBarChart from '../components/analytics/DepartmentBarChart';
import { getOverview, getComplianceRate, getDepartmentPerformance } from '../api/analytics';

export default function AnalyticsPage() {
  const [overview, setOverview] = useState(null);
  const [compliance, setCompliance] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ovRes, compRes, deptRes] = await Promise.all([
        getOverview(),
        getComplianceRate(6),
        getDepartmentPerformance(),
      ]);
      setOverview(ovRes.data.data);
      setCompliance(compRes.data.data);
      setDepartments(deptRes.data.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <>
        <Topbar title="Analytics" />
        <div className="mt-20 flex justify-center"><Spinner /></div>
      </>
    );
  }

  return (
    <>
      <Topbar title="Analytics" />
      <div className="mt-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard label="Total Tasks" value={overview?.totalTasks || 0} />
          <SummaryCard label="Completed" value={overview?.byStatus?.completed || 0} color="text-emerald-600" />
          <SummaryCard label="Overdue" value={overview?.byStatus?.overdue || 0} color="text-red-600" />
          <SummaryCard label="Directives" value={overview?.totalDirectives || 0} color="text-blue-600" />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <div className="p-4">
              <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Compliance Rate (6 months)</h3>
              <ComplianceChart data={compliance} />
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Tasks by Status</h3>
              <TasksByStatusChart byStatus={overview?.byStatus || {}} />
            </div>
          </Card>
        </div>

        {/* Department chart */}
        <Card>
          <div className="p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Department Performance</h3>
            <DepartmentBarChart data={departments} />
          </div>
        </Card>
      </div>
    </>
  );
}

function SummaryCard({ label, value, color = 'text-gray-900 dark:text-white' }) {
  return (
    <Card>
      <div className="p-4 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
      </div>
    </Card>
  );
}
