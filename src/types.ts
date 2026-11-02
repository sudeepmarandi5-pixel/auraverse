/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  secondaryImageUrl?: string;
  amazonUrl: string;
  description: string;
  material: string;
  fitDetails: string;
  isFeatured: boolean;
  isTrending: boolean;
  isNew: boolean;
  status: 'published' | 'draft';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  itemCount: number;
}

export interface BannerSettings {
  issueNumber: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  announcement: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  role: 'admin' | 'editor';
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}
