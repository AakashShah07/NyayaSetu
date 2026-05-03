import { useState } from 'react';
import Button from '../ui/Button';
import { FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManualTextEntry({ judgmentId, onComplete, extractFn }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await extractFn(judgmentId, text);
      toast.success(`Extracted ${res.data?.directivesFound || 0} directives from text`);
      onComplete?.(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Text extraction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="manual-text" className="mb-1 block text-sm font-medium text-slate-700">
          Paste judgment text manually
        </label>
        <textarea
          id="manual-text"
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="block w-full rounded-md border-slate-300 shadow-sm focus:border-navy focus:ring-navy sm:text-sm"
          placeholder="Paste the full court judgment text here..."
        />
      </div>
      <Button type="submit" loading={loading} disabled={!text.trim()}>
        <FileText size={16} />
        Extract from Text
      </Button>
    </form>
  );
}
