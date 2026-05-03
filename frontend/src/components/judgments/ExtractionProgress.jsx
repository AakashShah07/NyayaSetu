import { useState, useEffect, useRef } from 'react';
import Spinner from '../ui/Spinner';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { getJudgment } from '../../api/judgments';
import { extractDirectives } from '../../api/nlp';
import { EXTRACTION_COLORS } from '../../utils/constants';
import { statusLabel } from '../../utils/formatters';
import { Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ExtractionProgress({ judgment, onComplete }) {
  const [status, setStatus] = useState(judgment.extractionStatus);
  const [extracting, setExtracting] = useState(false);
  const [result, setResult] = useState(null);
  const intervalRef = useRef(null);

  const startPolling = () => {
    intervalRef.current = setInterval(async () => {
      try {
        const res = await getJudgment(judgment._id);
        const s = res.data.extractionStatus;
        setStatus(s);
        if (s === 'completed' || s === 'failed') {
          clearInterval(intervalRef.current);
          if (s === 'completed') onComplete?.(res.data);
        }
      } catch {
        clearInterval(intervalRef.current);
      }
    }, 3000);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const handleExtract = async () => {
    setExtracting(true);
    setStatus('processing');
    try {
      const res = await extractDirectives(judgment._id);
      setResult(res.data);
      setStatus('completed');
      toast.success(`Extracted ${res.data?.directivesFound || 0} directives`);
      onComplete?.(res.data);
    } catch (err) {
      setStatus('failed');
      toast.error(err.response?.data?.message || 'Extraction failed');
      // Start polling in case extraction is still running server-side
      startPolling();
    } finally {
      setExtracting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-600">Extraction Status:</span>
        <Badge color={EXTRACTION_COLORS[status] || 'slate'}>{statusLabel(status)}</Badge>
      </div>

      {status === 'processing' && (
        <div className="flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3">
          <Spinner size="sm" />
          <p className="text-sm text-blue-700">Extracting text and analyzing directives...</p>
        </div>
      )}

      {status === 'failed' && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          Extraction failed. You can try again.
        </div>
      )}

      {result && status === 'completed' && (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Found {result.directivesFound} directives, created {result.tasksCreated} tasks.
          {result.needsReview > 0 && ` ${result.needsReview} need review.`}
        </div>
      )}

      {(status === 'pending' || status === 'failed') && (
        <Button onClick={handleExtract} loading={extracting}>
          <Zap size={16} />
          {status === 'failed' ? 'Retry Extraction' : 'Extract Directives'}
        </Button>
      )}
    </div>
  );
}
