/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, Category, BannerSettings } from './types';
import { INITIAL_BANNER_SETTINGS } from './data/initialData';
import { StoreService } from './services/storeService';
import { Header } from './components/Header';
import { CategoryGrid } from './components/CategoryGrid';
import { TrendingArrivals } from './components/TrendingArrivals';
import { FeaturedEditorial } from './components/FeaturedEditorial';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SearchModal } from './components/SearchModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

import {
  testConnection,
  auth,
  signInWithGoogle,
  signInWithEmail,
  logOut,
  verifyUserIsAdmin,
  AUTHORIZED_ADMIN_EMAILS,
} from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [bannerSettings, setBannerSettings] = useState<BannerSettings>(INITIAL_BANNER_SETTINGS);
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
  const [adminUserEmail, setAdminUserEmail] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Track real Firebase Auth state changes
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        const isAdmin = await verifyUserIsAdmin(user);
        if (isAdmin) {
          setIsAdminAuthenticated(true);
          setAdminUserEmail(user.email);
        } else {
          setIsAdminAuthenticated(false);
          setAdminUserEmail(null);
        }
      } else {
        setIsAdminAuthenticated(false);
        setAdminUserEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);

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

  const handleGoogleLogin = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      const isAdmin = await verifyUserIsAdmin(user);
      if (user && isAdmin) {
        setIsAdminAuthenticated(true);
        setAdminUserEmail(user.email);
        showToast(`Welcome back, ${user.displayName || user.email}`);
        return { success: true };
      } else {
        await logOut();
        setIsAdminAuthenticated(false);
        setAdminUserEmail(null);
        return {
          success: false,
          error: `Access Denied: The Firebase account (${user?.email || 'unknown'}) is not registered as an authorized administrator (${AUTHORIZED_ADMIN_EMAILS.join(', ')}).`,
        };
      }
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      return {
        success: false,
        error: err.message || 'Google authentication was cancelled or failed.',
      };
    }
  };

  const handleCredentialsLogin = async (
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const userCredential = await signInWithEmail(email, pass);
      const user = userCredential.user;
      const isAdmin = await verifyUserIsAdmin(user);

      if (user && isAdmin) {
        setIsAdminAuthenticated(true);
        setAdminUserEmail(user.email);
        showToast(`Authenticated as Administrator (${user.email})`);
        return { success: true };
      } else {
        await logOut();
        setIsAdminAuthenticated(false);
        setAdminUserEmail(null);
        return {
          success: false,
          error: `Access Denied: Account (${user?.email}) is not authorized for administrator operations.`,
        };
      }
    } catch (err: any) {
      const code = err?.code || '';
      let message = err?.message || 'Authentication failed.';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        message = 'Invalid email or password. Please verify your credentials or use Sign In with Google.';
      } else if (code === 'auth/too-many-requests') {
        message = 'Access temporarily locked due to many failed attempts. Try again later or reset password.';
      }
      return {
        success: false,
        error: message,
      };
    }
  };

  const handleLogout = async () => {
    await logOut();
    setIsAdminAuthenticated(false);
    setAdminUserEmail(null);
    showToast('Signed out of Editor Portal');
  };

  if (products.length === 0 && categories.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="font-serif text-3xl tracking-[0.25em] text-[#1A1A1A] uppercase">
            YATRABABA
          </div>
          <div className="text-xs font-sans tracking-[0.2em] text-[#8C7355] uppercase">
            Curating Editorial Wardrobe...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#C5A880] selection:text-[#FFFFFF]">
      {/* Header & Sticky Navigation */}
      <Header
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        wishlistCount={wishlist.length}
        isAdmin={isAdminAuthenticated}
        onOpenAdmin={() => setIsAdminOpen(true)}
        announcementText={bannerSettings?.announcement}
      />

      {/* Main Editorial Content */}
      <main className="flex-grow">
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
        adminUserEmail={adminUserEmail}
        onCredentialsLogin={handleCredentialsLogin}
        onGoogleLogin={handleGoogleLogin}
        onLogout={handleLogout}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
