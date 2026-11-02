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
    <footer className="w-full bg-[#FFFFFF] border-t border-[#E8DFD3] text-[#171717]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 pb-12 border-b border-[#E8DFD3]">
          
          {/* Col 1: Brand Wordmark & Editorial Ethos */}
          <div className="md:col-span-5 space-y-4">
            <span className="font-serif text-3xl sm:text-4xl tracking-[0.25em] font-medium text-[#171717] uppercase block">
              YATRABABA
            </span>
            <p className="font-sans text-xs sm:text-sm text-[#171717]/70 font-light leading-relaxed max-w-sm">
              An independent women's fashion discovery journal celebrating understated luxury, tactile fabrics, and architectural cuts. Curating the finest pieces available on Amazon.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-sans tracking-[0.16em] uppercase text-[#171717]/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D8C3A5]"></span>
              <span>White · Black · Beige Palette</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-sans tracking-[0.2em] uppercase font-semibold text-[#171717]">
              Editorial Edits
            </h4>
            <ul className="space-y-2 text-xs font-sans tracking-[0.14em] uppercase text-[#171717]/80">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#171717] hover:underline decoration-[#D8C3A5] transition-colors"
                >
                  Autumn / Winter 2026
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('trending')}
                  className="hover:text-[#171717] hover:underline decoration-[#D8C3A5] transition-colors"
                >
                  Trending Arrivals
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('editorial')}
                  className="hover:text-[#171717] hover:underline decoration-[#D8C3A5] transition-colors"
                >
                  Editor's Picks
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-[#171717] hover:underline decoration-[#D8C3A5] transition-colors text-[#171717]/70"
                >
                  Editor Portal / Sign In
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-sans tracking-[0.2em] uppercase font-semibold text-[#171717]">
              Wardrobe Categories
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans tracking-[0.14em] uppercase text-[#171717]/80">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelectCategory(c.slug);
                    onNavigate('trending');
                  }}
                  className="text-left hover:text-[#171717] hover:underline decoration-[#D8C3A5] transition-colors truncate"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Affiliate Disclosure Section (Readable & compliant) */}
        <div className="py-8 border-b border-[#E8DFD3] text-xs font-sans text-[#171717]/70 leading-relaxed space-y-2">
          <div className="flex items-center gap-2 font-medium text-[#171717] uppercase tracking-[0.14em]">
            <ShieldCheck className="w-4 h-4 text-[#171717]" />
            <span>Amazon Associates Program & Affiliate Statement</span>
          </div>
          <p className="font-light max-w-4xl">
            Yatrababa.com is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. Products featured in our editorial selections are independently chosen by our stylists. When you make a purchase through our links, we may receive an affiliate commission at no additional cost to you.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-[#171717]/60 tracking-[0.12em] uppercase">
          <div>
            © {new Date().getFullYear()} Yatrababa.com. All rights reserved. Built for Netlify.
          </div>

          <div className="flex items-center gap-6">
            <span>Clean Luxury Redesign</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-[#171717] hover:text-[#171717]/70 cursor-pointer"
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
