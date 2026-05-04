import { Download } from 'lucide-react';
import Button from '../ui/Button';

export default function ExportButton({ onClick, disabled }) {
  return (
    <Button onClick={onClick} disabled={disabled} variant="primary" size="sm">
      <Download size={16} className="mr-1.5" />
      Export PDF
    </Button>
  );
}
