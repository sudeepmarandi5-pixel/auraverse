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
    <section id="editorial" className="w-full bg-[#0D0D0D] py-16 md:py-24 border-b border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-sans tracking-[0.25em] text-[#D8C3A5] uppercase mb-3">
            <span className="w-6 h-[1px] bg-[#D8C3A5]"></span>
            <span>The Yatrababa Manifesto</span>
            <span className="w-6 h-[1px] bg-[#D8C3A5]"></span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#FFFFFF] font-normal tracking-tight mb-4">
            Editor's Curated Capsule
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#A3A3A3] font-light leading-relaxed">
            A cohesive wardrobe is not built through sheer volume, but through deliberate restraint — investing in tactile cashmere, pure silk, and architectural outerwear that withstand the seasons.
          </p>
        </div>

        {/* Magazine Double-Spread Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left: Large Editorial Image Card */}
          <div className="lg:col-span-7 bg-[#141414] border border-[#262626] p-6 sm:p-8 flex flex-col justify-between">
            <div className="relative aspect-[16/10] sm:aspect-[16/11] w-full bg-[#181818] overflow-hidden mb-6">
              {imgError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-[#181818] text-center z-1">
                  <Sparkles className="w-8 h-8 text-[#D8C3A5] mb-2" />
                  <span className="font-serif text-2xl text-[#FFFFFF]">The Noir Wardrobe</span>
                  <span className="text-xs uppercase tracking-widest text-[#D8C3A5] mt-1">Editorial Vol. 04</span>
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
              <div className="flex items-center gap-2 text-xs font-sans tracking-[0.16em] uppercase text-[#8E8E8E] mb-2">
                <span>Styling Study 01</span>
                <span aria-hidden="true" className="text-[#444444]">·</span>
                <span className="text-[#D8C3A5]">Milan & Paris Showroom</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#FFFFFF] font-normal mb-3">
                The Quiet Precision of Noir Tones
              </h3>
              <p className="font-sans text-sm text-[#A3A3A3] leading-relaxed font-light mb-6">
                When color is simplified to obsidian noir, deep charcoal, and raw champagne beige, texture becomes paramount. Pair double-faced wool with fluid silk slips and Italian calfskin to achieve effortless high-fashion contrast.
              </p>

              <div className="p-4 bg-[#181818] border-l-2 border-[#D8C3A5] flex items-start gap-3">
                <Quote className="w-5 h-5 text-[#D8C3A5] shrink-0 mt-0.5" />
                <p className="font-serif italic text-sm text-[#EDEDED] leading-snug">
                  "Fashion passes; architectural cut and noble materials endure forever."
                </p>
              </div>
            </div>
          </div>

          {/* Right: Featured Pieces in the Capsule */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="bg-[#141414] border border-[#262626] p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-[#222222] mb-6">
                <span className="text-xs font-sans tracking-[0.18em] uppercase font-semibold text-[#FFFFFF]">
                  Capsule Essentials
                </span>
                <span className="text-xs font-sans text-[#D8C3A5] tracking-[0.14em] uppercase">
                  Amazon Prime Ready
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-6">
                {capsulePieces.map((piece, index) => (
                  <div
                    key={piece.id}
                    className="flex gap-4 items-start pb-6 border-b border-[#222222] last:border-b-0 last:pb-0 group"
                  >
                    <div
                      onClick={() => onQuickView(piece)}
                      className="w-20 h-24 sm:w-24 sm:h-28 bg-[#181818] shrink-0 border border-[#2A2A2A] overflow-hidden cursor-pointer"
                    >
                      <img
                        src={piece.imageUrl}
                        alt={piece.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="flex flex-col justify-between flex-grow h-24 sm:h-28">
                      <div>
                        <span className="text-[10px] font-sans tracking-[0.15em] uppercase text-[#8E8E8E] block mb-1">
                          Piece 0{index + 1} · {piece.brand}
                        </span>
                        <h4
                          onClick={() => onQuickView(piece)}
                          className="font-serif text-base text-[#FFFFFF] font-normal leading-snug line-clamp-1 hover:text-[#D8C3A5] cursor-pointer"
                        >
                          {piece.title}
                        </h4>
                        <span className="font-sans text-xs font-semibold tabular-nums text-[#D8C3A5] mt-1 block">
                          ${piece.price.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() => onQuickView(piece)}
                          className="text-[11px] font-sans tracking-[0.14em] uppercase text-[#EDEDED] hover:text-[#D8C3A5] font-medium cursor-pointer"
                        >
                          Inspect Details
                        </button>
                        <span className="text-[#444444]">·</span>
                        <a
                          href={piece.amazonUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-sans tracking-[0.14em] uppercase text-[#FFFFFF] hover:text-[#D8C3A5] font-semibold inline-flex items-center gap-1"
                        >
                          <span>Buy on Amazon</span>
                          <ExternalLink className="w-3 h-3 text-[#D8C3A5]" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Editorial Newsletter / Consultation Box */}
            <div className="bg-[#080808] text-white p-6 sm:p-8 border border-[#262626]">
              <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#D8C3A5] block mb-2 font-medium">
                The Yatrababa Gazette
              </span>
              <h4 className="font-serif text-xl sm:text-2xl font-normal mb-2 text-[#FFFFFF]">
                Curated Weekly Wardrobe Dispatch
              </h4>
              <p className="text-xs font-sans text-[#8E8E8E] font-light leading-relaxed mb-4">
                Receive private access to new editorial edits, fabric sourcing guides, and flash Amazon Prime fashion drops directly in your inbox.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Thank you for subscribing to the Yatrababa Weekly Dispatch.');
                }}
                className="flex items-stretch gap-2"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  className="bg-[#141414] border border-[#2E2E2E] text-white placeholder-[#666666] text-xs px-3 py-2.5 flex-grow focus:outline-none focus:border-[#D8C3A5]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#D8C3A5] text-[#0A0A0A] text-xs font-sans tracking-[0.14em] uppercase font-semibold hover:bg-[#FFFFFF] transition-colors whitespace-nowrap cursor-pointer"
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
