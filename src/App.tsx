/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, Category, BannerSettings } from './types';
import { StoreService } from './services/storeService';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryGrid } from './components/CategoryGrid';
import { TrendingArrivals } from './components/TrendingArrivals';
import { FeaturedEditorial } from './components/FeaturedEditorial';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SearchModal } from './components/SearchModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

import { testConnection } from './lib/firebase';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [bannerSettings, setBannerSettings] = useState<BannerSettings | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Navigation & filtering state
  const [activeSection, setActiveSection] = useState<string>('home');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);

  // Modals & Drawers
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize data on mount
  useEffect(() => {
    async function loadData() {
      await testConnection();
      const prods = await StoreService.getProducts();
      const cats = await StoreService.getCategories();
      const banner = await StoreService.getBannerSettings();
      const savedWishlist = StoreService.getWishlist();

      setProducts(prods);
      setCategories(cats);
      setBannerSettings(banner);
      setWishlist(savedWishlist);
    }
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleToggleWishlist = (id: string) => {
    const updated = StoreService.toggleWishlist(id);
    setWishlist(updated);
    const item = products.find((p) => p.id === id);
    if (updated.includes(id)) {
      showToast(`Saved "${item?.title || 'Garment'}" to personal wishlist`);
    } else {
      showToast(`Removed from wishlist`);
    }
  };

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSelectCategory = (slug: string | null) => {
    setSelectedCategorySlug(slug);
    if (slug) {
      handleNavigate('trending');
    }
  };

  // Admin Actions
  const handleSaveProduct = async (product: Product) => {
    await StoreService.saveProduct(product);
    const updated = await StoreService.getProducts();
    setProducts(updated);
  };

  const handleDeleteProduct = async (id: string) => {
    await StoreService.deleteProduct(id);
    const updated = await StoreService.getProducts();
    setProducts(updated);
  };

  const handleSaveCategory = async (category: Category) => {
    await StoreService.saveCategory(category);
    const updated = await StoreService.getCategories();
    setCategories(updated);
  };

  const handleDeleteCategory = async (id: string) => {
    await StoreService.deleteCategory(id);
    const updated = await StoreService.getCategories();
    setCategories(updated);
  };

  const handleSaveBanner = async (settings: BannerSettings) => {
    await StoreService.saveBannerSettings(settings);
    setBannerSettings(settings);
  };

  const handleResetData = async () => {
    const fresh = await StoreService.resetToDefault();
    setProducts(fresh.products);
    setCategories(fresh.categories);
    setBannerSettings(fresh.banner);
  };

  if (!bannerSettings) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="font-serif text-3xl tracking-[0.25em] text-[#171717] uppercase">
            YATRABABA
          </div>
          <div className="text-xs font-sans tracking-[0.2em] text-[#171717]/60 uppercase">
            Curating Editorial Wardrobe...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#171717] flex flex-col font-sans selection:bg-[#D8C3A5] selection:text-[#171717]">
      {/* Header & Sticky Navigation */}
      <Header
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        wishlistCount={wishlist.length}
        isAdmin={isAdminAuthenticated}
        onOpenAdmin={() => setIsAdminOpen(true)}
        announcementText={bannerSettings.announcement}
      />

      {/* Main Editorial Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroBanner
          settings={bannerSettings}
          onExplore={() => handleNavigate('editorial')}
          onViewTrending={() => handleNavigate('trending')}
        />

        {/* Shop by Category */}
        <CategoryGrid
          categories={categories}
          selectedCategory={selectedCategorySlug}
          onSelectCategory={handleSelectCategory}
        />

        {/* Trending Fashion and Latest Arrivals */}
        <TrendingArrivals
          products={products}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onQuickView={(p) => setQuickViewProduct(p)}
          selectedCategorySlug={selectedCategorySlug}
          onClearCategory={() => setSelectedCategorySlug(null)}
        />

        {/* Featured Collections & Editor's Picks */}
        <FeaturedEditorial
          products={products}
          onQuickView={(p) => setQuickViewProduct(p)}
        />
      </main>

      {/* Footer */}
      <Footer
        categories={categories}
        onSelectCategory={handleSelectCategory}
        onNavigate={handleNavigate}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Modals & Slide-overs */}
      <ProductDetailModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        isWishlisted={quickViewProduct ? wishlist.includes(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onShowToast={showToast}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => setQuickViewProduct(p)}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        products={products}
        wishlistIds={wishlist}
        onRemoveWishlist={handleToggleWishlist}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        categories={categories}
        bannerSettings={bannerSettings}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        onSaveCategory={handleSaveCategory}
        onDeleteCategory={handleDeleteCategory}
        onSaveBanner={handleSaveBanner}
        onResetData={handleResetData}
        onShowToast={showToast}
        isAdmin={isAdminAuthenticated}
        onLogin={(email) => {
          setIsAdminAuthenticated(true);
          showToast(`Logged in as Editor (${email})`);
        }}
        onLogout={() => {
          setIsAdminAuthenticated(false);
          showToast('Signed out of Editor Portal');
        }}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
