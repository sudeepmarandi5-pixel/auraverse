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
  onLogin: (email: string) => void;
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
  onLogin,
  onLogout,
}) => {
  if (!isOpen) return null;

  // Tabs: 'products' | 'categories' | 'banner'
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'banner'>('products');

  // Auth form state
  const [loginEmail, setLoginEmail] = useState('editor@yatrababa.com');
  const [loginPassword, setLoginPassword] = useState('yatrababa2026');

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
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
    >
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-[#FFFFFF] w-full max-w-6xl h-[92vh] border border-[#E8DFD3] shadow-2xl z-10 flex flex-col overflow-hidden">
        
        {/* Top Bar */}
        <div className="px-6 py-4 bg-[#FFFFFF] border-b border-[#E8DFD3] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-[#171717] text-white flex items-center justify-center font-serif text-lg">
              Y
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#171717] font-normal leading-tight">
                Yatrababa Admin Portal
              </h2>
              <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#171717]/60 block">
                Editorial Control & Catalog Management
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={onLogout}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans tracking-[0.14em] uppercase text-[#171717]/70 hover:text-[#171717] border border-[#E8DFD3] hover:bg-[#F5F0E8] transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-[#171717] hover:bg-[#F5F0E8] rounded-full transition-colors cursor-pointer"
              aria-label="Close admin dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* If Not Authenticated: Login Screen */}
        {!isAdmin ? (
          <div className="flex-grow flex items-center justify-center p-6 bg-[#F5F0E8]">
            <div className="bg-white border border-[#E8DFD3] p-8 max-w-md w-full shadow-lg">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full border border-[#D8C3A5] bg-[#F5F0E8] flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-5 h-5 text-[#171717]" />
                </div>
                <h3 className="font-serif text-2xl text-[#171717] font-normal">
                  Editor Sign In
                </h3>
                <p className="text-xs font-sans tracking-[0.12em] uppercase text-[#171717]/60 mt-1">
                  Authenticate with your Yatrababa credentials
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F5F0E8] border border-[#D8C3A5] text-[10px] uppercase font-sans tracking-widest text-[#171717]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  <span>Cloud Firestore Online</span>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onLogin(loginEmail);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[11px] font-sans tracking-[0.14em] uppercase text-[#171717] font-medium mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-[#E8DFD3] text-sm text-[#171717] focus:outline-none focus:border-[#171717]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-sans tracking-[0.14em] uppercase text-[#171717] font-medium mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-[#E8DFD3] text-sm text-[#171717] focus:outline-none focus:border-[#171717]"
                  />
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#171717] text-white hover:bg-[#D8C3A5] hover:text-[#171717] text-xs font-sans tracking-[0.18em] uppercase font-semibold transition-colors cursor-pointer"
                  >
                    Enter Editorial Dashboard
                  </button>
                </div>

                <p className="text-[10px] font-sans text-center text-[#171717]/60 tracking-[0.1em] uppercase pt-2">
                  Verified for sudeep.marandi5@gmail.com · Instant Login Enabled
                </p>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-[#F5F0E8] border-b md:border-b-0 md:border-r border-[#E8DFD3] p-4 flex md:flex-col justify-between shrink-0">
              <div className="space-y-1 w-full flex md:flex-col gap-1 md:gap-1 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('products')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-sans tracking-[0.14em] uppercase font-medium rounded-xs transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === 'products'
                      ? 'bg-[#FFFFFF] text-[#171717] border border-[#D8C3A5] shadow-2xs font-semibold'
                      : 'text-[#171717]/70 hover:bg-[#FFFFFF]/60'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-[#171717]" />
                  <span>Products ({products.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('categories')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-sans tracking-[0.14em] uppercase font-medium rounded-xs transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === 'categories'
                      ? 'bg-[#FFFFFF] text-[#171717] border border-[#D8C3A5] shadow-2xs font-semibold'
                      : 'text-[#171717]/70 hover:bg-[#FFFFFF]/60'
                  }`}
                >
                  <Layers className="w-4 h-4 text-[#171717]" />
                  <span>Categories ({categories.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('banner')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-sans tracking-[0.14em] uppercase font-medium rounded-xs transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === 'banner'
                      ? 'bg-[#FFFFFF] text-[#171717] border border-[#D8C3A5] shadow-2xs font-semibold'
                      : 'text-[#171717]/70 hover:bg-[#FFFFFF]/60'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 text-[#171717]" />
                  <span>Hero & Banner</span>
                </button>
              </div>

              {/* Bottom Quick Tools in Sidebar */}
              <div className="hidden md:block pt-4 border-t border-[#E8DFD3] space-y-2">
                <div className="p-3 bg-white border border-[#E8DFD3] text-[11px] font-sans text-[#171717]/70">
                  <div className="font-semibold text-[#171717] mb-1">Catalog Status</div>
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
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-[10px] font-sans tracking-[0.12em] uppercase text-[#171717]/70 hover:text-[#171717] border border-[#E8DFD3] bg-white hover:bg-[#F5F0E8] transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Default Edit</span>
                </button>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-[#FFFFFF] overflow-y-auto">
              
              {/* TAB 1: PRODUCTS */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  {/* Top Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DFD3]">
                    <div>
                      <h3 className="font-serif text-2xl text-[#171717] font-normal">
                        Garment Catalog
                      </h3>
                      <p className="text-xs font-sans text-[#171717]/60 tracking-[0.12em] uppercase">
                        Create, edit, and organize Amazon affiliate fashion pieces
                      </p>
                    </div>

                    <button
                      onClick={handleOpenNewProduct}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#171717] text-white hover:bg-[#D8C3A5] hover:text-[#171717] text-xs font-sans tracking-[0.16em] uppercase font-semibold transition-colors cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>New Garment</span>
                    </button>
                  </div>

                  {/* Filters Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-[#F5F0E8] p-3 border border-[#E8DFD3]">
                    <div className="sm:col-span-8">
                      <input
                        type="text"
                        placeholder="Search garments by title or brand..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#E8DFD3] text-xs font-sans text-[#171717] focus:outline-none focus:border-[#171717]"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#E8DFD3] text-xs font-sans uppercase tracking-[0.1em] text-[#171717] focus:outline-none"
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
                  <div className="border border-[#E8DFD3] overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead className="bg-[#F5F0E8] border-b border-[#E8DFD3] text-[10px] tracking-[0.16em] uppercase text-[#171717]/80">
                        <tr>
                          <th className="py-3 px-4">Garment</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Price</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Tags</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8DFD3]">
                        {filteredProducts.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-[#171717]/60">
                              No garments found matching filter criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredProducts.map((p) => (
                            <tr key={p.id} className="hover:bg-[#F5F0E8]/50 transition-colors">
                              <td className="py-3 px-4 flex items-center gap-3">
                                <div className="w-10 h-12 bg-[#F5F0E8] border border-[#E8DFD3] shrink-0 overflow-hidden">
                                  <img
                                    src={p.imageUrl}
                                    alt={p.title}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <span className="font-serif text-sm text-[#171717] font-normal block truncate max-w-xs">
                                    {p.title}
                                  </span>
                                  <span className="text-[10px] text-[#171717]/60 uppercase tracking-[0.12em]">
                                    {p.brand}
                                  </span>
                                </div>
                              </td>

                              <td className="py-3 px-4 uppercase text-[11px] text-[#171717]/70">
                                {p.category}
                              </td>

                              <td className="py-3 px-4 font-semibold tabular-nums text-[#171717]">
                                ${p.price.toFixed(2)}
                              </td>

                              <td className="py-3 px-4">
                                <span
                                  className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] font-medium border ${
                                    p.status === 'published'
                                      ? 'bg-white text-[#171717] border-[#171717]'
                                      : 'bg-[#F5F0E8] text-[#171717]/60 border-[#E8DFD3]'
                                  }`}
                                >
                                  {p.status}
                                </span>
                              </td>

                              <td className="py-3 px-4 text-[10px] uppercase tracking-[0.1em] text-[#171717]/60 space-x-1">
                                {p.isFeatured && <span>[Featured]</span>}
                                {p.isTrending && <span>[Trending]</span>}
                                {p.isNew && <span>[New]</span>}
                              </td>

                              <td className="py-3 px-4 text-right space-x-2">
                                <button
                                  onClick={() => handleEditProduct(p)}
                                  className="p-1.5 text-[#171717] hover:bg-[#F5F0E8] border border-[#E8DFD3] rounded-xs cursor-pointer"
                                  title="Edit Garment"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProductClick(p.id, p.title)}
                                  className="p-1.5 text-[#171717]/70 hover:text-red-700 hover:bg-red-50 border border-[#E8DFD3] rounded-xs cursor-pointer"
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DFD3]">
                    <div>
                      <h3 className="font-serif text-2xl text-[#171717] font-normal">
                        Category Management
                      </h3>
                      <p className="text-xs font-sans text-[#171717]/60 tracking-[0.12em] uppercase">
                        Organize collections, imagery, and taxonomy
                      </p>
                    </div>

                    <button
                      onClick={handleOpenNewCategory}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#171717] text-white hover:bg-[#D8C3A5] hover:text-[#171717] text-xs font-sans tracking-[0.16em] uppercase font-semibold transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>New Category</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories.map((c) => (
                      <div
                        key={c.id}
                        className="p-4 bg-white border border-[#E8DFD3] hover:border-[#D8C3A5] transition-colors flex gap-4 items-center justify-between"
                      >
                        <div className="w-16 h-16 bg-[#F5F0E8] border border-[#E8DFD3] shrink-0 overflow-hidden">
                          <img
                            src={c.imageUrl}
                            alt={c.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-grow min-w-0">
                          <h4 className="font-serif text-lg text-[#171717] font-normal truncate">
                            {c.name}
                          </h4>
                          <span className="text-[10px] font-sans tracking-[0.14em] uppercase text-[#171717]/60 block">
                            Slug: {c.slug} · {c.itemCount} items
                          </span>
                          <p className="text-xs text-[#171717]/70 font-light truncate mt-0.5">
                            {c.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              setEditingCategory({ ...c });
                              setIsCategoryModalOpen(true);
                            }}
                            className="p-2 border border-[#E8DFD3] hover:bg-[#F5F0E8] text-[#171717] rounded-xs cursor-pointer"
                            title="Edit Category"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategoryClick(c.id, c.name)}
                            className="p-2 border border-[#E8DFD3] hover:bg-red-50 text-[#171717]/70 hover:text-red-700 rounded-xs cursor-pointer"
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
                  <div className="pb-4 border-b border-[#E8DFD3]">
                    <h3 className="font-serif text-2xl text-[#171717] font-normal">
                      Homepage & Hero Settings
                    </h3>
                    <p className="text-xs font-sans text-[#171717]/60 tracking-[0.12em] uppercase">
                      Update seasonal campaign headline, announcement ticker, and hero visual
                    </p>
                  </div>

                  <form onSubmit={handleSaveBannerSubmit} className="space-y-5">
                    <div>
                      <label className="block text-[11px] font-sans tracking-[0.14em] uppercase text-[#171717] font-medium mb-1">
                        Top Announcement Bar Ticker
                      </label>
                      <input
                        type="text"
                        value={bannerForm.announcement}
                        onChange={(e) =>
                          setBannerForm({ ...bannerForm, announcement: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white border border-[#E8DFD3] text-xs font-sans text-[#171717] focus:outline-none focus:border-[#171717]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-sans tracking-[0.14em] uppercase text-[#171717] font-medium mb-1">
                          Issue Kicker Number
                        </label>
                        <input
                          type="text"
                          value={bannerForm.issueNumber}
                          onChange={(e) =>
                            setBannerForm({ ...bannerForm, issueNumber: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-white border border-[#E8DFD3] text-xs font-sans text-[#171717] focus:outline-none focus:border-[#171717]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-sans tracking-[0.14em] uppercase text-[#171717] font-medium mb-1">
                          Primary CTA Button Text
                        </label>
                        <input
                          type="text"
                          value={bannerForm.ctaText}
                          onChange={(e) =>
                            setBannerForm({ ...bannerForm, ctaText: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-white border border-[#E8DFD3] text-xs font-sans text-[#171717] focus:outline-none focus:border-[#171717]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-sans tracking-[0.14em] uppercase text-[#171717] font-medium mb-1">
                        Hero Editorial Headline
                      </label>
                      <input
                        type="text"
                        value={bannerForm.headline}
                        onChange={(e) =>
                          setBannerForm({ ...bannerForm, headline: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white border border-[#E8DFD3] font-serif text-lg text-[#171717] focus:outline-none focus:border-[#171717]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-sans tracking-[0.14em] uppercase text-[#171717] font-medium mb-1">
                        Hero Subheadline
                      </label>
                      <textarea
                        rows={3}
                        value={bannerForm.subheadline}
                        onChange={(e) =>
                          setBannerForm({ ...bannerForm, subheadline: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white border border-[#E8DFD3] text-xs font-sans text-[#171717] focus:outline-none focus:border-[#171717]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-sans tracking-[0.14em] uppercase text-[#171717] font-medium mb-1">
                        Hero Fashion Image URL
                      </label>
                      <input
                        type="url"
                        value={bannerForm.imageUrl}
                        onChange={(e) =>
                          setBannerForm({ ...bannerForm, imageUrl: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white border border-[#E8DFD3] text-xs font-sans text-[#171717] focus:outline-none focus:border-[#171717]"
                      />

                      {/* Image Preview */}
                      <div className="mt-3 relative aspect-[16/9] w-full max-w-md bg-[#F5F0E8] border border-[#E8DFD3] overflow-hidden">
                        <img
                          src={bannerForm.imageUrl}
                          alt="Hero Live Preview"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-2 left-2 text-[10px] font-sans tracking-[0.1em] uppercase bg-white/90 px-2 py-0.5 border border-[#E8DFD3]">
                          Live Preview
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#E8DFD3]">
                      <button
                        type="submit"
                        disabled={isSavingBanner}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#171717] text-white hover:bg-[#D8C3A5] hover:text-[#171717] text-xs font-sans tracking-[0.18em] uppercase font-semibold transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-60 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8DFD3] p-6 max-w-2xl w-full shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD3]">
              <h4 className="font-serif text-xl text-[#171717]">
                {editingProduct.id.startsWith('prod-') ? 'Edit Garment' : 'New Garment'}
              </h4>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 text-[#171717] hover:bg-[#F5F0E8] rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProductSubmit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] tracking-[0.14em] uppercase text-[#171717]/80 font-semibold mb-1">
                    Garment Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.title}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, title: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E8DFD3] text-xs focus:outline-none focus:border-[#171717]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.14em] uppercase text-[#171717]/80 font-semibold mb-1">
                    Brand / Atelier
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.brand}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, brand: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E8DFD3] text-xs focus:outline-none focus:border-[#171717]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] tracking-[0.14em] uppercase text-[#171717]/80 font-semibold mb-1">
                    Category
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, category: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E8DFD3] text-xs focus:outline-none uppercase"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.14em] uppercase text-[#171717]/80 font-semibold mb-1">
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
                    className="w-full px-3 py-2 bg-white border border-[#E8DFD3] text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.14em] uppercase text-[#171717]/80 font-semibold mb-1">
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
                    className="w-full px-3 py-2 bg-white border border-[#E8DFD3] text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.14em] uppercase text-[#171717]/80 font-semibold mb-1">
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
                  className="w-full px-3 py-2 bg-white border border-[#E8DFD3] text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] tracking-[0.14em] uppercase text-[#171717]/80 font-semibold mb-1">
                    Primary Image URL
                  </label>
                  <input
                    type="url"
                    required
                    value={editingProduct.imageUrl}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, imageUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E8DFD3] text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.14em] uppercase text-[#171717]/80 font-semibold mb-1">
                    Secondary Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={editingProduct.secondaryImageUrl || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        secondaryImageUrl: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E8DFD3] text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.14em] uppercase text-[#171717]/80 font-semibold mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border border-[#E8DFD3] text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] tracking-[0.14em] uppercase text-[#171717]/80 font-semibold mb-1">
                    Fabrication / Material
                  </label>
                  <input
                    type="text"
                    value={editingProduct.material}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, material: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E8DFD3] text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.14em] uppercase text-[#171717]/80 font-semibold mb-1">
                    Fit Details
                  </label>
                  <input
                    type="text"
                    value={editingProduct.fitDetails}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, fitDetails: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E8DFD3] text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Status and Flags */}
              <div className="flex flex-wrap items-center gap-6 pt-2 pb-2 border-y border-[#E8DFD3]">
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
                    className="w-4 h-4 accent-[#171717]"
                  />
                  <span className="font-medium text-[#171717]">Published</span>
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
                    className="w-4 h-4 accent-[#171717]"
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
                    className="w-4 h-4 accent-[#171717]"
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
                    className="w-4 h-4 accent-[#171717]"
                  />
                  <span>New In</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-[#E8DFD3] text-[#171717] hover:bg-[#F5F0E8] uppercase tracking-[0.1em]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#171717] text-white hover:bg-[#D8C3A5] hover:text-[#171717] uppercase tracking-[0.14em] font-semibold"
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
        <div className="fixed inset-0 z-60 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8DFD3] p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD3]">
              <h4 className="font-serif text-xl text-[#171717]">
                {editingCategory.name ? 'Edit Category' : 'New Category'}
              </h4>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 text-[#171717] hover:bg-[#F5F0E8] rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategorySubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[10px] tracking-[0.14em] uppercase text-[#171717]/80 font-semibold mb-1">
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
                  className="w-full px-3 py-2 bg-white border border-[#E8DFD3] text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.14em] uppercase text-[#171717]/80 font-semibold mb-1">
                  Category Slug
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.slug}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, slug: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border border-[#E8DFD3] text-xs focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.14em] uppercase text-[#171717]/80 font-semibold mb-1">
                  Category Image URL
                </label>
                <input
                  type="url"
                  required
                  value={editingCategory.imageUrl}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, imageUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border border-[#E8DFD3] text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.14em] uppercase text-[#171717]/80 font-semibold mb-1">
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
                  className="w-full px-3 py-2 bg-white border border-[#E8DFD3] text-xs focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 border border-[#E8DFD3] text-[#171717] hover:bg-[#F5F0E8] uppercase tracking-[0.1em]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#171717] text-white hover:bg-[#D8C3A5] hover:text-[#171717] uppercase tracking-[0.14em] font-semibold"
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
