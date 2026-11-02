/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Heart, ExternalLink, Eye, Star, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
}) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const currentImg =
    isHovered && product.secondaryImageUrl
      ? product.secondaryImageUrl
      : product.imageUrl;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white border border-[#E8DFD3] hover:border-[#D8C3A5] transition-all duration-300 flex flex-col relative"
    >
      {/* Visual Container (3:4 ratio standard for high-fashion editorial) */}
      <div className="relative aspect-[3/4] w-full bg-[#F5F0E8] overflow-hidden">
        {(!imgLoaded || imgError) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-[#F5F0E8] text-center">
            <Sparkles className="w-6 h-6 text-[#D8C3A5] mb-2" />
            <span className="font-serif text-sm text-[#171717] line-clamp-1">
              {product.title}
            </span>
            <span className="text-[10px] uppercase font-sans tracking-widest text-[#171717]/60 mt-1">
              {product.brand}
            </span>
          </div>
        )}

        <img
          src={currentImg}
          alt={product.title}
          referrerPolicy="no-referrer"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          className={`w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 ${
            imgLoaded && !imgError ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Wishlist Button (Top Right) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm border border-[#E8DFD3] text-[#171717] hover:bg-[#F5F0E8] transition-colors z-10 cursor-pointer shadow-xs"
          title={isWishlisted ? 'Remove from saved' : 'Save piece'}
          aria-label={isWishlisted ? 'Remove from saved' : 'Save piece'}
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              isWishlisted
                ? 'fill-[#171717] text-[#171717]'
                : 'text-[#171717] stroke-[1.75]'
            }`}
          />
        </button>

        {/* Quick Editorial Tag (Unboxed elegant text label) */}
        {product.isNew && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm border border-[#E8DFD3] px-2.5 py-1 text-[10px] font-sans tracking-[0.2em] uppercase text-[#171717] font-medium">
            New Arrival
          </div>
        )}
        {!product.isNew && product.isTrending && (
          <div className="absolute top-3 left-3 bg-[#F5F0E8]/95 backdrop-blur-sm border border-[#D8C3A5] px-2.5 py-1 text-[10px] font-sans tracking-[0.2em] uppercase text-[#171717] font-medium">
            Editor's Pick
          </div>
        )}

        {/* Hover Quick View Trigger bar */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <button
            onClick={() => onQuickView(product)}
            className="w-full py-2 bg-white text-[#171717] text-[11px] font-sans tracking-[0.16em] uppercase font-medium hover:bg-[#F5F0E8] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Information Area */}
      <div className="p-5 flex flex-col justify-between flex-grow bg-white">
        <div>
          {/* Brand & Category in muted unboxed text */}
          <div className="flex items-center gap-2 text-[11px] font-sans tracking-[0.16em] uppercase text-[#171717]/60 mb-1.5">
            <span>{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#171717]/80">{product.category}</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-serif text-lg text-[#171717] font-normal leading-snug line-clamp-1 hover:text-[#171717]/80 cursor-pointer transition-colors mb-2"
          >
            {product.title}
          </h3>

          {/* Material note */}
          <p className="text-[12px] font-sans text-[#171717]/70 font-light line-clamp-1 mb-3">
            {product.material}
          </p>
        </div>

        <div>
          {/* Price & Rating Row */}
          <div className="pt-3 border-t border-[#E8DFD3] flex items-center justify-between mb-4">
            <div className="flex items-baseline gap-2">
              <span className="font-sans text-base font-semibold tabular-nums text-[#171717]">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="font-sans text-xs line-through tabular-nums text-[#171717]/50">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-xs text-[#171717]">
              <Star className="w-3 h-3 fill-[#171717] text-[#171717]" />
              <span className="font-sans tabular-nums text-[11px] font-medium">
                {product.rating}
              </span>
              <span className="text-[#171717]/50 text-[10px]">
                ({product.reviewCount})
              </span>
            </div>
          </div>

          {/* Amazon Affiliate Button: Black background with white text */}
          <a
            href={product.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full py-2.5 px-4 bg-[#171717] text-white hover:bg-[#D8C3A5] hover:text-[#171717] text-xs font-sans tracking-[0.16em] uppercase font-medium transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Shop on Amazon</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
