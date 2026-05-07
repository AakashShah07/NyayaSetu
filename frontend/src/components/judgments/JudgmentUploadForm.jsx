import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { uploadJudgment, bulkUploadJudgments } from '../../api/judgments';
import {
  Upload,
  FileText,
  X,
  CloudUpload,
  File,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

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
    <div className="space-y-6">
      {/* Mode toggle */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => {
            setBulkMode(false);
            setFile(null);
            setFiles([]);
            setCaseIds([]);
          }}
          className={`group relative flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
            !bulkMode
              ? 'bg-gradient-to-r from-navy to-navy-light text-white shadow-lg shadow-navy/25'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700/50 dark:text-slate-400 dark:hover:bg-slate-700'
          }`}
        >
          <Upload size={16} className={!bulkMode ? 'anim-icon-bounce' : ''} />
          Single Upload
          {!bulkMode && (
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            setBulkMode(true);
            setFile(null);
            setFiles([]);
            setCaseIds([]);
          }}
          className={`group relative flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
            bulkMode
              ? 'bg-gradient-to-r from-navy to-navy-light text-white shadow-lg shadow-navy/25'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700/50 dark:text-slate-400 dark:hover:bg-slate-700'
          }`}
        >
          <Layers size={16} className={bulkMode ? 'anim-icon-bounce' : ''} />
          Bulk Upload
          {bulkMode && (
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          )}
        </button>
      </div>

      <form onSubmit={bulkMode ? handleBulkSubmit : handleSingleSubmit} className="space-y-6">
        {/* Drop zone */}
        <div
          {...getRootProps()}
          className={`group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed p-8 transition-all duration-500 ${
            isDragActive
              ? 'border-accent bg-gradient-to-br from-accent/5 via-navy/5 to-accent/5 shadow-xl shadow-accent/10 scale-[1.01] dark:from-accent/10 dark:via-navy/10 dark:to-accent/10'
              : !bulkMode && file
                ? 'border-emerald-400/60 bg-gradient-to-br from-emerald-50/50 to-white dark:border-emerald-500/30 dark:from-emerald-900/10 dark:to-slate-800/50'
                : 'border-slate-300/80 bg-gradient-to-br from-slate-50/50 to-white hover:border-navy/40 hover:from-navy/[0.02] hover:to-accent/[0.02] hover:shadow-lg dark:border-slate-600/50 dark:from-slate-800/30 dark:to-slate-800/50 dark:hover:border-navy-light/40'
          }`}
        >
          {/* Background decorative gradient orbs */}
          <div className={`pointer-events-none absolute -top-16 -right-16 h-32 w-32 rounded-full blur-3xl transition-opacity duration-500 ${
            isDragActive ? 'opacity-60 bg-accent/30' : 'opacity-0 bg-navy/20'
          }`} />
          <div className={`pointer-events-none absolute -bottom-16 -left-16 h-32 w-32 rounded-full blur-3xl transition-opacity duration-500 ${
            isDragActive ? 'opacity-40 bg-navy/20' : 'opacity-0 bg-accent/20'
          }`} />

          <input {...getInputProps()} />

          {!bulkMode && file ? (
            /* Single file selected state */
            <div className="relative flex items-center gap-5">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/25">
                <FileText size={28} />
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
                  <CheckCircle2 size={14} />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-bold text-slate-800 dark:text-slate-200" title={file.name}>
                  {file.name}
                </p>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  {formatFileSize(file.size)} -- PDF Document
                </p>
                {loading && (
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-navy via-navy-light to-accent"
                      style={{ animation: 'upload-progress 2s ease-in-out infinite', width: '100%' }}
                    />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500 hover:scale-110 dark:bg-slate-700 dark:hover:bg-red-900/30 dark:hover:text-red-400"
              >
                <X size={16} />
              </button>
            </div>
          ) : bulkMode && files.length > 0 ? (
            /* Bulk mode - files present, invite more */
            <div className="relative flex flex-col items-center py-2 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-navy/10 to-accent/10 dark:from-navy/20 dark:to-accent/20">
                <Layers size={26} className="text-navy dark:text-blue-400" />
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                <span className="text-navy dark:text-blue-400">{files.length}</span> file{files.length !== 1 ? 's' : ''} selected
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Drop more files or <span className="font-semibold text-navy dark:text-blue-400">browse</span> to add (up to 10)
              </p>
            </div>
          ) : (
            /* Empty state */
            <div className="relative flex flex-col items-center py-4 text-center">
              <div className={`mb-5 flex h-20 w-20 items-center justify-center rounded-3xl transition-all duration-500 ${
                isDragActive
                  ? 'bg-gradient-to-br from-accent/20 to-navy/20 scale-110 dark:from-accent/30 dark:to-navy/30'
                  : 'bg-gradient-to-br from-slate-100 to-slate-50 group-hover:from-navy/10 group-hover:to-accent/10 dark:from-slate-700/50 dark:to-slate-800/50 dark:group-hover:from-navy/20 dark:group-hover:to-accent/20'
              }`}>
                <CloudUpload
                  size={36}
                  className={`transition-all duration-500 ${
                    isDragActive
                      ? 'text-accent scale-110 anim-icon-bounce'
                      : 'text-slate-400 group-hover:text-navy dark:text-slate-500 dark:group-hover:text-blue-400'
                  }`}
                />
              </div>
              <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
                {isDragActive ? (
                  <span className="text-accent">Drop your file{bulkMode ? 's' : ''} here</span>
                ) : (
                  <>
                    Drag & drop {bulkMode ? 'PDFs' : 'a PDF'} here, or{' '}
                    <span className="text-navy dark:text-blue-400">browse</span>
                  </>
                )}
              </p>
              <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                PDF only, max 10 MB{bulkMode ? ' each (up to 10 files)' : ''}
              </p>
              {isDragActive && (
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent dark:bg-accent/20">
                  <Sparkles size={12} className="anim-icon-bounce" />
                  Release to upload
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bulk file list */}
        {bulkMode && files.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Queued Files ({files.length}/10)
            </p>
            {files.map((f, i) => (
              <div
                key={i}
                className="group/card relative flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-gradient-to-r from-white to-slate-50/50 px-4 py-3.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700/50 dark:from-slate-800/50 dark:to-slate-800/30"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* File icon */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-md shadow-red-500/20">
                  <File size={18} />
                </div>
                {/* File info */}
                <div className="min-w-0 shrink-0 w-36">
                  <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-300" title={f.name}>
                    {f.name}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{formatFileSize(f.size)}</p>
                </div>
                {/* Case ID input */}
                <div className="flex-1">
                  <Input
                    value={caseIds[i] || ''}
                    onChange={(e) => {
                      const next = [...caseIds];
                      next[i] = e.target.value;
                      setCaseIds(next);
                    }}
                    placeholder="Case ID"
                    className="[&_input]:rounded-xl [&_input]:border-slate-200 [&_input]:bg-white/80 [&_input]:transition-all [&_input]:duration-300 focus-within:[&_input]:border-navy focus-within:[&_input]:ring-2 focus-within:[&_input]:ring-navy/20 dark:[&_input]:border-slate-600 dark:[&_input]:bg-slate-700/50"
                  />
                </div>
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-300 transition-all duration-300 hover:bg-red-50 hover:text-red-500 hover:scale-110 dark:text-slate-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                >
                  <X size={16} />
                </button>
              </div>
            ))}

            {/* Upload progress for bulk */}
            {loading && (
              <div className="overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-700/50">
                <div
                  className="h-2 rounded-xl bg-gradient-to-r from-navy via-accent to-navy-light"
                  style={{ animation: 'upload-progress 2s ease-in-out infinite', width: '100%' }}
                />
              </div>
            )}
          </div>
        )}

        {/* Single mode form fields */}
        {!bulkMode && (
          <div className="space-y-5">
            <div className="group/input">
              <Input
                id="caseId"
                label="Case ID *"
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                placeholder="e.g. W.P. No. 12345/2024"
                required
                className="[&_label]:font-semibold [&_label]:text-slate-700 [&_label]:dark:text-slate-300 [&_input]:rounded-xl [&_input]:border-slate-200 [&_input]:bg-white/80 [&_input]:px-4 [&_input]:py-3 [&_input]:transition-all [&_input]:duration-300 focus-within:[&_input]:border-navy focus-within:[&_input]:ring-2 focus-within:[&_input]:ring-navy/20 focus-within:[&_input]:shadow-lg focus-within:[&_input]:shadow-navy/5 dark:[&_input]:border-slate-600 dark:[&_input]:bg-slate-700/50"
              />
            </div>
            <div className="group/input">
              <Input
                id="courtName"
                label="Court Name"
                value={courtName}
                onChange={(e) => setCourtName(e.target.value)}
                placeholder="e.g. High Court of Karnataka"
                className="[&_label]:font-semibold [&_label]:text-slate-700 [&_label]:dark:text-slate-300 [&_input]:rounded-xl [&_input]:border-slate-200 [&_input]:bg-white/80 [&_input]:px-4 [&_input]:py-3 [&_input]:transition-all [&_input]:duration-300 focus-within:[&_input]:border-navy focus-within:[&_input]:ring-2 focus-within:[&_input]:ring-navy/20 focus-within:[&_input]:shadow-lg focus-within:[&_input]:shadow-navy/5 dark:[&_input]:border-slate-600 dark:[&_input]:bg-slate-700/50"
              />
            </div>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading || (bulkMode ? files.length === 0 : !file || !caseId)}
          className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-navy to-navy-light px-8 py-4 text-base font-bold text-white shadow-xl shadow-navy/25 transition-all duration-300 hover:shadow-2xl hover:shadow-navy/30 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-xl"
        >
          {/* Shimmer effect on hover */}
          <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

          {loading ? (
            <>
              <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload size={18} />
              <span>{bulkMode ? `Upload ${files.length} Judgment${files.length !== 1 ? 's' : ''}` : 'Upload Judgment'}</span>
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      {/* Inline keyframes for upload progress animation */}
      <style>{`
        @keyframes upload-progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
