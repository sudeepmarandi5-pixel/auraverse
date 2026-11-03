/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Check, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3200);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom duration-200">
      <div className="bg-[#1A1A1A] text-[#FFFFFF] px-5 py-3 border border-[#C5A880] shadow-xl flex items-center gap-3">
        <div className="w-5 h-5 rounded-full bg-[#C5A880] text-[#1A1A1A] flex items-center justify-center shrink-0">
          <Check className="w-3 h-3 stroke-[2.5]" />
        </div>
        <span className="font-sans text-xs tracking-[0.14em] uppercase font-semibold">
          {message}
        </span>
        <button
          onClick={onClose}
          className="p-1 text-[#8E8E8E] hover:text-white ml-2 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
