/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, ExternalLink, Heart, Share2, Star, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onShowToast: (msg: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onShowToast,
}) => {
  if (!isOpen || !product) return null;

  const [activeImage, setActiveImage] = useState<string>(product.imageUrl);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    onShowToast('Product link copied to clipboard');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200"
    >
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog Content Container */}
      <div className="relative bg-white w-full max-w-4xl border border-[#E8DFD3] shadow-2xl z-10 overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 border border-[#E8DFD3] text-[#171717] hover:bg-[#F5F0E8] transition-colors z-20 cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Left Column: Image Presentation Gallery */}
          <div className="md:col-span-6 bg-[#F5F0E8] p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E8DFD3]">
            <div className="relative aspect-[3/4] w-full bg-white border border-[#E8DFD3] overflow-hidden mb-4">
              <img
                src={activeImage}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>

            {/* Thumbnail selector if secondary image exists */}
            {product.secondaryImageUrl && (
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setActiveImage(product.imageUrl)}
                  className={`w-16 h-20 border bg-white overflow-hidden cursor-pointer transition-all ${
                    activeImage === product.imageUrl
                      ? 'border-[#171717] ring-1 ring-[#171717]'
                      : 'border-[#E8DFD3] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={product.imageUrl}
                    alt="Main angle"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
                <button
                  onClick={() => setActiveImage(product.secondaryImageUrl!)}
                  className={`w-16 h-20 border bg-white overflow-hidden cursor-pointer transition-all ${
                    activeImage === product.secondaryImageUrl
                      ? 'border-[#171717] ring-1 ring-[#171717]'
                      : 'border-[#E8DFD3] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={product.secondaryImageUrl}
                    alt="Secondary angle"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Garment Details & Actions */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between bg-white space-y-6">
            <div>
              {/* Category & Brand Header */}
              <div className="flex items-center gap-2 text-xs font-sans tracking-[0.2em] text-[#171717]/60 uppercase mb-2">
                <span>{product.brand}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#171717] font-semibold">{product.category}</span>
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-3xl text-[#171717] font-normal leading-tight mb-3">
                {product.title}
              </h2>

              {/* Price & Rating */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DFD3]">
                <div className="flex items-baseline gap-3">
                  <span className="font-sans text-2xl font-bold tabular-nums text-[#171717]">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="font-sans text-sm line-through tabular-nums text-[#171717]/50">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#171717]">
                  <div className="flex items-center text-[#171717]">
                    <Star className="w-3.5 h-3.5 fill-[#171717]" />
                  </div>
                  <span className="font-semibold tabular-nums">{product.rating}</span>
                  <span className="text-[#171717]/60">({product.reviewCount} customer reviews)</span>
                </div>
              </div>

              {/* Description */}
              <div className="pt-4 space-y-4">
                <div>
                  <h4 className="text-xs font-sans tracking-[0.16em] uppercase text-[#171717] font-semibold mb-1.5">
                    Garment Description
                  </h4>
                  <p className="font-sans text-sm text-[#171717]/80 leading-relaxed font-light">
                    {product.description}
                  </p>
                </div>

                {/* Fabrication & Fit Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F5F0E8] p-4 border border-[#E8DFD3]">
                  <div>
                    <span className="text-[10px] font-sans tracking-[0.18em] uppercase text-[#171717]/60 block mb-1">
                      Fabrication
                    </span>
                    <span className="text-xs font-sans text-[#171717] font-medium block">
                      {product.material}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-sans tracking-[0.18em] uppercase text-[#171717]/60 block mb-1">
                      Fit & Sizing
                    </span>
                    <span className="text-xs font-sans text-[#171717] font-medium block">
                      {product.fitDetails}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions & Affiliate Button */}
            <div className="space-y-4 pt-4 border-t border-[#E8DFD3]">
              {/* Primary Action: Black "Shop on Amazon" button */}
              <a
                href={product.amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-[#171717] text-white hover:bg-[#D8C3A5] hover:text-[#171717] text-xs font-sans tracking-[0.2em] uppercase font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Shop on Amazon</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* Secondary Actions: Beige button & share */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className="py-2.5 px-4 bg-white text-[#171717] border border-[#D8C3A5] hover:bg-[#F5F0E8] text-xs font-sans tracking-[0.14em] uppercase font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      isWishlisted ? 'fill-[#171717] text-[#171717]' : 'text-[#171717]'
                    }`}
                  />
                  <span>{isWishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="py-2.5 px-4 bg-white text-[#171717] border border-[#D8C3A5] hover:bg-[#F5F0E8] text-xs font-sans tracking-[0.14em] uppercase font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Link Copied' : 'Share Piece'}</span>
                </button>
              </div>

              {/* Affiliate Disclosure in legible font */}
              <div className="p-3 bg-[#F5F0E8] border border-[#E8DFD3] text-[11px] font-sans text-[#171717]/70 leading-normal">
                <div className="flex items-center gap-1.5 font-medium text-[#171717] mb-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#171717]" />
                  <span>Affiliate Disclosure & Integrity Guarantee</span>
                </div>
                <span>
                  As an Amazon Associate, Yatrababa earns from qualifying purchases. Prices, sizes, and Prime availability are verified and subject to change on Amazon.com.
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
