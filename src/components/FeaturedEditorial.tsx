/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ExternalLink, Sparkles, Quote, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface FeaturedEditorialProps {
  products: Product[];
  onQuickView: (product: Product) => void;
}

export const FeaturedEditorial: React.FC<FeaturedEditorialProps> = ({
  products,
  onQuickView,
}) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Pick 2 signature featured items
  const capsulePieces = products.filter((p) => p.isFeatured).slice(0, 2);

  return (
    <section id="editorial" className="w-full bg-[#F5F2EB] py-16 md:py-24 border-b border-[#E8E2D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-sans tracking-[0.25em] text-[#8C7355] uppercase mb-3">
            <span className="w-6 h-[1px] bg-[#8C7355]"></span>
            <span>The Yatrababa Manifesto</span>
            <span className="w-6 h-[1px] bg-[#8C7355]"></span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#1A1A1A] font-normal tracking-tight mb-4">
            Editor's Curated Capsule
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#666666] font-light leading-relaxed">
            A cohesive wardrobe is not built through sheer volume, but through deliberate restraint — investing in tactile cashmere, pure silk, and architectural outerwear that withstand the seasons.
          </p>
        </div>

        {/* Magazine Double-Spread Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left: Large Editorial Image Card */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E8E2D9] p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div className="relative aspect-[16/10] sm:aspect-[16/11] w-full bg-[#FAF8F5] overflow-hidden mb-6">
              {imgError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-[#FAF8F5] text-center z-1">
                  <Sparkles className="w-8 h-8 text-[#8C7355] mb-2" />
                  <span className="font-serif text-2xl text-[#1A1A1A]">The Capsule Wardrobe</span>
                  <span className="text-xs uppercase tracking-widest text-[#8C7355] mt-1">Editorial Vol. 04</span>
                </div>
              )}

              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop"
                alt="Editorial Capsule Wardrobe Collection"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-sans tracking-[0.16em] uppercase text-[#7A7570] mb-2">
                <span>Styling Study 01</span>
                <span aria-hidden="true" className="text-[#D5CCC0]">·</span>
                <span className="text-[#8C7355]">Milan & Paris Showroom</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-normal mb-3">
                The Quiet Precision of Neutral Tones
              </h3>
              <p className="font-sans text-sm text-[#666666] leading-relaxed font-light mb-6">
                When color is simplified to warm ivory, rich camel, and refined accents, texture becomes paramount. Pair double-faced wool with fluid silk slips and handcrafted footwear to achieve effortless elegance.
              </p>

              <div className="p-4 bg-[#FAF8F5] border-l-2 border-[#8C7355] flex items-start gap-3">
                <Quote className="w-5 h-5 text-[#8C7355] shrink-0 mt-0.5" />
                <p className="font-serif italic text-sm text-[#1A1A1A] leading-snug">
                  "Fashion passes; architectural cut and noble materials endure forever."
                </p>
              </div>
            </div>
          </div>

          {/* Right: Featured Pieces in the Capsule */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="bg-[#FFFFFF] border border-[#E8E2D9] p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D9] mb-6">
                <span className="text-xs font-sans tracking-[0.18em] uppercase font-semibold text-[#1A1A1A]">
                  Capsule Essentials
                </span>
                <span className="text-xs font-sans text-[#8C7355] tracking-[0.14em] uppercase">
                  Amazon Prime Ready
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-6">
                {capsulePieces.map((piece, index) => (
                  <div
                    key={piece.id}
                    className="flex gap-4 items-start pb-6 border-b border-[#E8E2D9] last:border-b-0 last:pb-0 group"
                  >
                    <div
                      onClick={() => onQuickView(piece)}
                      className="w-20 h-24 sm:w-24 sm:h-28 bg-[#FAF8F5] shrink-0 border border-[#E8E2D9] overflow-hidden cursor-pointer"
                    >
                      <img
                        src={piece.imageUrl}
                        alt={piece.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="flex flex-col justify-between flex-grow h-24 sm:h-28">
                      <div>
                        <span className="text-[10px] font-sans tracking-[0.15em] uppercase text-[#7A7570] block mb-1">
                          Piece 0{index + 1} · {piece.brand}
                        </span>
                        <h4
                          onClick={() => onQuickView(piece)}
                          className="font-serif text-base text-[#1A1A1A] font-normal leading-snug line-clamp-1 hover:text-[#8C7355] cursor-pointer"
                        >
                          {piece.title}
                        </h4>
                        <span className="font-sans text-xs font-semibold tabular-nums text-[#1A1A1A] mt-1 block">
                          ${piece.price.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() => onQuickView(piece)}
                          className="text-[11px] font-sans tracking-[0.14em] uppercase text-[#555555] hover:text-[#1A1A1A] font-medium cursor-pointer"
                        >
                          Inspect Details
                        </button>
                        <span className="text-[#D5CCC0]">·</span>
                        <a
                          href={piece.amazonUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-sans tracking-[0.14em] uppercase text-[#1A1A1A] hover:text-[#8C7355] font-semibold inline-flex items-center gap-1"
                        >
                          <span>Buy on Amazon</span>
                          <ExternalLink className="w-3 h-3 text-[#8C7355]" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Editorial Newsletter / Consultation Box */}
            <div className="bg-[#1A1A1A] text-white p-6 sm:p-8 border border-[#2A2A2A] shadow-md">
              <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#C5A880] block mb-2 font-medium">
                The Yatrababa Gazette
              </span>
              <h4 className="font-serif text-xl sm:text-2xl font-normal mb-2 text-[#FFFFFF]">
                Curated Weekly Wardrobe Dispatch
              </h4>
              <p className="text-xs font-sans text-[#B5B0A8] font-light leading-relaxed mb-4">
                Receive private access to new editorial edits, fabric sourcing guides, and flash Amazon Prime fashion drops directly in your inbox.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                className="flex items-stretch gap-2"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  className="bg-[#262626] border border-[#3E3E3E] text-white placeholder-[#8E8E8E] text-xs px-3 py-2.5 flex-grow focus:outline-none focus:border-[#C5A880]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#FFFFFF] text-[#1A1A1A] text-xs font-sans tracking-[0.14em] uppercase font-semibold hover:bg-[#C5A880] hover:text-[#1A1A1A] transition-colors whitespace-nowrap cursor-pointer"
                >
                  Join
                </button>
              </form>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
