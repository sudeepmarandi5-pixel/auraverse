/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6 lg:pr-6">
            <div className="inline-flex items-center gap-2 text-xs font-sans tracking-[0.25em] text-[#D8C3A5] uppercase">
              <span className="w-6 h-[1px] bg-[#D8C3A5]"></span>
              <span>{settings.issueNumber}</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#FFFFFF] leading-[1.08] text-balance">
              {settings.headline}
            </h1>

            <p className="font-sans text-base sm:text-lg text-[#A3A3A3] leading-relaxed max-w-xl font-light">
              {settings.subheadline}
            </p>

            {/* Editorial highlights list */}
            <div className="pt-2 pb-4 flex flex-wrap gap-y-2 gap-x-6 text-xs font-sans tracking-[0.12em] text-[#8E8E8E] uppercase border-y border-[#222222] py-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D8C3A5]"></span>
                <span>Direct Amazon Prime Links</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D8C3A5]"></span>
                <span>100% Cashmere & Silk Edits</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D8C3A5]"></span>
                <span>Editor-Tested Fits</span>
              </div>
            </div>

            {/* Action Buttons: High-Contrast White Primary + Obsidian/Champagne Secondary */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onExplore}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FFFFFF] text-[#0A0A0A] text-xs font-sans tracking-[0.18em] uppercase font-semibold hover:bg-[#D8C3A5] hover:text-[#0A0A0A] transition-all duration-200 group cursor-pointer shadow-lg shadow-black/50"
              >
                <span>{settings.ctaText}</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <button
                onClick={onViewTrending}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#141414] text-[#FFFFFF] border border-[#2A2A2A] text-xs font-sans tracking-[0.18em] uppercase font-medium hover:border-[#D8C3A5] hover:bg-[#1C1C1C] transition-all duration-200 cursor-pointer"
              >
                <span>Trending Arrivals</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Editorial Photography */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5] w-full bg-[#121212] border border-[#262626] overflow-hidden group">
              {/* Fallback architectural container only if image fails */}
              {imgError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#141414] via-[#0A0A0A] to-[#141414] text-center z-1">
                  <div className="w-16 h-16 rounded-full border border-[#D8C3A5] flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-[#D8C3A5]" />
                  </div>
                  <span className="font-serif text-2xl tracking-wider text-[#FFFFFF] mb-2 uppercase">
                    Yatrababa Curation
                  </span>
                  <span className="text-xs font-sans tracking-[0.2em] text-[#D8C3A5] uppercase">
                    Noir Fall Palette
                  </span>
                </div>
              )}

              <img
                src={settings.imageUrl}
                alt="Yatrababa High Fashion Editorial Autumn Edit"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Editorial Caption Tag in Corner */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#0D0D0D]/90 backdrop-blur-md border border-[#2A2A2A] p-4 flex items-center justify-between">
                <div>
                  <p className="font-serif text-base text-[#FFFFFF] font-medium">
                    The Monochromatic Wardrobe
                  </p>
                  <p className="font-sans text-[11px] tracking-[0.12em] text-[#8E8E8E] uppercase">
                    Featuring Double-Faced Cashmere & Gabardine
                  </p>
                </div>
                <span className="text-[10px] tracking-[0.2em] font-sans uppercase px-2.5 py-1 bg-[#181818] text-[#D8C3A5] border border-[#2E2E2E]">
                  Issue 04
                </span>
              </div>
            </div>

            {/* Subtle decorative framing accent */}
            <div className="hidden lg:block absolute -bottom-3 -right-3 w-full h-full border border-[#D8C3A5]/25 -z-10 pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  );
};
