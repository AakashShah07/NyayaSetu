import { useState, useCallback, useEffect } from 'react';
import Topbar from '../components/layout/Topbar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import ReportPreview from '../components/reports/ReportPreview';
import ExportButton from '../components/reports/ExportButton';
import { getDepartmentReport } from '../api/reports';
import { exportDepartmentReport } from '../utils/pdfExport';
import { DEPARTMENTS } from '../utils/constants';
import {
  FileBarChart,
  Filter,
  Building2,
  CalendarRange,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export default function ReportsPage() {
  const [department, setDepartment] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateReport = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (department) params.department = department;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const res = await getDepartmentReport(params);
      setReport(res.data.data);
    } finally {
      setLoading(false);
    }
  }, [department, startDate, endDate]);

  // Auto-generate report on page load
  useEffect(() => {
    generateReport();
  }, []);

  const handleExport = () => {
    if (report) exportDepartmentReport(report);
  };

  return (
    <>
      <Topbar title="Compliance Reports" />
      <div className="mt-6 space-y-6">

        {/* ── Config Panel ── */}
        <Card className="overflow-hidden">
          <div className="border-b border-slate-200/60 bg-gradient-to-r from-navy/5 to-transparent px-6 py-4 dark:border-slate-700/50 dark:from-navy/10">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-navy to-navy-light text-white shadow-sm">
                <Filter size={16} />
              </div>
              <div>
                <h3
                  className="text-sm font-bold text-slate-800 dark:text-white"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Report Configuration
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Filter by department and date range, or generate for all data
                </p>
              </div>
            </div>
          </div>
          <div className="px-6 py-5">
            <div className="flex flex-wrap items-end gap-4">
              {/* Department */}
              <div className="min-w-[180px] flex-1">
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <Building2 size={13} />
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-xl border-slate-300 px-3.5 py-2.5 text-sm shadow-sm focus:border-navy focus:ring-navy dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value="">All Departments</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              {/* Start Date */}
              <div className="min-w-[160px] flex-1">
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <CalendarRange size={13} />
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl border-slate-300 px-3.5 py-2.5 text-sm shadow-sm focus:border-navy focus:ring-navy dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>
              {/* End Date */}
              <div className="min-w-[160px] flex-1">
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <CalendarRange size={13} />
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-xl border-slate-300 px-3.5 py-2.5 text-sm shadow-sm focus:border-navy focus:ring-navy dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>
              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={generateReport}
                  disabled={loading}
                  variant="primary"
                  size="md"
                  className="rounded-xl bg-gradient-to-r from-navy to-navy-light px-5 shadow-md shadow-navy/20 hover:shadow-lg hover:shadow-navy/30 transition-all"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={15} />
                      Generate Report
                    </>
                  )}
                </Button>
                {report && <ExportButton onClick={handleExport} />}
              </div>
            </div>
          </div>
        </Card>

        {/* ── Loading ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Spinner size="lg" label="Generating report..." />
          </div>
        )}

        {/* ── Report Results ── */}
        {report && !loading && (
          <Card className="overflow-hidden">
            <div className="border-b border-slate-200/60 bg-gradient-to-r from-emerald-500/5 to-transparent px-6 py-4 dark:border-slate-700/50 dark:from-emerald-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-sm">
                    <FileBarChart size={16} />
                  </div>
                  <div>
                    <h3
                      className="text-sm font-bold text-slate-800 dark:text-white"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {report.department || 'All Departments'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {report.summary?.total || report.summary?.totalTasks || 0} tasks found
                    </p>
                  </div>
                </div>
                <ExportButton onClick={handleExport} />
              </div>
            </div>
            <div className="p-6">
              <ReportPreview report={report} type="department" />
            </div>
          </Card>
        )}

        {/* ── Empty state (only if not loading and no report yet) ── */}
        {!report && !loading && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 py-20 dark:border-slate-700">
            <FileBarChart size={48} className="mb-4 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              No report data available. Click Generate Report to begin.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
