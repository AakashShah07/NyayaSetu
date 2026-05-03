import Badge from './Badge';
import { PRIORITY_COLORS } from '../../utils/constants';
import { statusLabel } from '../../utils/formatters';

export default function PriorityBadge({ priority }) {
  return <Badge color={PRIORITY_COLORS[priority] || 'slate'}>{statusLabel(priority)}</Badge>;
}
