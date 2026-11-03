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
    <header className="w-full bg-[#FAF8F5]/95 backdrop-blur-md sticky top-0 z-40 transition-all duration-200 border-b border-[#E8E2D9]">
      {/* Top Announcement Bar */}
      <div className="bg-[#1A1A1A] border-b border-[#2A2A2A] text-[#F5EBE1] px-4 py-1.5 text-center text-[11px] md:text-xs tracking-[0.18em] uppercase font-sans font-medium flex items-center justify-center gap-3">
        <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#C5A880]"></span>
        <span>{announcementText}</span>
        <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#C5A880]"></span>
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
              <span className="font-serif text-2xl sm:text-3xl tracking-[0.25em] font-medium text-[#1A1A1A] uppercase block transition-colors group-hover:text-[#8C7355]">
                YATRABABA
              </span>
              <span className="text-[9px] tracking-[0.35em] text-[#7A7570] uppercase block font-sans font-medium -mt-0.5">
                EDITORIAL EDIT · FASHION
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 font-sans text-xs tracking-[0.16em] uppercase font-medium text-[#4A4540]">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative py-2 whitespace-nowrap transition-colors duration-150 cursor-pointer ${
                    isActive
                      ? 'text-[#1A1A1A] font-semibold'
                      : 'text-[#666666] hover:text-[#1A1A1A]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#1A1A1A]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Interactive Affordances (Search, Wishlist, Admin, Mobile Toggle) */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              onClick={onOpenSearch}
              className="p-2 text-[#2A2A2A] hover:bg-[#F0EAE1] hover:text-[#1A1A1A] rounded-full transition-colors cursor-pointer"
              title="Search collection"
              aria-label="Search collection"
            >
              <Search className="w-4 h-4 stroke-[1.75]" />
            </button>

            <button
              onClick={onOpenWishlist}
              className="p-2 text-[#2A2A2A] hover:bg-[#F0EAE1] hover:text-[#1A1A1A] rounded-full transition-colors relative cursor-pointer"
              title="View saved items"
              aria-label="View saved items"
            >
              <Heart className="w-4 h-4 stroke-[1.75]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#1A1A1A] text-[#FFFFFF] font-sans font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-[#FFFFFF]">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenAdmin}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] tracking-[0.14em] uppercase font-sans font-medium rounded-sm border transition-colors cursor-pointer ${
                isAdmin
                  ? 'bg-[#1A1A1A] text-[#FFFFFF] border-[#1A1A1A]'
                  : 'bg-[#FFFFFF] text-[#2A2A2A] border-[#E8E2D9] hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>{isAdmin ? 'Admin Panel' : 'Editor Login'}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#2A2A2A] hover:bg-[#F0EAE1] rounded-md md:hidden transition-colors cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-[#E8E2D9] px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200 shadow-xl">
          <nav className="flex flex-col space-y-3 font-sans text-sm tracking-[0.15em] uppercase font-medium text-[#2A2A2A]">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="text-left py-2 px-3 rounded hover:bg-[#F0EAE1] transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-4 h-4 text-[#8C7355]" />
              </button>
            ))}
          </nav>

          <div className="pt-4 border-t border-[#E8E2D9] flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-sans tracking-[0.14em] uppercase font-medium bg-[#1A1A1A] text-[#FFFFFF] border border-[#1A1A1A] rounded-sm hover:bg-[#333333] transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{isAdmin ? 'Access Admin Dashboard' : 'Editor Sign In'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
