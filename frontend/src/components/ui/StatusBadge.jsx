import Badge from './Badge';
import { STATUS_COLORS } from '../../utils/constants';
import { statusLabel } from '../../utils/formatters';

export default function StatusBadge({ status }) {
  return <Badge color={STATUS_COLORS[status] || 'slate'}>{statusLabel(status)}</Badge>;
}
