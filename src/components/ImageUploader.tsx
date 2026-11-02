/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  Upload,
  Link2,
  Check,
  X,
  AlertCircle,
  Loader2,
  Cloud,
  RefreshCw,
} from 'lucide-react';
import {
  uploadImageFile,
  deleteImageFromStorage,
  isFirebaseStorageUrl,
  type UploadProgressDetails,
} from '../services/storageService';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  aspectRatio?: '3/4' | '4/3' | '16/9' | '1/1';
  helperText?: string;
  required?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChange,
  folder = 'products',
  aspectRatio = '3/4',
  helperText,
  required = false,
}) => {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [progressDetails, setProgressDetails] = useState<UploadProgressDetails>({
    progress: 0,
    bytesTransferred: 0,
    totalBytes: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setIsUploading(true);
    setProgressDetails({ progress: 0, bytesTransferred: 0, totalBytes: file.size });

    try {
      // If there was an existing image in Firebase Storage and we are replacing it,
      // we can clean up the old one
      const previousUrl = value;

      const downloadUrl = await uploadImageFile(file, folder, (details) => {
        setProgressDetails(details);
      });

      // Update with new download URL
      onChange(downloadUrl);
      setIsUploading(false);
      setProgressDetails({ progress: 100, bytesTransferred: file.size, totalBytes: file.size });

      // Clean up previous image from storage if it belonged to our bucket
      if (previousUrl && previousUrl !== downloadUrl && isFirebaseStorageUrl(previousUrl)) {
        deleteImageFromStorage(previousUrl).catch(() => {});
      }
    } catch (err: any) {
      setIsUploading(false);
      setError(err?.message || 'Failed to upload image to Firebase Storage.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = async () => {
    if (value && isFirebaseStorageUrl(value)) {
      // Safely delete from Firebase Storage
      deleteImageFromStorage(value).catch((err) =>
        console.warn('Could not delete storage image on remove:', err)
      );
    }
    onChange('');
    setError(null);
  };

  const aspectClass =
    aspectRatio === '16/9'
      ? 'aspect-[16/9]'
      : aspectRatio === '4/3'
      ? 'aspect-[4/3]'
      : aspectRatio === '1/1'
      ? 'aspect-square'
      : 'aspect-[3/4]';

  const isStoredInFirebase = isFirebaseStorageUrl(value);

  // Helper to format bytes
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-[10px] tracking-[0.14em] uppercase text-[#171717]/80 font-semibold">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        {/* Mode Toggle: File Upload vs URL */}
        <div className="flex items-center gap-2 text-[10px] font-sans tracking-wider uppercase">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded-2xs transition-colors cursor-pointer ${
              mode === 'upload'
                ? 'bg-[#171717] text-white font-medium'
                : 'text-[#171717]/60 hover:text-[#171717]'
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded-2xs transition-colors cursor-pointer ${
              mode === 'url'
                ? 'bg-[#171717] text-white font-medium'
                : 'text-[#171717]/60 hover:text-[#171717]'
            }`}
          >
            Paste URL
          </button>
        </div>
      </div>

      {/* URL Mode */}
      {mode === 'url' && (
        <div className="space-y-2">
          <div className="relative flex items-center">
            <Link2 className="w-3.5 h-3.5 text-[#171717]/40 absolute left-3 pointer-events-none" />
            <input
              type="url"
              value={value}
              onChange={(e) => {
                setError(null);
                onChange(e.target.value);
              }}
              placeholder="https://firebasestorage.googleapis.com/... or https://images.unsplash.com/..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#E8DFD3] text-xs font-sans text-[#171717] focus:outline-none focus:border-[#171717]"
            />
          </div>
        </div>
      )}

      {/* Upload File Mode */}
      {mode === 'upload' && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/avif, image/gif"
            onChange={handleInputChange}
            className="hidden"
          />

          {!value || isUploading ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xs p-6 text-center cursor-pointer transition-colors duration-150 flex flex-col items-center justify-center ${
                isDragging
                  ? 'border-[#171717] bg-[#F5F0E8]'
                  : 'border-[#D8C3A5] bg-[#F5F0E8]/40 hover:bg-[#F5F0E8]'
              }`}
            >
              {isUploading ? (
                <div className="space-y-3 w-full max-w-xs py-2 text-center">
                  <div className="flex items-center justify-center gap-2 text-xs font-sans text-[#171717] font-medium">
                    <Loader2 className="w-4 h-4 animate-spin text-[#171717]" />
                    <span>Uploading to Firebase Storage ({progressDetails.progress}%)...</span>
                  </div>

                  <div className="w-full bg-[#E8DFD3] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#171717] h-full transition-all duration-150"
                      style={{ width: `${progressDetails.progress}%` }}
                    />
                  </div>

                  <div className="text-[10px] font-sans text-[#171717]/60 flex items-center justify-between">
                    <span>
                      {formatBytes(progressDetails.bytesTransferred)} of{' '}
                      {formatBytes(progressDetails.totalBytes)}
                    </span>
                    <span>Saving to /{folder}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full border border-[#D8C3A5] bg-white flex items-center justify-center mx-auto text-[#171717] shadow-2xs">
                    <Upload className="w-4 h-4 stroke-[1.75]" />
                  </div>
                  <div className="text-xs font-sans text-[#171717]">
                    <span className="font-semibold underline decoration-[#D8C3A5] underline-offset-2">
                      Choose an image file
                    </span>{' '}
                    or drag & drop
                  </div>
                  <p className="text-[10px] font-sans uppercase tracking-[0.1em] text-[#171717]/60">
                    PNG, JPG, WebP up to 10MB · Stored in Firebase Storage
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Uploaded Preview State */
            <div className="relative border border-[#E8DFD3] p-2.5 bg-[#F5F0E8]/40 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-14 bg-white border border-[#E8DFD3] shrink-0 overflow-hidden shadow-2xs ${aspectClass}`}
                >
                  <img
                    src={value}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => {
                      setError('Could not preview image. Please verify file format or storage rules.');
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-sans font-medium text-[#171717] truncate block">
                      Image attached
                    </span>
                    {isStoredInFirebase && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 text-[9px] font-sans uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xs">
                        <Cloud className="w-2.5 h-2.5" />
                        <span>Firebase Storage</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-sans text-[#171717]/70 flex items-center gap-1 mt-0.5 truncate">
                    <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate">Ready to save in catalog</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 text-[10px] font-sans uppercase tracking-wider bg-white border border-[#D8C3A5] text-[#171717] hover:bg-[#F5F0E8] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Replace</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-1 text-[#171717]/50 hover:text-red-700 transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error alert with retry */}
      {error && (
        <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 text-[11px] font-sans flex items-start justify-between gap-2">
          <div className="flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-600 mt-0.5" />
            <div className="leading-snug">{error}</div>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-900 text-[10px] uppercase font-semibold cursor-pointer shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {helperText && !error && (
        <p className="text-[10px] font-sans text-[#171717]/50">{helperText}</p>
      )}
    </div>
  );
};
