/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Heart, Menu, X, Shield, ArrowRight } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  onOpenSearch: () => void;
  onOpenWishlist: () => void;
  wishlistCount: number;
  isAdmin: boolean;
  onOpenAdmin: () => void;
  announcementText?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onNavigate,
  onOpenSearch,
  onOpenWishlist,
  wishlistCount,
  isAdmin,
  onOpenAdmin,
  announcementText = 'Curated Women\'s Wardrobe Essentials · Amazon Prime Deliveries · Autumn / Winter 2026',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'categories', label: 'Categories' },
    { id: 'trending', label: 'Trending Fashion' },
    { id: 'editorial', label: 'Editor\'s Picks' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-[#0A0A0A]/95 backdrop-blur-md sticky top-0 z-40 transition-all duration-200 border-b border-[#222222]">
      {/* Top Announcement Bar */}
      <div className="bg-[#111111] border-b border-[#222222] text-[#D8C3A5] px-4 py-1.5 text-center text-[11px] md:text-xs tracking-[0.18em] uppercase font-sans font-medium flex items-center justify-center gap-3">
        <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#D8C3A5]"></span>
        <span>{announcementText}</span>
        <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#D8C3A5]"></span>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <span className="font-serif text-2xl sm:text-3xl tracking-[0.25em] font-medium text-[#FFFFFF] uppercase block transition-colors group-hover:text-[#D8C3A5]">
                YATRABABA
              </span>
              <span className="text-[9px] tracking-[0.35em] text-[#8E8E8E] uppercase block font-sans font-medium -mt-0.5">
                EDITORIAL EDIT · FASHION
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 font-sans text-xs tracking-[0.16em] uppercase font-medium text-[#EDEDED]">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative py-2 whitespace-nowrap transition-colors duration-150 cursor-pointer ${
                    isActive
                      ? 'text-[#FFFFFF] font-semibold'
                      : 'text-[#A3A3A3] hover:text-[#FFFFFF]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D8C3A5]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Interactive Affordances (Search, Wishlist, Admin, Mobile Toggle) */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              onClick={onOpenSearch}
              className="p-2 text-[#EDEDED] hover:bg-[#1A1A1A] hover:text-[#D8C3A5] rounded-full transition-colors cursor-pointer"
              title="Search collection"
              aria-label="Search collection"
            >
              <Search className="w-4 h-4 stroke-[1.75]" />
            </button>

            <button
              onClick={onOpenWishlist}
              className="p-2 text-[#EDEDED] hover:bg-[#1A1A1A] hover:text-[#D8C3A5] rounded-full transition-colors relative cursor-pointer"
              title="View saved items"
              aria-label="View saved items"
            >
              <Heart className="w-4 h-4 stroke-[1.75]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D8C3A5] text-[#0A0A0A] font-sans font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-[#0A0A0A]">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenAdmin}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] tracking-[0.14em] uppercase font-sans font-medium rounded-sm border transition-colors cursor-pointer ${
                isAdmin
                  ? 'bg-[#D8C3A5] text-[#0A0A0A] border-[#D8C3A5]'
                  : 'bg-[#141414] text-[#EDEDED] border-[#2E2E2E] hover:border-[#D8C3A5] hover:text-[#D8C3A5]'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>{isAdmin ? 'Admin Panel' : 'Editor Login'}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#EDEDED] hover:bg-[#1A1A1A] rounded-md md:hidden transition-colors cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0D0D0D] border-b border-[#222222] px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200 shadow-xl">
          <nav className="flex flex-col space-y-3 font-sans text-sm tracking-[0.15em] uppercase font-medium text-[#EDEDED]">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="text-left py-2 px-3 rounded hover:bg-[#161616] transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-4 h-4 text-[#D8C3A5]" />
              </button>
            ))}
          </nav>

          <div className="pt-4 border-t border-[#222222] flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-sans tracking-[0.14em] uppercase font-medium bg-[#1A1A1A] text-[#FFFFFF] border border-[#2E2E2E] rounded-sm hover:border-[#D8C3A5] transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-[#D8C3A5]" />
              <span>{isAdmin ? 'Access Admin Dashboard' : 'Editor Sign In'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
