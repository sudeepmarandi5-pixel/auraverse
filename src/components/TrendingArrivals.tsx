/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface TrendingArrivalsProps {
  products: Product[];
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onQuickView: (product: Product) => void;
  selectedCategorySlug: string | null;
  onClearCategory: () => void;
}

export const TrendingArrivals: React.FC<TrendingArrivalsProps> = ({
  products,
  wishlist,
  onToggleWishlist,
  onQuickView,
  selectedCategorySlug,
  onClearCategory,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'trending' | 'new'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => p.status === 'published');

    if (selectedCategorySlug) {
      result = result.filter((p) => p.category === selectedCategorySlug);
    }

    if (activeTab === 'trending') {
      result = result.filter((p) => p.isTrending);
    } else if (activeTab === 'new') {
      result = result.filter((p) => p.isNew);
    }

    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, selectedCategorySlug, activeTab, sortBy]);

  return (
    <section id="trending" className="w-full bg-[#FFFFFF] py-16 md:py-24 border-b border-[#E8DFD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#E8DFD3] gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-sans tracking-[0.2em] text-[#171717]/70 uppercase mb-2">
              <span className="w-4 h-[1px] bg-[#D8C3A5]"></span>
              <span>Curated Selection</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#171717] font-normal tracking-tight">
              {selectedCategorySlug
                ? `Category: ${selectedCategorySlug.toUpperCase()}`
                : 'Trending Fashion & Latest Arrivals'}
            </h2>
          </div>

          {/* Interactive Filter Tabs & Sort Control */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter buttons segmented */}
            <div className="inline-flex items-center p-1 bg-[#F5F0E8] border border-[#E8DFD3] rounded-sm">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 text-xs font-sans tracking-[0.12em] uppercase font-medium transition-colors cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-white text-[#171717] shadow-xs'
                    : 'text-[#171717]/70 hover:text-[#171717]'
                }`}
              >
                All Pieces
              </button>
              <button
                onClick={() => setActiveTab('trending')}
                className={`px-3 py-1.5 text-xs font-sans tracking-[0.12em] uppercase font-medium transition-colors cursor-pointer ${
                  activeTab === 'trending'
                    ? 'bg-white text-[#171717] shadow-xs'
                    : 'text-[#171717]/70 hover:text-[#171717]'
                }`}
              >
                Trending
              </button>
              <button
                onClick={() => setActiveTab('new')}
                className={`px-3 py-1.5 text-xs font-sans tracking-[0.12em] uppercase font-medium transition-colors cursor-pointer ${
                  activeTab === 'new'
                    ? 'bg-white text-[#171717] shadow-xs'
                    : 'text-[#171717]/70 hover:text-[#171717]'
                }`}
              >
                Latest In
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative inline-flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort products"
                className="appearance-none bg-white border border-[#E8DFD3] px-3 py-2 pr-8 text-xs font-sans tracking-[0.12em] uppercase text-[#171717] rounded-sm focus:outline-none focus:border-[#D8C3A5] cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-[#171717]/50 absolute right-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Selected Category Notice Banner */}
        {selectedCategorySlug && (
          <div className="mb-8 p-4 bg-[#F5F0E8] border border-[#D8C3A5] flex items-center justify-between text-xs font-sans tracking-[0.12em] uppercase text-[#171717]">
            <span>Filtering by category: <strong>{selectedCategorySlug}</strong> ({filteredProducts.length} items)</span>
            <button
              onClick={onClearCategory}
              className="text-[#171717] underline decoration-[#D8C3A5] hover:opacity-75 font-semibold"
            >
              Reset to all categories
            </button>
          </div>
        )}

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-[#F5F0E8] border border-[#E8DFD3] p-12">
            <p className="font-serif text-2xl text-[#171717] mb-2">No garments found in this view</p>
            <p className="text-xs font-sans text-[#171717]/60 tracking-[0.12em] uppercase mb-6">
              Try adjusting your active category or filter settings.
            </p>
            <button
              onClick={() => {
                setActiveTab('all');
                onClearCategory();
              }}
              className="px-6 py-2.5 bg-[#171717] text-white text-xs font-sans tracking-[0.16em] uppercase hover:bg-neutral-800"
            >
              View Full Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
