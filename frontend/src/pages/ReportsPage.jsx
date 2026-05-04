import { useState, useCallback } from 'react';
import Topbar from '../components/layout/Topbar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import ReportPreview from '../components/reports/ReportPreview';
import ExportButton from '../components/reports/ExportButton';
import { getDepartmentReport } from '../api/reports';
import { exportDepartmentReport } from '../utils/pdfExport';
import { DEPARTMENTS } from '../utils/constants';

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

  const handleExport = () => {
    if (report) exportDepartmentReport(report);
  };

  return (
    <>
      <Topbar title="Compliance Reports" />
      <div className="mt-6 space-y-5">
        {/* Filters */}
        <Card>
          <div className="p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Report Configuration</h3>
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="rounded-md border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">All Departments</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="rounded-md border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="rounded-md border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <Button onClick={generateReport} disabled={loading} variant="primary" size="sm">
                {loading ? 'Generating...' : 'Generate Report'}
              </Button>
              {report && <ExportButton onClick={handleExport} />}
            </div>
          </div>
        </Card>

        {/* Preview */}
        {loading && <div className="flex justify-center py-10"><Spinner /></div>}
        {report && !loading && (
          <Card>
            <div className="p-4">
              <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                Report: {report.department}
              </h3>
              <ReportPreview report={report} type="department" />
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
