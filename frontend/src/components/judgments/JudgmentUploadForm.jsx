import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { uploadJudgment } from '../../api/judgments';
import { Upload, FileText, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function JudgmentUploadForm({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [caseId, setCaseId] = useState('');
  const [courtName, setCourtName] = useState('');
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !caseId) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('caseId', caseId);
    if (courtName) formData.append('courtName', courtName);

    setLoading(true);
    try {
      const res = await uploadJudgment(formData);
      toast.success('Judgment uploaded');
      onUploaded(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        {...getRootProps()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors ${
          isDragActive ? 'border-navy bg-blue-50' : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="flex items-center gap-3">
            <FileText size={24} className="text-navy" />
            <div>
              <p className="text-sm font-medium text-slate-800">{file.name}</p>
              <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <>
            <Upload size={32} className="mb-2 text-slate-400" />
            <p className="text-sm text-slate-600">
              Drag & drop a PDF here, or <span className="font-medium text-navy">browse</span>
            </p>
            <p className="mt-1 text-xs text-slate-400">PDF only, max 10 MB</p>
          </>
        )}
      </div>

      <Input
        id="caseId"
        label="Case ID *"
        value={caseId}
        onChange={(e) => setCaseId(e.target.value)}
        placeholder="e.g. W.P. No. 12345/2024"
        required
      />
      <Input
        id="courtName"
        label="Court Name"
        value={courtName}
        onChange={(e) => setCourtName(e.target.value)}
        placeholder="e.g. High Court of Karnataka"
      />
      <Button type="submit" loading={loading} disabled={!file || !caseId}>
        <Upload size={16} />
        Upload Judgment
      </Button>
    </form>
  );
}
