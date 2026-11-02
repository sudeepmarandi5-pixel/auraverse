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
    <section id="categories" className="w-full bg-[#F5F0E8] py-16 md:py-24 border-b border-[#E8DFD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#E8DFD3]">
          <div>
            <div className="flex items-center gap-2 text-xs font-sans tracking-[0.2em] text-[#171717]/70 uppercase mb-2">
              <span className="w-4 h-[1px] bg-[#D8C3A5]"></span>
              <span>Architectural Edit</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#171717] font-normal tracking-tight">
              Shop by Category
            </h2>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            {selectedCategory && (
              <button
                onClick={() => onSelectCategory(null)}
                className="text-xs font-sans tracking-[0.14em] uppercase text-[#171717] underline decoration-[#D8C3A5] underline-offset-4 hover:opacity-75 transition-opacity"
              >
                Clear Filter (View All)
              </button>
            )}
            <span className="text-xs font-sans tracking-[0.16em] uppercase text-[#171717]/60">
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
      className={`group relative bg-white border cursor-pointer transition-all duration-300 flex flex-col overflow-hidden ${
        isSelected
          ? 'border-[#171717] ring-1 ring-[#171717] shadow-sm'
          : 'border-[#E8DFD3] hover:border-[#D8C3A5] hover:shadow-sm'
      }`}
    >
      {/* Category Image container */}
      <div className="relative aspect-[4/3] w-full bg-[#F5F0E8] overflow-hidden">
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-[#F5F0E8] text-center z-1">
            <Sparkles className="w-6 h-6 text-[#D8C3A5] mb-2" />
            <span className="font-serif text-lg text-[#171717]">{category.name}</span>
          </div>
        )}

        <img
          src={category.imageUrl}
          alt={category.name}
          loading="lazy"
          onError={() => setError(true)}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Subtle light scrim on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      {/* Card Content Area */}
      <div className="p-6 bg-white flex flex-col justify-between flex-grow">
        <div>
          <div className="flex items-center justify-between text-xs font-sans tracking-[0.14em] text-[#171717]/60 uppercase mb-2">
            <span>Collection</span>
            <span>{category.itemCount} Selected Pieces</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-[#171717] font-normal group-hover:text-[#171717] transition-colors mb-2">
            {category.name}
          </h3>
          <p className="text-xs font-sans text-[#171717]/70 leading-relaxed font-light line-clamp-2">
            {category.description}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-[#E8DFD3] flex items-center justify-between">
          <span className="text-xs font-sans tracking-[0.15em] uppercase font-medium text-[#171717] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1.5">
            {isSelected ? 'Selected Category' : 'Explore Category'}
            <ArrowRight className="w-3.5 h-3.5 text-[#D8C3A5]" />
          </span>
          {isSelected && (
            <span className="w-2 h-2 rounded-full bg-[#171717]" />
          )}
        </div>
      </div>
    </div>
  );
};
