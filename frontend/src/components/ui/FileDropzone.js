import React, { useMemo, useRef, useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';

function formatBytes(bytes = 0) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
  return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
}

function FileDropzone({
  label,
  hint = 'PDF or image. Drag & drop or click to upload.',
  accept = 'application/pdf,image/*',
  value,
  onChange,
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const fileMeta = useMemo(() => {
    if (!value) return null;
    return { name: value.name, size: value.size, type: value.type };
  }, [value]);

  const setFile = (file) => {
    onChange?.(file || null);
  };

  return (
    <div>
      {label ? <div className="text-sm font-medium text-gray-700 mb-2">{label}</div> : null}

      <div
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all duration-200 cursor-pointer ${
          dragOver 
            ? 'border-indigo-400 bg-indigo-50/50 scale-[1.02]' 
            : 'border-gray-300 bg-gray-50/30 hover:bg-gray-50 hover:border-gray-400'
        }`}
        onClick={() => !fileMeta && inputRef.current?.click()}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!fileMeta) setDragOver(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!fileMeta) setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragOver(false);
          if (fileMeta) return;
          const file = e.dataTransfer.files?.[0];
          if (file) setFile(file);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        {!fileMeta ? (
          <div className="text-center">
            <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full transition-colors ${dragOver ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
              <UploadCloud className="h-7 w-7" />
            </div>
            <p className="mt-4 text-sm font-semibold text-gray-900">
              <span className="text-indigo-600 hover:underline">Click to upload</span> or drag and drop
            </p>
            <p className="mt-1 text-xs text-gray-500">{hint}</p>
          </div>
        ) : (
          <div className="w-full">
            <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">{fileMeta.name}</p>
                  <p className="text-xs font-medium text-gray-500">{formatBytes(fileMeta.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileDropzone;
