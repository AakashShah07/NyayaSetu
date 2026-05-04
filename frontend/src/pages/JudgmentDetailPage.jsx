import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Topbar from '../components/layout/Topbar';
import Card, { CardHeader, CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import DirectiveReviewList from '../components/judgments/DirectiveReviewList';
import CommentSection from '../components/comments/CommentSection';
import ExtractionProgress from '../components/judgments/ExtractionProgress';
import { getJudgment } from '../api/judgments';
import { getDirectives } from '../api/directives';
import { formatDate, statusLabel } from '../utils/formatters';
import { EXTRACTION_COLORS } from '../utils/constants';

export default function JudgmentDetailPage() {
  const { id } = useParams();
  const [judgment, setJudgment] = useState(null);
  const [directives, setDirectives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('directives');

  const fetchData = useCallback(async () => {
    try {
      const [jRes, dRes] = await Promise.all([
        getJudgment(id),
        getDirectives({ judgment: id, limit: 50 }),
      ]);
      setJudgment(jRes.data);
      setDirectives(dRes.data || []);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <>
        <Topbar title="Judgment Details" />
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      </>
    );
  }

  if (!judgment) {
    return (
      <>
        <Topbar title="Judgment Details" />
        <p className="py-20 text-center text-slate-500">Judgment not found</p>
      </>
    );
  }

  return (
    <>
      <Topbar title="Judgment Details" />
      <div className="space-y-6">
        <Card>
          <CardBody>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Case ID</p>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{judgment.caseId}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Court</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">{judgment.courtName || '—'}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Judgment Date</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">{formatDate(judgment.judgmentDate)}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Filing Date</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">{formatDate(judgment.filingDate)}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Judges</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">{judgment.judges?.join(', ') || '—'}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Parties</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {judgment.parties?.petitioner || '—'} v. {judgment.parties?.respondent || '—'}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Extraction Status</p>
                <Badge color={EXTRACTION_COLORS[judgment.extractionStatus] || 'slate'}>
                  {statusLabel(judgment.extractionStatus)}
                </Badge>
              </div>
              {judgment.originalFilename && (
                <div>
                  <p className="text-xs uppercase text-slate-500 dark:text-slate-400">PDF File</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{judgment.originalFilename}</p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {judgment.extractionStatus !== 'completed' && (
          <Card>
            <CardHeader><h3 className="text-sm font-semibold">Extraction</h3></CardHeader>
            <CardBody>
              <ExtractionProgress judgment={judgment} onComplete={fetchData} />
            </CardBody>
          </Card>
        )}

        <div>
          <div className="flex gap-4 border-b border-slate-200 dark:border-slate-700">
            {['directives'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
                  tab === t
                    ? 'border-navy text-navy'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Directives ({directives.length})
              </button>
            ))}
          </div>
          <div className="mt-4">
            <DirectiveReviewList directives={directives} onUpdated={fetchData} />
          </div>
        </div>

        {/* Comments */}
        <Card>
          <CardBody>
            <CommentSection entityType="judgment" entityId={id} />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
