import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/layout/Topbar';
import Card, { CardHeader, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import JudgmentUploadForm from '../components/judgments/JudgmentUploadForm';
import ExtractionProgress from '../components/judgments/ExtractionProgress';
import BulkExtractionProgress from '../components/judgments/BulkExtractionProgress';
import DirectiveReviewList from '../components/judgments/DirectiveReviewList';
import { getDirectives } from '../api/directives';
import { ArrowRight } from 'lucide-react';

export default function JudgmentUploadPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=upload, 2=extract, 3=review
  const [mode, setMode] = useState('single'); // 'single' or 'bulk'
  const [judgment, setJudgment] = useState(null);
  const [bulkJudgments, setBulkJudgments] = useState([]);
  const [directives, setDirectives] = useState([]);

  const handleUploaded = (j) => {
    setJudgment(j);
    setMode('single');
    setStep(2);
  };

  const handleBulkUploaded = (data) => {
    setBulkJudgments(data.judgments || []);
    setMode('bulk');
    setStep(2);
  };

  const handleExtractionComplete = async (result) => {
    if (result?.directives) {
      setDirectives(result.directives);
    } else if (judgment) {
      try {
        const res = await getDirectives({ judgment: judgment._id, limit: 50 });
        setDirectives(res.data || []);
      } catch { /* ignore */ }
    }
    setStep(3);
  };

  const handleBulkComplete = () => {
    navigate('/judgments');
  };

  const fetchDirectives = async () => {
    if (!judgment) return;
    try {
      const res = await getDirectives({ judgment: judgment._id, limit: 50 });
      setDirectives(res.data || []);
    } catch { /* ignore */ }
  };

  return (
    <>
      <Topbar title="Upload Judgment" />
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Steps indicator */}
        <div className="flex items-center gap-2 text-sm">
          {['Upload PDF', 'Extract Directives', 'Review'].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              {i > 0 && <ArrowRight size={14} className="text-slate-300" />}
              <span
                className={
                  step === i + 1
                    ? 'font-semibold text-navy'
                    : step > i + 1
                      ? 'text-green-600'
                      : 'text-slate-400'
                }
              >
                {i + 1}. {label}
              </span>
            </div>
          ))}
        </div>

        {step === 1 && (
          <Card>
            <CardHeader><h3 className="text-sm font-semibold text-slate-800">Upload Court Judgment PDF</h3></CardHeader>
            <CardBody>
              <JudgmentUploadForm onUploaded={handleUploaded} onBulkUploaded={handleBulkUploaded} />
            </CardBody>
          </Card>
        )}

        {step === 2 && mode === 'single' && judgment && (
          <Card>
            <CardHeader><h3 className="text-sm font-semibold text-slate-800">Extract Directives</h3></CardHeader>
            <CardBody>
              <p className="mb-4 text-sm text-slate-600">
                Judgment <strong>{judgment.caseId}</strong> uploaded. Run NLP extraction to identify directives and deadlines.
              </p>
              <ExtractionProgress judgment={judgment} onComplete={handleExtractionComplete} />
            </CardBody>
          </Card>
        )}

        {step === 2 && mode === 'bulk' && (
          <Card>
            <CardHeader><h3 className="text-sm font-semibold text-slate-800">Bulk Extraction Progress</h3></CardHeader>
            <CardBody>
              <p className="mb-4 text-sm text-slate-600">
                {bulkJudgments.length} judgments uploaded and queued for extraction.
              </p>
              <BulkExtractionProgress judgments={bulkJudgments} onAllComplete={handleBulkComplete} />
            </CardBody>
          </Card>
        )}

        {step === 3 && mode === 'single' && (
          <Card>
            <CardHeader><h3 className="text-sm font-semibold text-slate-800">Review Extracted Directives</h3></CardHeader>
            <CardBody>
              <DirectiveReviewList directives={directives} onUpdated={fetchDirectives} />
              <div className="mt-6 flex justify-end">
                <Button onClick={() => navigate(`/judgments/${judgment._id}`)}>
                  View Judgment Details
                  <ArrowRight size={16} />
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </>
  );
}
