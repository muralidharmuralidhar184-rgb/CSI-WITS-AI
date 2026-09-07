import React, { useState, useRef } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import type { UploadedFile } from '../types';

interface UploadModalProps {
  onClose: () => void;
  onFilesSelected: (files: UploadedFile[]) => void;
  currentFiles: UploadedFile[];
}

export default function UploadModal({
  onClose,
  onFilesSelected,
  currentFiles
}: UploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILES = 9;
  const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

  const validateFiles = (files: File[]): { valid: File[]; error?: string } => {
    if (currentFiles.length + files.length > MAX_FILES) {
      return {
        valid: [],
        error: `Max files exceeded. You can upload up to ${MAX_FILES} files.`
      };
    }

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return {
          valid: [],
          error: 'File too large. Maximum file size is 500 MB.'
        };
      }
    }

    return { valid: files };
  };

  const handleFileSelect = async (files: File[]) => {
    setError('');
    const validation = validateFiles(files);

    if (validation.error) {
      setError(validation.error);
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      validation.valid.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Upload failed');
        return;
      }

      const data = await response.json();
      const uploadedFiles: UploadedFile[] = data.files.map((file: any) => ({
        id: file.id,
        originalName: file.originalName,
        filename: file.filename,
        mimeType: file.mimeType,
        size: file.size,
        status: 'success' as const
      }));

      onFilesSelected([...currentFiles, ...uploadedFiles]);
      onClose();
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(Array.from(e.dataTransfer.files));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(Array.from(e.target.files));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--surface)] rounded-lg max-w-md w-full p-6 border border-[var(--border)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Upload Study Materials</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg"
            aria-label="Close upload modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Info */}
        <p className="text-sm text-[var(--text-muted)] mb-4">
          Upload up to {MAX_FILES - currentFiles.length} more file(s). Max 500 MB per file.
        </p>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-2">
            <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Drag and drop area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragging
              ? 'border-[var(--button-primary)] bg-[var(--bg-secondary)]'
              : 'border-[var(--border)]'
          }`}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Drop files here or click to select"
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              fileInputRef.current?.click();
            }
          }}
        >
          <Upload size={32} className="mx-auto mb-2 opacity-70" />
          <p className="font-medium">Drag files here</p>
          <p className="text-sm text-[var(--text-muted)]">or click to select</p>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
            accept=".pdf,.txt,.csv,.json,.md,.docx,.xlsx,.pptx,.png,.jpg,.jpeg"
            disabled={isUploading}
            aria-label="Select files to upload"
          />
        </div>

        {/* Current files list */}
        {currentFiles.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <p className="text-sm font-medium mb-2">Attached Files ({currentFiles.length}/{MAX_FILES})</p>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {currentFiles.map((file) => (
                <div
                  key={file.id}
                  className="text-sm p-2 bg-[var(--bg-secondary)] rounded flex items-center justify-between"
                >
                  <span className="truncate">{file.originalName}</span>
                  <span className="text-xs text-[var(--text-muted)] ml-2">
                    {(file.size / 1024 / 1024).toFixed(1)}MB
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors min-h-[44px]"
            disabled={isUploading}
          >
            Close
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 p-3 rounded-lg bg-[var(--button-primary)] text-[var(--button-primary-text)] hover:opacity-90 transition-opacity min-h-[44px]"
            disabled={isUploading || currentFiles.length >= MAX_FILES}
          >
            {isUploading ? 'Uploading...' : 'Add Files'}
          </button>
        </div>
      </div>
    </div>
  );
}
