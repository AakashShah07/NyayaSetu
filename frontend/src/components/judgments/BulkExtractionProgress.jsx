import { useState, useEffect, useRef } from 'react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import { getQueueStatus } from '../../api/nlp';
import { EXTRACTION_COLORS } from '../../utils/constants';
import { statusLabel, formatDateTime } from '../../utils/formatters';

export default function BulkExtractionProgress({ judgments, onAllComplete }) {
  const [queue, setQueue] = useState(null);
  const [allDone, setAllDone] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await getQueueStatus();
        setQueue(res.data);
        if (res.data.queueLength === 0 && !res.data.processing) {
          setAllDone(true);
          clearInterval(intervalRef.current);
        }
      } catch { /* ignore */ }
    };

    poll();
    intervalRef.current = setInterval(poll, 3000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="space-y-4">
      {!allDone && (
        <div className="flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3">
          <Spinner size="sm" />
          <p className="text-sm text-blue-700">
            Processing {queue?.queueLength || 0} remaining in queue...
          </p>
        </div>
      )}

      {allDone && (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          All extractions complete. {queue?.completed || 0} succeeded, {queue?.failed || 0} failed.
        </div>
      )}

      {queue?.jobs && queue.jobs.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-slate-500">Judgment</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-slate-500">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-slate-500">Error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {queue.jobs.map((job, i) => (
                <tr key={job.judgmentId || i}>
                  <td className="whitespace-nowrap px-4 py-2 text-slate-700">
                    {job.judgmentId?.slice(-8) || '—'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2">
                    <Badge color={EXTRACTION_COLORS[job.status] || 'slate'}>
                      {statusLabel(job.status)}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-slate-500">
                    {job.error || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {allDone && (
        <Button onClick={onAllComplete}>Review Results</Button>
      )}
    </div>
  );
}
