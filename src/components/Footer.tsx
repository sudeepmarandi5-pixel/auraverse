/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowUp, ShieldCheck } from 'lucide-react';
import { Category } from '../types';

interface FooterProps {
  categories: Category[];
  onSelectCategory: (slug: string) => void;
  onNavigate: (section: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  categories,
  onSelectCategory,
  onNavigate,
  onOpenAdmin,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#070707] border-t border-[#222222] text-[#EDEDED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 pb-12 border-b border-[#222222]">
          
          {/* Col 1: Brand Wordmark & Editorial Ethos */}
          <div className="md:col-span-5 space-y-4">
            <span className="font-serif text-3xl sm:text-4xl tracking-[0.25em] font-medium text-[#FFFFFF] uppercase block">
              YATRABABA
            </span>
            <p className="font-sans text-xs sm:text-sm text-[#A3A3A3] font-light leading-relaxed max-w-sm">
              An independent women's fashion discovery journal celebrating understated luxury, tactile fabrics, and architectural cuts. Curating the finest pieces available on Amazon.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-sans tracking-[0.16em] uppercase text-[#8E8E8E]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D8C3A5]"></span>
              <span>Noir · Charcoal · Champagne Palette</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-sans tracking-[0.2em] uppercase font-semibold text-[#FFFFFF]">
              Editorial Edits
            </h4>
            <ul className="space-y-2 text-xs font-sans tracking-[0.14em] uppercase text-[#A3A3A3]">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#D8C3A5] hover:underline decoration-[#D8C3A5] transition-colors cursor-pointer"
                >
                  Autumn / Winter 2026
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('trending')}
                  className="hover:text-[#D8C3A5] hover:underline decoration-[#D8C3A5] transition-colors cursor-pointer"
                >
                  Trending Arrivals
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('editorial')}
                  className="hover:text-[#D8C3A5] hover:underline decoration-[#D8C3A5] transition-colors cursor-pointer"
                >
                  Editor's Picks
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-[#D8C3A5] hover:underline decoration-[#D8C3A5] transition-colors text-[#8E8E8E] cursor-pointer"
                >
                  Editor Portal / Sign In
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-sans tracking-[0.2em] uppercase font-semibold text-[#FFFFFF]">
              Wardrobe Categories
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans tracking-[0.14em] uppercase text-[#A3A3A3]">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelectCategory(c.slug);
                    onNavigate('trending');
                  }}
                  className="text-left hover:text-[#D8C3A5] hover:underline decoration-[#D8C3A5] transition-colors truncate cursor-pointer"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Affiliate Disclosure Section */}
        <div className="py-8 border-b border-[#222222] text-xs font-sans text-[#777777] leading-relaxed space-y-2">
          <div className="flex items-center gap-2 font-medium text-[#EDEDED] uppercase tracking-[0.14em]">
            <ShieldCheck className="w-4 h-4 text-[#D8C3A5]" />
            <span>Amazon Associates Program & Affiliate Statement</span>
          </div>
          <p className="font-light max-w-4xl">
            Yatrababa.com is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. Products featured in our editorial selections are independently chosen by our stylists. When you make a purchase through our links, we may receive an affiliate commission at no additional cost to you.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-[#666666] tracking-[0.12em] uppercase">
          <div>
            © {new Date().getFullYear()} Yatrababa.com. All rights reserved. Built for Netlify.
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[#8E8E8E]">Black Premium Edition</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-[#EDEDED] hover:text-[#D8C3A5] cursor-pointer transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5 text-[#D8C3A5]" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
