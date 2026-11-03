/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ExternalLink, Trash2, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  wishlistIds: string[];
  onRemoveWishlist: (id: string) => void;
  onQuickView: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  products,
  wishlistIds,
  onRemoveWishlist,
  onQuickView,
}) => {
  if (!isOpen) return null;

  const savedProducts = products.filter((p) => wishlistIds.includes(p.id));
  const subtotal = savedProducts.reduce((sum, p) => sum + p.price, 0);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
    >
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-[#FFFFFF] w-full max-w-md h-full shadow-2xl z-10 flex flex-col justify-between border-l border-[#E8E2D9] animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#E8E2D9] flex items-center justify-between bg-[#FAF8F5]">
          <div>
            <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#7A7570] block mb-0.5">
              Personal Edit
            </span>
            <h2 className="font-serif text-2xl text-[#1A1A1A] font-normal">
              Saved Garments ({savedProducts.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#1A1A1A] hover:bg-[#F0EAE1] hover:text-[#8C7355] rounded-full transition-colors cursor-pointer"
            aria-label="Close wishlist drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Garment List */}
        <div className="p-6 flex-grow overflow-y-auto space-y-4">
          {savedProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#7A7570]">
              <span className="font-serif text-2xl text-[#1A1A1A] mb-2">
                Your wishlist is empty
              </span>
              <p className="text-xs font-sans tracking-[0.14em] uppercase text-[#888888] mb-6">
                Curate your seasonal wardrobe by clicking the heart icon on any piece.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-[#1A1A1A] text-[#FFFFFF] font-semibold text-xs font-sans tracking-[0.16em] uppercase hover:bg-[#333333] transition-colors cursor-pointer shadow-sm"
              >
                Browse The Edit
              </button>
            </div>
          ) : (
            savedProducts.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-[#FAF8F5] border border-[#E8E2D9] hover:border-[#C5A880] transition-colors flex gap-4 items-center"
              >
                <div
                  onClick={() => {
                    onClose();
                    onQuickView(item);
                  }}
                  className="w-16 h-20 bg-[#FFFFFF] border border-[#E8E2D9] shrink-0 overflow-hidden cursor-pointer"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-grow min-w-0">
                  <span className="text-[10px] font-sans tracking-[0.15em] uppercase text-[#7A7570] block mb-0.5">
                    {item.brand}
                  </span>
                  <h4
                    onClick={() => {
                      onClose();
                      onQuickView(item);
                    }}
                    className="font-serif text-base text-[#1A1A1A] font-normal truncate hover:text-[#8C7355] cursor-pointer"
                  >
                    {item.title}
                  </h4>
                  <span className="font-sans text-xs font-semibold tabular-nums text-[#1A1A1A] mt-1 block">
                    ${item.price.toFixed(2)}
                  </span>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() => onRemoveWishlist(item.id)}
                    className="p-1.5 text-[#888888] hover:text-red-500 transition-colors cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={item.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-[#1A1A1A] hover:text-[#8C7355] hover:bg-[#F0EAE1] rounded transition-colors"
                    title="View on Amazon"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout */}
        {savedProducts.length > 0 && (
          <div className="p-6 bg-[#FAF8F5] border-t border-[#E8E2D9] space-y-4">
            <div className="flex items-center justify-between text-xs font-sans tracking-[0.16em] uppercase">
              <span className="text-[#7A7570]">Curated Total Estimate</span>
              <span className="font-semibold text-sm tabular-nums text-[#1A1A1A]">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <p className="text-[11px] font-sans text-[#777777] leading-tight">
              Individual pieces link directly to verified Amazon stores with Prime shipping options.
            </p>

            <button
              onClick={onClose}
              className="w-full py-3.5 bg-[#1A1A1A] text-[#FFFFFF] hover:bg-[#333333] text-xs font-sans tracking-[0.18em] uppercase font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
