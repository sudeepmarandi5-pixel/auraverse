/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Check,
  LayoutDashboard,
  ShoppingBag,
  Layers,
  Image as ImageIcon,
  RotateCcw,
  LogOut,
  Save,
  AlertCircle,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { Product, Category, BannerSettings } from '../types';
import { ImageUploader } from './ImageUploader';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: Category[];
  bannerSettings: BannerSettings;
  onSaveProduct: (product: Product) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onSaveCategory: (category: Category) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onSaveBanner: (settings: BannerSettings) => Promise<void>;
  onResetData: () => void;
  onShowToast: (msg: string) => void;
  isAdmin: boolean;
  adminUserEmail?: string | null;
  onCredentialsLogin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  onGoogleLogin: () => Promise<{ success: boolean; error?: string }>;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  products,
  categories,
  bannerSettings,
  onSaveProduct,
  onDeleteProduct,
  onSaveCategory,
  onDeleteCategory,
  onSaveBanner,
  onResetData,
  onShowToast,
  isAdmin,
  adminUserEmail,
  onCredentialsLogin,
  onGoogleLogin,
  onLogout,
}) => {
  if (!isOpen) return null;

  // Tabs: 'products' | 'categories' | 'banner'
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'banner'>('products');

  // Auth form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Product modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Category modal state
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Banner edit state
  const [bannerForm, setBannerForm] = useState<BannerSettings>({ ...bannerSettings });
  const [isSavingBanner, setIsSavingBanner] = useState(false);

  // Product filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenNewProduct = () => {
    setEditingProduct({
      id: `prod-${Date.now()}`,
      title: '',
      brand: 'Yatrababa Studio',
      category: categories[0]?.slug || 'coats',
      price: 195.0,
      originalPrice: 240.0,
      rating: 4.8,
      reviewCount: 24,
      imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce667883?q=80&w=1000&auto=format&fit=crop',
      amazonUrl: 'https://www.amazon.com/dp/B08XWN76P9?tag=yatrababa-20',
      description: 'Hand-finished garment tailored with refined clean lines and luxury fabrication.',
      material: '100% Cashmere & Fine Wool',
      fitDetails: 'Relaxed tailored fit. True to size.',
      isFeatured: false,
      isTrending: true,
      isNew: true,
      status: 'published',
      createdAt: new Date().toISOString(),
    });
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (prod: Product) => {
    setEditingProduct({ ...prod });
    setIsProductModalOpen(true);
  };

  const handleSaveProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    await onSaveProduct(editingProduct);
    setIsProductModalOpen(false);
    onShowToast(`Garment "${editingProduct.title}" saved successfully`);
  };

  const handleDeleteProductClick = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove "${title}"?`)) {
      await onDeleteProduct(id);
      onShowToast(`Removed product "${title}"`);
    }
  };

  const handleOpenNewCategory = () => {
    setEditingCategory({
      id: `cat-${Date.now()}`,
      name: '',
      slug: '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce667883?q=80&w=1000&auto=format&fit=crop',
      itemCount: 0,
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    await onSaveCategory(editingCategory);
    setIsCategoryModalOpen(false);
    onShowToast(`Category "${editingCategory.name}" saved successfully`);
  };

  const handleDeleteCategoryClick = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      await onDeleteCategory(id);
      onShowToast(`Deleted category "${name}"`);
    }
  };

  const handleSaveBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBanner(true);
    await onSaveBanner(bannerForm);
    setIsSavingBanner(false);
    onShowToast('Homepage & Banner settings updated');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
    >
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-[#121212] w-full max-w-6xl h-[92vh] border border-[#262626] shadow-2xl z-10 flex flex-col overflow-hidden">
        
        {/* Top Bar */}
        <div className="px-6 py-4 bg-[#0D0D0D] border-b border-[#222222] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-[#D8C3A5] text-[#0A0A0A] flex items-center justify-center font-serif text-lg font-bold">
              Y
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#FFFFFF] font-normal leading-tight">
                Yatrababa Admin Portal
              </h2>
              <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#8E8E8E] block">
                Editorial Control & Catalog Management
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <>
                {adminUserEmail && (
                  <span className="hidden sm:inline-block text-[11px] font-sans tracking-[0.14em] uppercase text-[#D8C3A5] bg-[#1A1A1A] border border-[#2E2E2E] px-2.5 py-1">
                    {adminUserEmail}
                  </span>
                )}
                <button
                  onClick={onLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans tracking-[0.14em] uppercase text-[#EDEDED] hover:text-[#D8C3A5] border border-[#2E2E2E] hover:border-[#D8C3A5] transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 text-[#EDEDED] hover:bg-[#1A1A1A] hover:text-[#D8C3A5] rounded-full transition-colors cursor-pointer"
              aria-label="Close admin dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* If Not Authenticated: Secure Login Screen */}
        {!isAdmin ? (
          <div className="flex-grow flex items-center justify-center p-6 bg-[#0A0A0A] overflow-y-auto">
            <div className="bg-[#141414] border border-[#262626] p-8 max-w-md w-full shadow-2xl my-auto">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full border border-[#D8C3A5] bg-[#1C1C1C] flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-5 h-5 text-[#D8C3A5]" />
                </div>
                <h3 className="font-serif text-2xl text-[#FFFFFF] font-normal">
                  Administrator Sign In
                </h3>
                <p className="text-xs font-sans tracking-[0.12em] uppercase text-[#8E8E8E] mt-1">
                  Protected Editorial & Catalog Console
                </p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1A1A1A] border border-[#2E2E2E] text-[10px] uppercase font-sans tracking-widest text-[#D8C3A5]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Firebase Auth & Storage Online</span>
                  </span>
                </div>
              </div>

              {/* Error Notice */}
              {authError && (
                <div className="mb-5 p-3.5 bg-red-950/60 border border-red-800 text-red-200 text-xs font-sans flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                  <div className="leading-relaxed">
                    <span className="font-semibold block mb-0.5">Authentication Failed</span>
                    <span>{authError}</span>
                  </div>
                </div>
              )}

              {/* Primary Method: Google Sign-In */}
              <div className="space-y-4">
                <button
                  type="button"
                  disabled={isAuthenticating}
                  onClick={async () => {
                    setAuthError(null);
                    setIsAuthenticating(true);
                    const res = await onGoogleLogin();
                    setIsAuthenticating(false);
                    if (!res.success) {
                      setAuthError(res.error || 'Google login failed.');
                    }
                  }}
                  className="w-full py-3 px-4 bg-[#FFFFFF] hover:bg-[#D8C3A5] text-[#0A0A0A] text-xs font-sans tracking-[0.16em] uppercase font-semibold transition-all duration-150 flex items-center justify-center gap-3 cursor-pointer shadow-lg shadow-black/50 disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{isAuthenticating ? 'Authenticating with Google...' : 'Sign In with Google'}</span>
                </button>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-4">
                  <div className="border-t border-[#262626] w-full" />
                  <span className="bg-[#141414] px-3 text-[10px] uppercase font-sans tracking-[0.16em] text-[#777777] whitespace-nowrap">
                    or Firebase email credentials
                  </span>
                  <div className="border-t border-[#262626] w-full" />
                </div>

                {/* Credentials Form */}
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setAuthError(null);
                    setIsAuthenticating(true);
                    const res = await onCredentialsLogin(loginEmail, loginPassword);
                    setIsAuthenticating(false);
                    if (!res.success) {
                      setAuthError(res.error || 'Authentication rejected.');
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-[11px] font-sans tracking-[0.14em] uppercase text-[#EDEDED] font-medium mb-1">
                      Firebase Admin Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sudeep.marandi5@gmail.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#1C1C1C] border border-[#2E2E2E] text-sm text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#D8C3A5]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-sans tracking-[0.14em] uppercase text-[#EDEDED] font-medium mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Enter Firebase account password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#1C1C1C] border border-[#2E2E2E] text-sm text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#D8C3A5]"
                    />
                  </div>

                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={isAuthenticating}
                      className="w-full py-2.5 bg-[#1A1A1A] border border-[#2E2E2E] text-[#FFFFFF] hover:border-[#D8C3A5] hover:text-[#D8C3A5] text-xs font-sans tracking-[0.18em] uppercase font-semibold transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isAuthenticating ? 'Signing In...' : 'Sign In with Email'}
                    </button>
                  </div>

                  <div className="p-3 bg-[#181818] border border-[#262626] text-[10px] font-sans text-[#A3A3A3] space-y-1">
                    <div className="font-medium text-[#FFFFFF] uppercase tracking-wider">
                      Authorized Admin Account
                    </div>
                    <div>
                      Primary Administrator: <code className="text-[#D8C3A5] font-semibold">sudeep.marandi5@gmail.com</code>
                    </div>
                    <div className="text-[9px] text-[#777777]">
                      Sign in with the authorized Google or Firebase account to manage garments and images.
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-[#0F0F0F] border-b md:border-b-0 md:border-r border-[#222222] p-4 flex md:flex-col justify-between shrink-0">
              <div className="space-y-1 w-full flex md:flex-col gap-1 md:gap-1 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('products')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-sans tracking-[0.14em] uppercase font-medium rounded-xs transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === 'products'
                      ? 'bg-[#1C1C1C] text-[#FFFFFF] border border-[#D8C3A5]/60 shadow-md font-semibold'
                      : 'text-[#8E8E8E] hover:bg-[#161616] hover:text-[#EDEDED]'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-[#D8C3A5]" />
                  <span>Products ({products.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('categories')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-sans tracking-[0.14em] uppercase font-medium rounded-xs transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === 'categories'
                      ? 'bg-[#1C1C1C] text-[#FFFFFF] border border-[#D8C3A5]/60 shadow-md font-semibold'
                      : 'text-[#8E8E8E] hover:bg-[#161616] hover:text-[#EDEDED]'
                  }`}
                >
                  <Layers className="w-4 h-4 text-[#D8C3A5]" />
                  <span>Categories ({categories.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('banner')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-sans tracking-[0.14em] uppercase font-medium rounded-xs transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === 'banner'
                      ? 'bg-[#1C1C1C] text-[#FFFFFF] border border-[#D8C3A5]/60 shadow-md font-semibold'
                      : 'text-[#8E8E8E] hover:bg-[#161616] hover:text-[#EDEDED]'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 text-[#D8C3A5]" />
                  <span>Hero & Banner</span>
                </button>
              </div>

              {/* Bottom Quick Tools in Sidebar */}
              <div className="hidden md:block pt-4 border-t border-[#222222] space-y-2">
                <div className="p-3 bg-[#161616] border border-[#262626] text-[11px] font-sans text-[#8E8E8E]">
                  <div className="font-semibold text-[#FFFFFF] mb-1">Catalog Status</div>
                  <div>Published: {products.filter((p) => p.status === 'published').length}</div>
                  <div>Drafts: {products.filter((p) => p.status === 'draft').length}</div>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm('Reset catalog to curated editorial default pieces?')) {
                      onResetData();
                      onShowToast('Catalog reset to curated editorial defaults');
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-[10px] font-sans tracking-[0.12em] uppercase text-[#8E8E8E] hover:text-[#FFFFFF] border border-[#262626] bg-[#141414] hover:bg-[#1A1A1A] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3 text-[#D8C3A5]" />
                  <span>Reset Default Edit</span>
                </button>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-[#121212] overflow-y-auto">
              
              {/* TAB 1: PRODUCTS */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  {/* Top Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#222222]">
                    <div>
                      <h3 className="font-serif text-2xl text-[#FFFFFF] font-normal">
                        Garment Catalog
                      </h3>
                      <p className="text-xs font-sans text-[#8E8E8E] tracking-[0.12em] uppercase">
                        Create, edit, and organize Amazon affiliate fashion pieces
                      </p>
                    </div>

                    <button
                      onClick={handleOpenNewProduct}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FFFFFF] text-[#0A0A0A] hover:bg-[#D8C3A5] hover:text-[#0A0A0A] text-xs font-sans tracking-[0.16em] uppercase font-semibold transition-colors cursor-pointer shadow-lg shadow-black/50"
                    >
                      <Plus className="w-4 h-4" />
                      <span>New Garment</span>
                    </button>
                  </div>

                  {/* Filters Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-[#161616] p-3 border border-[#262626]">
                    <div className="sm:col-span-8">
                      <input
                        type="text"
                        placeholder="Search garments by title or brand..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 bg-[#1C1C1C] border border-[#2E2E2E] text-xs font-sans text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#D8C3A5]"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-[#1C1C1C] border border-[#2E2E2E] text-xs font-sans uppercase tracking-[0.1em] text-[#FFFFFF] focus:outline-none focus:border-[#D8C3A5] cursor-pointer"
                      >
                        <option value="all">All Categories</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Products Table */}
                  <div className="border border-[#262626] overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead className="bg-[#181818] border-b border-[#262626] text-[10px] tracking-[0.16em] uppercase text-[#8E8E8E]">
                        <tr>
                          <th className="py-3 px-4">Garment</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Price</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Tags</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#222222]">
                        {filteredProducts.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-[#8E8E8E]">
                              No garments found matching filter criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredProducts.map((p) => (
                            <tr key={p.id} className="hover:bg-[#181818]/60 transition-colors">
                              <td className="py-3 px-4 flex items-center gap-3">
                                <div className="w-10 h-12 bg-[#181818] border border-[#262626] shrink-0 overflow-hidden">
                                  <img
                                    src={p.imageUrl}
                                    alt={p.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <span className="font-serif text-sm text-[#FFFFFF] font-normal block truncate max-w-xs">
                                    {p.title}
                                  </span>
                                  <span className="text-[10px] text-[#8E8E8E] uppercase tracking-[0.12em]">
                                    {p.brand}
                                  </span>
                                </div>
                              </td>

                              <td className="py-3 px-4 uppercase text-[11px] text-[#D8C3A5]">
                                {p.category}
                              </td>

                              <td className="py-3 px-4 font-semibold tabular-nums text-[#FFFFFF]">
                                ${p.price.toFixed(2)}
                              </td>

                              <td className="py-3 px-4">
                                <span
                                  className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] font-medium border ${
                                    p.status === 'published'
                                      ? 'bg-[#1C1C1C] text-[#D8C3A5] border-[#D8C3A5]/60'
                                      : 'bg-[#181818] text-[#8E8E8E] border-[#2E2E2E]'
                                  }`}
                                >
                                  {p.status}
                                </span>
                              </td>

                              <td className="py-3 px-4 text-[10px] uppercase tracking-[0.1em] text-[#777777] space-x-1">
                                {p.isFeatured && <span className="text-[#D8C3A5]">[Featured]</span>}
                                {p.isTrending && <span>[Trending]</span>}
                                {p.isNew && <span className="text-emerald-400">[New]</span>}
                              </td>

                              <td className="py-3 px-4 text-right space-x-2">
                                <button
                                  onClick={() => handleEditProduct(p)}
                                  className="p-1.5 text-[#EDEDED] hover:text-[#D8C3A5] hover:bg-[#1C1C1C] border border-[#2E2E2E] rounded-xs cursor-pointer"
                                  title="Edit Garment"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProductClick(p.id, p.title)}
                                  className="p-1.5 text-[#8E8E8E] hover:text-red-400 hover:bg-red-950/40 border border-[#2E2E2E] rounded-xs cursor-pointer"
                                  title="Delete Garment"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: CATEGORIES */}
              {activeTab === 'categories' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#222222]">
                    <div>
                      <h3 className="font-serif text-2xl text-[#FFFFFF] font-normal">
                        Category Management
                      </h3>
                      <p className="text-xs font-sans text-[#8E8E8E] tracking-[0.12em] uppercase">
                        Organize collections, imagery, and taxonomy
                      </p>
                    </div>

                    <button
                      onClick={handleOpenNewCategory}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FFFFFF] text-[#0A0A0A] hover:bg-[#D8C3A5] hover:text-[#0A0A0A] text-xs font-sans tracking-[0.16em] uppercase font-semibold transition-colors cursor-pointer shadow-lg shadow-black/50"
                    >
                      <Plus className="w-4 h-4" />
                      <span>New Category</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories.map((c) => (
                      <div
                        key={c.id}
                        className="p-4 bg-[#161616] border border-[#262626] hover:border-[#D8C3A5]/60 transition-colors flex gap-4 items-center justify-between"
                      >
                        <div className="w-16 h-16 bg-[#181818] border border-[#262626] shrink-0 overflow-hidden">
                          <img
                            src={c.imageUrl}
                            alt={c.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-grow min-w-0">
                          <h4 className="font-serif text-lg text-[#FFFFFF] font-normal truncate">
                            {c.name}
                          </h4>
                          <span className="text-[10px] font-sans tracking-[0.14em] uppercase text-[#D8C3A5] block">
                            Slug: {c.slug} · {c.itemCount} items
                          </span>
                          <p className="text-xs text-[#A3A3A3] font-light truncate mt-0.5">
                            {c.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              setEditingCategory({ ...c });
                              setIsCategoryModalOpen(true);
                            }}
                            className="p-2 border border-[#2E2E2E] hover:bg-[#1C1C1C] text-[#EDEDED] hover:text-[#D8C3A5] rounded-xs cursor-pointer"
                            title="Edit Category"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategoryClick(c.id, c.name)}
                            className="p-2 border border-[#2E2E2E] hover:bg-red-950/40 text-[#8E8E8E] hover:text-red-400 rounded-xs cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: BANNER & HOMEPAGE */}
              {activeTab === 'banner' && (
                <div className="space-y-6 max-w-3xl">
                  <div className="pb-4 border-b border-[#222222]">
                    <h3 className="font-serif text-2xl text-[#FFFFFF] font-normal">
                      Homepage & Hero Settings
                    </h3>
                    <p className="text-xs font-sans text-[#8E8E8E] tracking-[0.12em] uppercase">
                      Update seasonal campaign headline, announcement ticker, and hero visual
                    </p>
                  </div>

                  <form onSubmit={handleSaveBannerSubmit} className="space-y-5">
                    <div>
                      <label className="block text-[11px] font-sans tracking-[0.14em] uppercase text-[#EDEDED] font-medium mb-1">
                        Top Announcement Bar Ticker
                      </label>
                      <input
                        type="text"
                        value={bannerForm.announcement}
                        onChange={(e) =>
                          setBannerForm({ ...bannerForm, announcement: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-[#1C1C1C] border border-[#2E2E2E] text-xs font-sans text-[#FFFFFF] focus:outline-none focus:border-[#D8C3A5]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-sans tracking-[0.14em] uppercase text-[#EDEDED] font-medium mb-1">
                          Issue Kicker Number
                        </label>
                        <input
                          type="text"
                          value={bannerForm.issueNumber}
                          onChange={(e) =>
                            setBannerForm({ ...bannerForm, issueNumber: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-[#1C1C1C] border border-[#2E2E2E] text-xs font-sans text-[#FFFFFF] focus:outline-none focus:border-[#D8C3A5]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-sans tracking-[0.14em] uppercase text-[#EDEDED] font-medium mb-1">
                          Primary CTA Button Text
                        </label>
                        <input
                          type="text"
                          value={bannerForm.ctaText}
                          onChange={(e) =>
                            setBannerForm({ ...bannerForm, ctaText: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-[#1C1C1C] border border-[#2E2E2E] text-xs font-sans text-[#FFFFFF] focus:outline-none focus:border-[#D8C3A5]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-sans tracking-[0.14em] uppercase text-[#EDEDED] font-medium mb-1">
                        Hero Editorial Headline
                      </label>
                      <input
                        type="text"
                        value={bannerForm.headline}
                        onChange={(e) =>
                          setBannerForm({ ...bannerForm, headline: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-[#1C1C1C] border border-[#2E2E2E] font-serif text-lg text-[#FFFFFF] focus:outline-none focus:border-[#D8C3A5]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-sans tracking-[0.14em] uppercase text-[#EDEDED] font-medium mb-1">
                        Hero Subheadline
                      </label>
                      <textarea
                        rows={3}
                        value={bannerForm.subheadline}
                        onChange={(e) =>
                          setBannerForm({ ...bannerForm, subheadline: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-[#1C1C1C] border border-[#2E2E2E] text-xs font-sans text-[#FFFFFF] focus:outline-none focus:border-[#D8C3A5]"
                      />
                    </div>

                    <ImageUploader
                      label="Hero Editorial Campaign Photo"
                      value={bannerForm.imageUrl}
                      onChange={(url) => setBannerForm({ ...bannerForm, imageUrl: url })}
                      folder="banner"
                      aspectRatio="16/9"
                      helperText="Recommended 16:9 high-resolution landscape photograph for the homepage hero spread"
                      required
                    />

                    <div className="pt-4 border-t border-[#222222]">
                      <button
                        type="submit"
                        disabled={isSavingBanner}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFFFFF] text-[#0A0A0A] hover:bg-[#D8C3A5] hover:text-[#0A0A0A] text-xs font-sans tracking-[0.18em] uppercase font-semibold transition-colors cursor-pointer shadow-lg shadow-black/50"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isSavingBanner ? 'Updating...' : 'Publish Hero Changes'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </main>
          </div>
        )}
      </div>

      {/* MODAL: ADD / EDIT PRODUCT */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-60 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#262626] p-6 max-w-2xl w-full shadow-2xl space-y-4 my-8 text-[#EDEDED]">
            <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
              <h4 className="font-serif text-xl text-[#FFFFFF]">
                {editingProduct.id.startsWith('prod-') ? 'Edit Garment' : 'New Garment'}
              </h4>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 text-[#8E8E8E] hover:text-[#FFFFFF] hover:bg-[#1C1C1C] rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProductSubmit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] tracking-[0.14em] uppercase text-[#EDEDED] font-semibold mb-1">
                    Garment Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.title}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, title: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#1C1C1C] border border-[#2E2E2E] text-xs text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#D8C3A5]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.14em] uppercase text-[#EDEDED] font-semibold mb-1">
                    Brand / Atelier
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.brand}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, brand: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#1C1C1C] border border-[#2E2E2E] text-xs text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#D8C3A5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] tracking-[0.14em] uppercase text-[#EDEDED] font-semibold mb-1">
                    Category
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, category: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#1C1C1C] border border-[#2E2E2E] text-xs text-[#FFFFFF] focus:outline-none focus:border-[#D8C3A5] uppercase cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.14em] uppercase text-[#EDEDED] font-semibold mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#1C1C1C] border border-[#2E2E2E] text-xs text-[#FFFFFF] focus:outline-none focus:border-[#D8C3A5]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.14em] uppercase text-[#EDEDED] font-semibold mb-1">
                    Original Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        originalPrice: parseFloat(e.target.value) || undefined,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#1C1C1C] border border-[#2E2E2E] text-xs text-[#FFFFFF] focus:outline-none focus:border-[#D8C3A5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.14em] uppercase text-[#EDEDED] font-semibold mb-1">
                  Amazon Affiliate Destination URL
                </label>
                <input
                  type="url"
                  required
                  value={editingProduct.amazonUrl}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, amazonUrl: e.target.value })
                  }
                  placeholder="https://www.amazon.com/dp/.../?tag=yatrababa-20"
                  className="w-full px-3 py-2 bg-[#1C1C1C] border border-[#2E2E2E] text-xs text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#D8C3A5]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUploader
                  label="Primary Garment Image"
                  value={editingProduct.imageUrl}
                  onChange={(url) =>
                    setEditingProduct({ ...editingProduct, imageUrl: url })
                  }
                  folder="products"
                  aspectRatio="3/4"
                  helperText="Portrait 3:4 ratio recommended"
                  required
                />
                <ImageUploader
                  label="Secondary Angle (Optional)"
                  value={editingProduct.secondaryImageUrl || ''}
                  onChange={(url) =>
                    setEditingProduct({
                      ...editingProduct,
                      secondaryImageUrl: url,
                    })
                  }
                  folder="products"
                  aspectRatio="3/4"
                  helperText="Shown on hover or thumbnail click"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.14em] uppercase text-[#EDEDED] font-semibold mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#1C1C1C] border border-[#2E2E2E] text-xs text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#D8C3A5]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] tracking-[0.14em] uppercase text-[#EDEDED] font-semibold mb-1">
                    Fabrication / Material
                  </label>
                  <input
                    type="text"
                    value={editingProduct.material}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, material: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#1C1C1C] border border-[#2E2E2E] text-xs text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#D8C3A5]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.14em] uppercase text-[#EDEDED] font-semibold mb-1">
                    Fit Details
                  </label>
                  <input
                    type="text"
                    value={editingProduct.fitDetails}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, fitDetails: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#1C1C1C] border border-[#2E2E2E] text-xs text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#D8C3A5]"
                  />
                </div>
              </div>

              {/* Status and Flags */}
              <div className="flex flex-wrap items-center gap-6 pt-2 pb-2 border-y border-[#222222]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.status === 'published'}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        status: e.target.checked ? 'published' : 'draft',
                      })
                    }
                    className="w-4 h-4 accent-[#D8C3A5]"
                  />
                  <span className="font-medium text-[#FFFFFF]">Published</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isFeatured}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        isFeatured: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-[#D8C3A5]"
                  />
                  <span>Featured Collection</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isTrending}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        isTrending: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-[#D8C3A5]"
                  />
                  <span>Trending</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isNew}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        isNew: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-[#D8C3A5]"
                  />
                  <span>New In</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-[#2E2E2E] text-[#EDEDED] hover:bg-[#1C1C1C] uppercase tracking-[0.1em] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#FFFFFF] text-[#0A0A0A] hover:bg-[#D8C3A5] hover:text-[#0A0A0A] uppercase tracking-[0.14em] font-semibold transition-colors cursor-pointer shadow-md"
                >
                  Save Garment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT CATEGORY */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-60 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#262626] p-6 max-w-lg w-full shadow-2xl space-y-4 text-[#EDEDED]">
            <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
              <h4 className="font-serif text-xl text-[#FFFFFF]">
                {editingCategory.name ? 'Edit Category' : 'New Category'}
              </h4>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 text-[#8E8E8E] hover:text-[#FFFFFF] hover:bg-[#1C1C1C] rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategorySubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[10px] tracking-[0.14em] uppercase text-[#EDEDED] font-semibold mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    setEditingCategory({ ...editingCategory, name, slug });
                  }}
                  className="w-full px-3 py-2 bg-[#1C1C1C] border border-[#2E2E2E] text-xs text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#D8C3A5]"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.14em] uppercase text-[#EDEDED] font-semibold mb-1">
                  Category Slug
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.slug}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, slug: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#1C1C1C] border border-[#2E2E2E] text-xs text-[#D8C3A5] focus:outline-none focus:border-[#D8C3A5] font-mono"
                />
              </div>

              <ImageUploader
                label="Category Cover Image"
                value={editingCategory.imageUrl}
                onChange={(url) =>
                  setEditingCategory({ ...editingCategory, imageUrl: url })
                }
                folder="categories"
                aspectRatio="4/3"
                helperText="Landscape 4:3 ratio recommended"
                required
              />

              <div>
                <label className="block text-[10px] tracking-[0.14em] uppercase text-[#EDEDED] font-semibold mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingCategory.description}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-[#1C1C1C] border border-[#2E2E2E] text-xs text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#D8C3A5]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 border border-[#2E2E2E] text-[#EDEDED] hover:bg-[#1C1C1C] uppercase tracking-[0.1em] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#FFFFFF] text-[#0A0A0A] hover:bg-[#D8C3A5] hover:text-[#0A0A0A] uppercase tracking-[0.14em] font-semibold transition-colors cursor-pointer shadow-md"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
