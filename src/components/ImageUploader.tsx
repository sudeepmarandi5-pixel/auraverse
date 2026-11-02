/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Upload, Link2, Check, X, AlertCircle, Loader2 } from 'lucide-react';
import { uploadImageFile } from '../services/storageService';

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
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setIsUploading(true);
    setProgress(0);

    try {
      const downloadUrl = await uploadImageFile(file, folder, (p) => {
        setProgress(p);
      });
      onChange(downloadUrl);
      setIsUploading(false);
      setProgress(100);
    } catch (err: any) {
      setIsUploading(false);
      setError(err.message || 'Failed to upload image');
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

  const aspectClass =
    aspectRatio === '16/9'
      ? 'aspect-[16/9]'
      : aspectRatio === '4/3'
      ? 'aspect-[4/3]'
      : aspectRatio === '1/1'
      ? 'aspect-square'
      : 'aspect-[3/4]';

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
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://images.unsplash.com/... or cloud storage URL"
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
                <div className="space-y-2 w-full max-w-xs py-2">
                  <div className="flex items-center justify-center gap-2 text-xs font-sans text-[#171717]">
                    <Loader2 className="w-4 h-4 animate-spin text-[#171717]" />
                    <span>Uploading image ({progress}%)...</span>
                  </div>
                  <div className="w-full bg-[#E8DFD3] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#171717] h-full transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full border border-[#D8C3A5] bg-white flex items-center justify-center mx-auto text-[#171717]">
                    <Upload className="w-4 h-4 stroke-[1.75]" />
                  </div>
                  <div className="text-xs font-sans text-[#171717]">
                    <span className="font-semibold underline decoration-[#D8C3A5] underline-offset-2">
                      Click to choose a file
                    </span>{' '}
                    or drag & drop here
                  </div>
                  <p className="text-[10px] font-sans uppercase tracking-[0.1em] text-[#171717]/60">
                    PNG, JPG, WebP up to 10MB
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Uploaded Preview State */
            <div className="relative border border-[#E8DFD3] p-2 bg-[#F5F0E8]/40 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-14 bg-white border border-[#E8DFD3] shrink-0 overflow-hidden ${aspectClass}`}
                >
                  <img
                    src={value}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-sans font-medium text-[#171717] block truncate">
                    Image uploaded successfully
                  </span>
                  <span className="text-[10px] font-sans text-emerald-700 flex items-center gap-1 mt-0.5">
                    <Check className="w-3 h-3" /> Ready in gallery
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 text-[10px] font-sans uppercase tracking-wider bg-white border border-[#D8C3A5] text-[#171717] hover:bg-[#F5F0E8] transition-colors cursor-pointer"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="p-1 text-[#171717]/50 hover:text-red-700 transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="text-[11px] font-sans text-red-600 flex items-center gap-1.5 pt-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {helperText && (
        <p className="text-[10px] font-sans text-[#171717]/50">{helperText}</p>
      )}
    </div>
  );
};
