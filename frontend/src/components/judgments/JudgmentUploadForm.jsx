import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { uploadJudgment, bulkUploadJudgments } from '../../api/judgments';
import { Upload, FileText, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function JudgmentUploadForm({ onUploaded, onBulkUploaded }) {
  const [bulkMode, setBulkMode] = useState(false);
  // Single mode state
  const [file, setFile] = useState(null);
  const [caseId, setCaseId] = useState('');
  const [courtName, setCourtName] = useState('');
  // Bulk mode state
  const [files, setFiles] = useState([]);
  const [caseIds, setCaseIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((accepted) => {
    if (bulkMode) {
      setFiles((prev) => [...prev, ...accepted].slice(0, 10));
      setCaseIds((prev) => {
        const next = [...prev];
        accepted.forEach((f) => next.push(f.name.replace('.pdf', '')));
        return next.slice(0, 10);
      });
    } else if (accepted.length > 0) {
      setFile(accepted[0]);
    }
  }, [bulkMode]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 10 * 1024 * 1024,
    multiple: bulkMode,
  });

  const handleSingleSubmit = async (e) => {
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

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    caseIds.forEach((id) => formData.append('caseIds', id));

    setLoading(true);
    try {
      const res = await bulkUploadJudgments(formData);
      toast.success(`${res.data?.uploaded || 0} judgments uploaded`);
      onBulkUploaded?.(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Bulk upload failed');
    } finally {
      setLoading(false);
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setCaseIds((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={bulkMode}
            onChange={(e) => {
              setBulkMode(e.target.checked);
              setFile(null);
              setFiles([]);
              setCaseIds([]);
            }}
            className="rounded border-slate-300 text-navy focus:ring-navy"
          />
          Bulk Upload (multiple PDFs)
        </label>
      </div>

      <form onSubmit={bulkMode ? handleBulkSubmit : handleSingleSubmit} className="space-y-4">
        <div
          {...getRootProps()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors ${
            isDragActive ? 'border-navy bg-blue-50' : 'border-slate-300 hover:border-slate-400'
          }`}
        >
          <input {...getInputProps()} />
          {!bulkMode && file ? (
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
          ) : bulkMode && files.length > 0 ? (
            <p className="text-sm text-slate-600">{files.length} file(s) selected. Drop more or click to add.</p>
          ) : (
            <>
              <Upload size={32} className="mb-2 text-slate-400" />
              <p className="text-sm text-slate-600">
                Drag & drop {bulkMode ? 'PDFs (up to 10)' : 'a PDF'} here, or{' '}
                <span className="font-medium text-navy">browse</span>
              </p>
              <p className="mt-1 text-xs text-slate-400">PDF only, max 10 MB each</p>
            </>
          )}
        </div>

        {bulkMode && files.length > 0 && (
          <div className="space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-3 rounded border border-slate-200 px-3 py-2">
                <FileText size={16} className="shrink-0 text-slate-400" />
                <span className="w-40 truncate text-sm text-slate-600">{f.name}</span>
                <Input
                  className="flex-1"
                  value={caseIds[i] || ''}
                  onChange={(e) => {
                    const next = [...caseIds];
                    next[i] = e.target.value;
                    setCaseIds(next);
                  }}
                  placeholder="Case ID"
                />
                <button type="button" onClick={() => removeFile(i)} className="text-slate-400 hover:text-red-500">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {!bulkMode && (
          <>
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
          </>
        )}

        <Button
          type="submit"
          loading={loading}
          disabled={bulkMode ? files.length === 0 : !file || !caseId}
        >
          <Upload size={16} />
          {bulkMode ? `Upload ${files.length} Judgment(s)` : 'Upload Judgment'}
        </Button>
      </form>
    </div>
  );
}
