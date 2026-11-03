/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowUpRight, Sparkles, Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';
import { BannerSettings } from '../types';

interface HeroBannerProps {
  settings: BannerSettings;
  onExplore: () => void;
  onViewTrending: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  settings,
  onExplore,
  onViewTrending,
}) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <section className="relative w-full bg-[#0A0A0A] border-b border-[#222222] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 md:pt-10 md:pb-16">
        
        {/* Top Editorial Kicker & Verification Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="inline-flex items-center gap-2 text-xs font-sans tracking-[0.25em] text-[#D8C3A5] uppercase">
            <span className="w-5 h-[1px] bg-[#D8C3A5]"></span>
            <span>{settings.issueNumber}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-sans tracking-[0.14em] uppercase text-[#8E8E8E]">
            <span className="inline-flex items-center gap-1.5 text-[#EDEDED]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Amazon Prime Fast Shipping</span>
            </span>
            <span className="hidden sm:inline text-[#333333]">|</span>
            <span className="hidden sm:inline text-[#D8C3A5]">AuraVerse × Yatrababa Curated</span>
          </div>
        </div>

        {/* Panoramic Campaign Banner Display */}
        <div 
          onClick={onViewTrending}
          className="relative w-full border border-[#262626] bg-[#121212] overflow-hidden group shadow-2xl cursor-pointer transition-all duration-300 hover:border-[#D8C3A5]/60"
        >
          {/* 2:1 Widescreen Aspect Ratio matching the banner asset */}
          <div className="relative aspect-[2/1] sm:aspect-[2/1] w-full bg-[#141414] overflow-hidden">
            {!imgLoaded && !imgError && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#121212]">
                <div className="text-center space-y-2">
                  <div className="font-serif text-xl text-[#FFFFFF] tracking-widest uppercase">
                    Loading Campaign Banner...
                  </div>
                  <div className="text-[11px] font-sans tracking-[0.2em] text-[#D8C3A5] uppercase">
                    Yatrababa × AuraVerse
                  </div>
                </div>
              </div>
            )}

            {imgError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-[#141414] text-center z-1">
                <div className="w-16 h-16 rounded-full border border-[#D8C3A5] flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-[#D8C3A5]" />
                </div>
                <span className="font-serif text-2xl tracking-wider text-[#FFFFFF] mb-2 uppercase">
                  {settings.headline}
                </span>
                <span className="text-xs font-sans tracking-[0.2em] text-[#D8C3A5] uppercase">
                  New Season Collection
                </span>
              </div>
            )}

            <img
              src={settings.imageUrl}
              alt="New Season Women's Fashion Campaign Banner"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.01] ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Subtle interactive hover cue in corner */}
            <div className="absolute top-4 right-4 bg-black/75 backdrop-blur-md border border-[#333333] px-3 py-1.5 hidden sm:flex items-center gap-1.5 text-[10px] font-sans tracking-[0.16em] uppercase text-[#EDEDED] group-hover:text-[#D8C3A5] group-hover:border-[#D8C3A5] transition-colors pointer-events-none">
              <span>Explore Edit</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#D8C3A5]" />
            </div>
          </div>

          {/* Bottom Editorial Control & Action Bar */}
          <div className="bg-[#0D0D0D] border-t border-[#222222] p-5 sm:p-7 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-sans tracking-[0.2em] uppercase px-2 py-0.5 bg-[#181818] text-[#D8C3A5] border border-[#2E2E2E]">
                  Editorial Curated
                </span>
                <span className="text-[11px] font-sans tracking-[0.14em] uppercase text-[#8E8E8E]">
                  Trendy · Elegant · Stylish
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#FFFFFF] font-normal tracking-tight">
                {settings.headline}
              </h1>
              <p className="font-sans text-xs sm:text-sm text-[#A3A3A3] leading-relaxed font-light">
                {settings.subheadline}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onExplore();
                }}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#FFFFFF] text-[#0A0A0A] text-xs font-sans tracking-[0.18em] uppercase font-semibold hover:bg-[#D8C3A5] hover:text-[#0A0A0A] transition-all duration-200 group/btn cursor-pointer shadow-lg shadow-black/50"
              >
                <span>{settings.ctaText}</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewTrending();
                }}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#141414] text-[#FFFFFF] border border-[#2A2A2A] text-xs font-sans tracking-[0.18em] uppercase font-medium hover:border-[#D8C3A5] hover:bg-[#1C1C1C] transition-all duration-200 cursor-pointer"
              >
                <span>Trending Arrivals</span>
              </button>
            </div>
          </div>
        </div>

        {/* Guarantees & Features Strip mirroring the banner's value propositions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#222222]">
          <div className="flex items-center gap-3 p-3 bg-[#111111] border border-[#222222]">
            <Truck className="w-5 h-5 text-[#D8C3A5] shrink-0" />
            <div>
              <div className="text-xs font-sans font-medium text-[#FFFFFF] uppercase tracking-wider">Free Shipping</div>
              <div className="text-[10px] font-sans text-[#8E8E8E]">Direct Amazon Prime Dispatch</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#111111] border border-[#222222]">
            <ShieldCheck className="w-5 h-5 text-[#D8C3A5] shrink-0" />
            <div>
              <div className="text-xs font-sans font-medium text-[#FFFFFF] uppercase tracking-wider">Secure Payment</div>
              <div className="text-[10px] font-sans text-[#8E8E8E]">Encrypted Checkout via Amazon</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#111111] border border-[#222222]">
            <RotateCcw className="w-5 h-5 text-[#D8C3A5] shrink-0" />
            <div>
              <div className="text-xs font-sans font-medium text-[#FFFFFF] uppercase tracking-wider">Easy Returns</div>
              <div className="text-[10px] font-sans text-[#8E8E8E]">Hassle-Free Doorstep Pickup</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#111111] border border-[#222222]">
            <Headphones className="w-5 h-5 text-[#D8C3A5] shrink-0" />
            <div>
              <div className="text-xs font-sans font-medium text-[#FFFFFF] uppercase tracking-wider">24/7 Support</div>
              <div className="text-[10px] font-sans text-[#8E8E8E]">Dedicated Wardrobe Concierge</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

