/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Category } from '../types';

interface CategoryGridProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section id="categories" className="w-full bg-[#F5F2EB] py-16 md:py-24 border-b border-[#E8E2D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#E8E2D9]">
          <div>
            <div className="flex items-center gap-2 text-xs font-sans tracking-[0.2em] text-[#8C7355] uppercase mb-2">
              <span className="w-4 h-[1px] bg-[#8C7355]"></span>
              <span>Architectural Edit</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-normal tracking-tight">
              Shop by Category
            </h2>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            {selectedCategory && (
              <button
                onClick={() => onSelectCategory(null)}
                className="text-xs font-sans tracking-[0.14em] uppercase text-[#8C7355] underline decoration-[#8C7355]/60 underline-offset-4 hover:opacity-80 transition-opacity cursor-pointer"
              >
                Clear Filter (View All)
              </button>
            )}
            <span className="text-xs font-sans tracking-[0.16em] uppercase text-[#7A7570]">
              {categories.length} Curated Collections
            </span>
          </div>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category) => {
            const isSelected = selectedCategory === category.slug;
            return (
              <CategoryCard
                key={category.id}
                category={category}
                isSelected={isSelected}
                onSelect={() => onSelectCategory(isSelected ? null : category.slug)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

const CategoryCard: React.FC<{
  category: Category;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ category, isSelected, onSelect }) => {
  const [error, setError] = useState(false);

  return (
    <div
      onClick={onSelect}
      className={`group relative bg-[#FFFFFF] border cursor-pointer transition-all duration-300 flex flex-col overflow-hidden shadow-xs ${
        isSelected
          ? 'border-[#1A1A1A] ring-1 ring-[#1A1A1A] shadow-md'
          : 'border-[#E8E2D9] hover:border-[#C5A880] hover:shadow-md'
      }`}
    >
      {/* Category Image container */}
      <div className="relative aspect-[4/3] w-full bg-[#FAF8F5] overflow-hidden">
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-[#FAF8F5] text-center z-1">
            <Sparkles className="w-6 h-6 text-[#8C7355] mb-2" />
            <span className="font-serif text-lg text-[#1A1A1A]">{category.name}</span>
          </div>
        )}

        <img
          src={category.imageUrl}
          alt={category.name}
          loading="lazy"
          onError={() => setError(true)}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Subtle vignette on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      {/* Card Content Area */}
      <div className="p-6 bg-[#FFFFFF] flex flex-col justify-between flex-grow">
        <div>
          <div className="flex items-center justify-between text-xs font-sans tracking-[0.14em] text-[#7A7570] uppercase mb-2">
            <span>Collection</span>
            <span>{category.itemCount} Selected Pieces</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-[#1A1A1A] font-normal group-hover:text-[#8C7355] transition-colors mb-2">
            {category.name}
          </h3>
          <p className="text-xs font-sans text-[#666666] leading-relaxed font-light line-clamp-2">
            {category.description}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-[#E8E2D9] flex items-center justify-between">
          <span className="text-xs font-sans tracking-[0.15em] uppercase font-medium text-[#1A1A1A] group-hover:text-[#8C7355] group-hover:translate-x-1 transition-all inline-flex items-center gap-1.5">
            {isSelected ? 'Selected Category' : 'Explore Category'}
            <ArrowRight className="w-3.5 h-3.5 text-[#8C7355]" />
          </span>
          {isSelected && (
            <span className="w-2 h-2 rounded-full bg-[#1A1A1A]" />
          )}
        </div>
      </div>
    </div>
  );
};
