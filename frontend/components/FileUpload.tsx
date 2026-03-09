/**
 * File upload component with drag & drop
 */
'use client';

import { useCallback, useState } from 'react';
import { Mode } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Upload, X, File } from 'lucide-react';

interface FileUploadProps {
  mode: Mode;
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function FileUpload({ mode, onFileSelect, disabled = false }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const acceptedTypes = mode === 'image' 
    ? '.jpg,.jpeg,.png' 
    : '.mp4';

  const validateFile = useCallback((file: File): boolean => {
    const validTypes = mode === 'image' 
      ? ['image/jpeg', 'image/jpg', 'image/png']
      : ['video/mp4'];
    
    return validTypes.includes(file.type);
  }, [mode]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  }, [disabled, onFileSelect, validateFile]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  }, [onFileSelect, validateFile]);

  const clearFile = () => {
    setSelectedFile(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Upload {mode === 'image' ? 'Image' : 'Video'}</label>
      
      <Card
        className={[
          'relative border border-dashed transition-all duration-200 bg-white/[0.02]',
          isDragging
            ? 'border-primary/60 bg-primary/5 shadow-[0_0_16px_oklch(0.72_0.19_220_/_0.12)]'
            : selectedFile
              ? 'border-primary/30 bg-primary/[0.04]'
              : 'border-white/10 hover:border-primary/25',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        ].join(' ')}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {selectedFile ? (
          /* ── File selected: compact single-line pill ── */
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/15 shrink-0">
              <File className="h-3 w-3 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate leading-none">{selectedFile.name}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{formatFileSize(selectedFile.size)}</p>
            </div>
            <button
              onClick={clearFile}
              disabled={disabled}
              className="shrink-0 w-5 h-5 flex items-center justify-center rounded-md text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          /* ── Empty: compact drop zone ── */
          <div className="flex items-center gap-2.5 px-3 py-3">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 border border-primary/15 shrink-0">
              <Upload className="h-3.5 w-3.5 text-primary/70" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium leading-none">Drop {mode === 'image' ? 'image' : 'video'} or click to browse</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{acceptedTypes}</p>
            </div>
            <input
              type="file"
              accept={acceptedTypes}
              onChange={handleFileChange}
              disabled={disabled}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
          </div>
        )}
      </Card>
    </div>
  );
}
