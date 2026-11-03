/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight, Star } from 'lucide-react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    });
  }, [products, query, selectedCategory]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 md:p-12 animate-in fade-in duration-150"
    >
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-[#121212] w-full max-w-3xl border border-[#262626] shadow-2xl z-10 overflow-hidden mt-8 sm:mt-12">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 border-b border-[#222222] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#8E8E8E] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cashmere coats, silk dresses, leather totes..."
            className="w-full font-serif text-lg sm:text-xl text-[#FFFFFF] placeholder-[#666666] focus:outline-none bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#8E8E8E] hover:text-[#FFFFFF] rounded-full cursor-pointer"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-sans tracking-[0.14em] uppercase text-[#EDEDED] bg-[#181818] border border-[#2E2E2E] hover:border-[#D8C3A5] hover:text-[#D8C3A5] transition-colors ml-2 cursor-pointer"
          >
            Esc
          </button>
        </div>

        {/* Quick Filter Bar */}
        <div className="px-6 py-3 bg-[#0D0D0D] border-b border-[#222222] flex items-center gap-2 overflow-x-auto text-xs font-sans tracking-[0.12em] uppercase">
          <span className="text-[#8E8E8E] mr-2 shrink-0">Filter:</span>
          {['all', 'coats', 'knitwear', 'dresses', 'trousers', 'accessories'].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-xs transition-colors shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#D8C3A5] text-[#0A0A0A] font-semibold'
                    : 'bg-[#161616] text-[#EDEDED] border border-[#262626] hover:border-[#D8C3A5]'
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-[#222222]">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-[#8E8E8E]">
              <p className="font-serif text-xl text-[#FFFFFF] mb-1">
                No matching garments found
              </p>
              <p className="text-xs font-sans tracking-[0.12em] uppercase">
                Try searching for "cashmere", "wool", "silk", or "trench".
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectProduct(item);
                  onClose();
                }}
                className="p-4 sm:p-5 flex items-center gap-4 hover:bg-[#181818] transition-colors cursor-pointer group"
              >
                <div className="w-14 h-18 bg-[#181818] border border-[#262626] shrink-0 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 text-[10px] font-sans tracking-[0.15em] uppercase text-[#8E8E8E] mb-1">
                    <span>{item.brand}</span>
                    <span aria-hidden="true" className="text-[#444444]">·</span>
                    <span className="text-[#D8C3A5]">{item.category}</span>
                  </div>
                  <h4 className="font-serif text-base text-[#FFFFFF] font-normal truncate group-hover:text-[#D8C3A5]">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#777777] truncate font-light mt-0.5">
                    {item.material}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-sans text-sm font-semibold tabular-nums text-[#FFFFFF] block">
                    ${item.price.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-[#D8C3A5] mt-1 justify-end">
                    <Star className="w-3 h-3 fill-[#D8C3A5] text-[#D8C3A5]" />
                    <span className="tabular-nums text-[#EDEDED]">{item.rating}</span>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-[#D8C3A5] group-hover:translate-x-1 transition-transform ml-2 shrink-0" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
