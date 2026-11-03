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
      className="group bg-[#121212] border border-[#222222] hover:border-[#D8C3A5]/60 transition-all duration-300 flex flex-col relative hover:shadow-xl hover:shadow-black/70"
    >
      {/* Visual Container (3:4 ratio standard for high-fashion editorial) */}
      <div className="relative aspect-[3/4] w-full bg-[#181818] overflow-hidden">
        {imgError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-[#181818] text-center z-1">
            <Sparkles className="w-6 h-6 text-[#D8C3A5] mb-2" />
            <span className="font-serif text-sm text-[#FFFFFF] line-clamp-1">
              {product.title}
            </span>
            <span className="text-[10px] uppercase font-sans tracking-widest text-[#8E8E8E] mt-1">
              {product.brand}
            </span>
          </div>
        )}

        <img
          src={currentImg}
          alt={product.title}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
        />

        {/* Wishlist Button (Top Right) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-[#0A0A0A]/85 backdrop-blur-sm border border-[#2E2E2E] text-[#EDEDED] hover:bg-[#1A1A1A] hover:text-[#D8C3A5] transition-colors z-10 cursor-pointer shadow-xs"
          title={isWishlisted ? 'Remove from saved' : 'Save piece'}
          aria-label={isWishlisted ? 'Remove from saved' : 'Save piece'}
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              isWishlisted
                ? 'fill-[#D8C3A5] text-[#D8C3A5]'
                : 'text-[#EDEDED] stroke-[1.75]'
            }`}
          />
        </button>

        {/* Quick Editorial Tag */}
        {product.isNew && (
          <div className="absolute top-3 left-3 bg-[#0D0D0D]/90 backdrop-blur-sm border border-[#2E2E2E] px-2.5 py-1 text-[10px] font-sans tracking-[0.2em] uppercase text-[#D8C3A5] font-medium">
            New Arrival
          </div>
        )}
        {!product.isNew && product.isTrending && (
          <div className="absolute top-3 left-3 bg-[#0D0D0D]/90 backdrop-blur-sm border border-[#2E2E2E] px-2.5 py-1 text-[10px] font-sans tracking-[0.2em] uppercase text-[#D8C3A5] font-medium">
            Editor's Pick
          </div>
        )}

        {/* Hover Quick View Trigger bar */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <button
            onClick={() => onQuickView(product)}
            className="w-full py-2 bg-[#FFFFFF] text-[#0A0A0A] text-[11px] font-sans tracking-[0.16em] uppercase font-semibold hover:bg-[#D8C3A5] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Information Area */}
      <div className="p-5 flex flex-col justify-between flex-grow bg-[#121212]">
        <div>
          {/* Brand & Category in muted unboxed text */}
          <div className="flex items-center gap-2 text-[11px] font-sans tracking-[0.16em] uppercase text-[#8E8E8E] mb-1.5">
            <span>{product.brand}</span>
            <span aria-hidden="true" className="text-[#444444]">·</span>
            <span className="text-[#D8C3A5]">{product.category}</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-serif text-lg text-[#FFFFFF] font-normal leading-snug line-clamp-1 hover:text-[#D8C3A5] cursor-pointer transition-colors mb-2"
          >
            {product.title}
          </h3>

          {/* Material note */}
          <p className="text-[12px] font-sans text-[#A3A3A3] font-light line-clamp-1 mb-3">
            {product.material}
          </p>
        </div>

        <div>
          {/* Price & Rating Row */}
          <div className="pt-3 border-t border-[#222222] flex items-center justify-between mb-4">
            <div className="flex items-baseline gap-2">
              <span className="font-sans text-base font-semibold tabular-nums text-[#FFFFFF]">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="font-sans text-xs line-through tabular-nums text-[#666666]">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-xs text-[#D8C3A5]">
              <Star className="w-3 h-3 fill-[#D8C3A5] text-[#D8C3A5]" />
              <span className="font-sans tabular-nums text-[11px] font-medium text-[#FFFFFF]">
                {product.rating}
              </span>
              <span className="text-[#777777] text-[10px]">
                ({product.reviewCount})
              </span>
            </div>
          </div>

          {/* Amazon Affiliate Button: White background with black text (hover champagne) */}
          <a
            href={product.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full py-2.5 px-4 bg-[#FFFFFF] text-[#0A0A0A] hover:bg-[#D8C3A5] hover:text-[#0A0A0A] text-xs font-sans tracking-[0.16em] uppercase font-semibold transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <span>Shop on Amazon</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
