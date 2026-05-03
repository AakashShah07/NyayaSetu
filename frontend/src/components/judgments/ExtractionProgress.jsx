import { useState, useEffect, useRef } from 'react';
import Spinner from '../ui/Spinner';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import ManualTextEntry from './ManualTextEntry';
import { getJudgment } from '../../api/judgments';
import { extractDirectives, extractDirectivesFromText } from '../../api/nlp';
import { EXTRACTION_COLORS } from '../../utils/constants';
import { statusLabel } from '../../utils/formatters';
import { Zap, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const ERROR_MESSAGES = {
  INVALID_PDF: 'This PDF appears to be corrupt or unreadable. Please re-upload or enter text manually.',
  NLP_TIMEOUT: 'Extraction timed out. The document may be too large. Try again or enter text manually.',
  NLP_SERVICE_ERROR: 'Extraction service is temporarily unavailable. Please try again later.',
  FILE_NOT_FOUND: 'The uploaded file could not be found. Please re-upload the PDF.',
  EXTRACTION_ERROR: 'An unexpected error occurred during extraction.',
};

export default function ExtractionProgress({ judgment, onComplete }) {
  const [status, setStatus] = useState(judgment.extractionStatus);
  const [errorCode, setErrorCode] = useState(judgment.extractionError);
  const [extracting, setExtracting] = useState(false);
  const [result, setResult] = useState(null);
  const [showManual, setShowManual] = useState(false);
  const intervalRef = useRef(null);

  const startPolling = () => {
    intervalRef.current = setInterval(async () => {
      try {
        const res = await getJudgment(judgment._id);
        const s = res.data.extractionStatus;
        setStatus(s);
        setErrorCode(res.data.extractionError);
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
    setShowManual(false);
    try {
      const res = await extractDirectives(judgment._id);
      setResult(res.data);
      setStatus('completed');
      setErrorCode(null);
      toast.success(`Extracted ${res.data?.directivesFound || 0} directives`);
      onComplete?.(res.data);
    } catch (err) {
      setStatus('failed');
      const code = err.response?.data?.data?.extractionError || 'EXTRACTION_ERROR';
      setErrorCode(code);
      toast.error(err.response?.data?.message || 'Extraction failed');
      startPolling();
    } finally {
      setExtracting(false);
    }
  };

  const handleManualComplete = (data) => {
    setResult(data);
    setStatus('completed');
    setShowManual(false);
    setErrorCode(null);
    onComplete?.(data);
  };

  const errorMsg = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.EXTRACTION_ERROR;
  const showManualFallback = status === 'failed' && ['INVALID_PDF', 'NLP_TIMEOUT', 'EXTRACTION_ERROR'].includes(errorCode);

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
          {errorMsg}
        </div>
      )}

      {result && status === 'completed' && (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Found {result.directivesFound} directives, created {result.tasksCreated} tasks.
          {result.needsReview > 0 && ` ${result.needsReview} need review.`}
        </div>
      )}

      {(status === 'pending' || status === 'failed') && (
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleExtract} loading={extracting}>
            <Zap size={16} />
            {status === 'failed' ? 'Retry Extraction' : 'Extract Directives'}
          </Button>
          {showManualFallback && (
            <Button variant="secondary" onClick={() => setShowManual(!showManual)}>
              <FileText size={16} />
              Enter Text Manually
            </Button>
          )}
        </div>
      )}

      {showManual && (
        <ManualTextEntry
          judgmentId={judgment._id}
          extractFn={extractDirectivesFromText}
          onComplete={handleManualComplete}
        />
      )}
    </div>
  );
}
