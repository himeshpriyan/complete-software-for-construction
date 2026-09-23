import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image, FileSpreadsheet, Trash2, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface UploadedMockFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
}

interface FileUploadDropzoneProps {
  label?: string;
  description?: string;
  accept?: string;
  maxFiles?: number;
  initialFiles?: UploadedMockFile[];
  onFilesChange?: (files: UploadedMockFile[]) => void;
  className?: string;
}

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  label = 'Upload Supporting Documents or Drawings',
  description = 'Drag and drop PDF, DWG, DXF, XLSX, or JPG files up to 25MB',
  maxFiles = 5,
  initialFiles = [],
  onFilesChange,
  className,
}) => {
  const [files, setFiles] = useState<UploadedMockFile[]>(initialFiles);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFilesAdded = (fileNames: string[]) => {
    const newItems: UploadedMockFile[] = fileNames.slice(0, maxFiles - files.length).map((name) => {
      const ext = name.split('.').pop()?.toLowerCase() || 'doc';
      const fakeSizes = ['1.2 MB', '4.8 MB', '850 KB', '14.5 MB', '3.1 MB'];
      return {
        id: `FILE-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name,
        size: fakeSizes[Math.floor(Math.random() * fakeSizes.length)],
        type: ext,
        uploadedAt: 'Just now',
      };
    });

    const updated = [...files, ...newItems];
    setFiles(updated);
    if (onFilesChange) onFilesChange(updated);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const names = Array.from(e.dataTransfer.files).map((f) => f.name);
      handleFilesAdded(names);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const names = Array.from(e.target.files).map((f) => f.name);
      handleFilesAdded(names);
    }
  };

  const removeFile = (id: string) => {
    const updated = files.filter((f) => f.id !== id);
    setFiles(updated);
    if (onFilesChange) onFilesChange(updated);
  };

  const renderFileIcon = (type: string) => {
    if (['jpg', 'jpeg', 'png', 'webp'].includes(type)) {
      return <Image className="h-5 w-5 text-sky-600" />;
    }
    if (['xlsx', 'xls', 'csv'].includes(type)) {
      return <FileSpreadsheet className="h-5 w-5 text-emerald-600" />;
    }
    return <FileText className="h-5 w-5 text-amber-600" />;
  };

  return (
    <div className={cn('space-y-3', className)}>
      {label && <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">{label}</label>}

      {/* Drop Target Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all duration-150 flex flex-col items-center justify-center',
          isDragging
            ? 'border-amber-500 bg-amber-50/50'
            : 'border-slate-300 hover:border-amber-500 hover:bg-slate-50/60 bg-white'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileInput}
        />
        <div className="p-2.5 bg-slate-100 rounded-full text-slate-600 mb-2">
          <UploadCloud className="h-6 w-6 text-amber-600" />
        </div>
        <p className="text-xs font-semibold text-slate-800">
          Click to upload or drag files here
        </p>
        <p className="text-[11px] text-slate-400 mt-1 max-w-xs">{description}</p>
      </div>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="space-y-2 pt-1">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Attached Documents ({files.length})
          </p>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg bg-white overflow-hidden">
            {files.map((file) => (
              <div
                key={file.id}
                className="px-3.5 py-2.5 flex items-center justify-between gap-3 text-xs hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 bg-slate-50 rounded border border-slate-100 flex-shrink-0">
                    {renderFileIcon(file.type)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-800 truncate">{file.name}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>{file.size}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-emerald-600">
                        <CheckCircle2 className="h-3 w-3" /> Ready
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded transition-colors"
                  title="Remove file"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
