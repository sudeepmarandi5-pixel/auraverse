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
    <section id="trending" className="w-full bg-[#FAF8F5] py-16 md:py-24 border-b border-[#E8E2D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#E8E2D9] gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-sans tracking-[0.2em] text-[#8C7355] uppercase mb-2">
              <span className="w-4 h-[1px] bg-[#8C7355]"></span>
              <span>Curated Selection</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-normal tracking-tight">
              {selectedCategorySlug
                ? `Category: ${selectedCategorySlug.toUpperCase()}`
                : 'Trending Fashion & Latest Arrivals'}
            </h2>
          </div>

          {/* Interactive Filter Tabs & Sort Control */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter buttons segmented */}
            <div className="inline-flex items-center p-1 bg-[#F0EAE1] border border-[#E2DAD0] rounded-sm">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 text-xs font-sans tracking-[0.12em] uppercase font-medium transition-colors cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-[#FFFFFF] text-[#1A1A1A] font-semibold shadow-xs'
                    : 'text-[#666666] hover:text-[#1A1A1A]'
                }`}
              >
                All Pieces
              </button>
              <button
                onClick={() => setActiveTab('trending')}
                className={`px-3 py-1.5 text-xs font-sans tracking-[0.12em] uppercase font-medium transition-colors cursor-pointer ${
                  activeTab === 'trending'
                    ? 'bg-[#FFFFFF] text-[#1A1A1A] font-semibold shadow-xs'
                    : 'text-[#666666] hover:text-[#1A1A1A]'
                }`}
              >
                Trending
              </button>
              <button
                onClick={() => setActiveTab('new')}
                className={`px-3 py-1.5 text-xs font-sans tracking-[0.12em] uppercase font-medium transition-colors cursor-pointer ${
                  activeTab === 'new'
                    ? 'bg-[#FFFFFF] text-[#1A1A1A] font-semibold shadow-xs'
                    : 'text-[#666666] hover:text-[#1A1A1A]'
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
                className="appearance-none bg-[#FFFFFF] border border-[#E8E2D9] px-3 py-2 pr-8 text-xs font-sans tracking-[0.12em] uppercase text-[#1A1A1A] rounded-sm focus:outline-none focus:border-[#1A1A1A] cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-[#7A7570] absolute right-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Selected Category Notice Banner */}
        {selectedCategorySlug && (
          <div className="mb-8 p-4 bg-[#FFFFFF] border border-[#E8E2D9] flex items-center justify-between text-xs font-sans tracking-[0.12em] uppercase text-[#1A1A1A] shadow-xs">
            <span>Filtering by category: <strong className="text-[#8C7355]">{selectedCategorySlug}</strong> ({filteredProducts.length} items)</span>
            <button
              onClick={onClearCategory}
              className="text-[#8C7355] underline decoration-[#8C7355]/60 hover:opacity-80 font-semibold cursor-pointer"
            >
              Reset to all categories
            </button>
          </div>
        )}

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-[#FFFFFF] border border-[#E8E2D9] p-12">
            <p className="font-serif text-2xl text-[#1A1A1A] mb-2">No garments found in this view</p>
            <p className="text-xs font-sans text-[#7A7570] tracking-[0.12em] uppercase mb-6">
              Try adjusting your active category or filter settings.
            </p>
            <button
              onClick={() => {
                setActiveTab('all');
                onClearCategory();
              }}
              className="px-6 py-2.5 bg-[#1A1A1A] text-[#FFFFFF] font-semibold text-xs font-sans tracking-[0.16em] uppercase hover:bg-[#333333] transition-colors cursor-pointer"
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
