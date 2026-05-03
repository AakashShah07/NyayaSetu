import { useState } from 'react';
import Card, { CardBody } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { updateDirective } from '../../api/directives';
import { REVIEW_COLORS } from '../../utils/constants';
import { formatDate, statusLabel, truncate } from '../../utils/formatters';
import { CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DirectiveReviewList({ directives, onUpdated }) {
  const [verifying, setVerifying] = useState(null);

  const handleVerify = async (id) => {
    setVerifying(id);
    try {
      await updateDirective(id, { reviewStatus: 'manually_verified' });
      toast.success('Directive verified');
      onUpdated?.();
    } catch (err) {
      toast.error('Verification failed');
    } finally {
      setVerifying(null);
    }
  };

  if (!directives || directives.length === 0) {
    return <p className="py-4 text-center text-sm text-slate-500">No directives extracted</p>;
  }

  return (
    <div className="space-y-3">
      {directives.map((d) => (
        <Card key={d._id} className="border-l-4 border-l-navy">
          <CardBody>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-800">{truncate(d.directiveText, 200)}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  {d.responsibleDepartment && <span>{d.responsibleDepartment}</span>}
                  {d.deadline && <span>Due: {formatDate(d.deadline)}</span>}
                  {d.deadlineText && <span className="italic">"{d.deadlineText}"</span>}
                  <span>Confidence: {Math.round((d.confidence || 0) * 100)}%</span>
                </div>
                <div className="mt-2">
                  <Badge color={REVIEW_COLORS[d.reviewStatus] || 'slate'}>
                    {statusLabel(d.reviewStatus)}
                  </Badge>
                </div>
              </div>
              {d.reviewStatus !== 'manually_verified' && (
                <Button
                  size="sm"
                  variant="secondary"
                  loading={verifying === d._id}
                  onClick={() => handleVerify(d._id)}
                >
                  <CheckCircle size={14} />
                  Verify
                </Button>
              )}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
