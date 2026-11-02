/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Category, BannerSettings } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BANNER_SETTINGS } from '../data/initialData';
import { db, isFirebaseConfigured } from '../lib/firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';

const PRODUCTS_STORAGE_KEY = 'yatrababa_products_v2';
const CATEGORIES_STORAGE_KEY = 'yatrababa_categories_v2';
const BANNER_STORAGE_KEY = 'yatrababa_banner_v2';
const WISHLIST_STORAGE_KEY = 'yatrababa_wishlist_v2';

export class StoreService {
  // --- Products ---
  static async getProducts(): Promise<Product[]> {
    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        if (!querySnapshot.empty) {
          const prods: Product[] = [];
          querySnapshot.forEach((d) => prods.push({ id: d.id, ...d.data() } as Product));
          return prods;
        }
      } catch (err) {
        console.warn('Firestore fetch failed, falling back to local store:', err);
      }
    }

    const local = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // fallback
      }
    }
    // Seed initial
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }

  static async saveProduct(product: Product): Promise<void> {
    const products = await this.getProducts();
    const existingIndex = products.findIndex((p) => p.id === product.id);

    if (existingIndex >= 0) {
      products[existingIndex] = product;
    } else {
      products.unshift(product);
    }

    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'products', product.id), product);
      } catch (err) {
        console.warn('Firestore product write failed:', err);
      }
    }
  }

  static async deleteProduct(id: string): Promise<void> {
    const products = await this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(filtered));

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (err) {
        console.warn('Firestore product delete failed:', err);
      }
    }
  }

  // --- Categories ---
  static async getCategories(): Promise<Category[]> {
    if (isFirebaseConfigured && db) {
      try {
        const snapshot = await getDocs(collection(db, 'categories'));
        if (!snapshot.empty) {
          const cats: Category[] = [];
          snapshot.forEach((d) => cats.push({ id: d.id, ...d.data() } as Category));
          return cats;
        }
      } catch (err) {
        console.warn('Firestore categories fetch notice:', err);
      }
    }

    const local = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // fallback
      }
    }
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
    return INITIAL_CATEGORIES;
  }

  static async saveCategory(category: Category): Promise<void> {
    const categories = await this.getCategories();
    const idx = categories.findIndex((c) => c.id === category.id);
    if (idx >= 0) {
      categories[idx] = category;
    } else {
      categories.push(category);
    }
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'categories', category.id), category);
      } catch (err) {
        console.warn('Firestore category write failed:', err);
      }
    }
  }

  static async deleteCategory(id: string): Promise<void> {
    const categories = await this.getCategories();
    const filtered = categories.filter((c) => c.id !== id);
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(filtered));

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'categories', id));
      } catch (err) {
        console.warn('Firestore category delete failed:', err);
      }
    }
  }

  // --- Banner Settings ---
  static async getBannerSettings(): Promise<BannerSettings> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDoc(doc(db, 'settings', 'banner'));
        if (snap.exists()) {
          return snap.data() as BannerSettings;
        }
      } catch (err) {
        console.warn('Firestore banner fetch notice:', err);
      }
    }

    const local = localStorage.getItem(BANNER_STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // fallback
      }
    }
    localStorage.setItem(BANNER_STORAGE_KEY, JSON.stringify(INITIAL_BANNER_SETTINGS));
    return INITIAL_BANNER_SETTINGS;
  }

  static async saveBannerSettings(settings: BannerSettings): Promise<void> {
    localStorage.setItem(BANNER_STORAGE_KEY, JSON.stringify(settings));

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'settings', 'banner'), settings);
      } catch (err) {
        console.warn('Firestore banner save failed:', err);
      }
    }
  }

  // --- Wishlist ---
  static getWishlist(): string[] {
    try {
      const local = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  }

  static toggleWishlist(productId: string): string[] {
    const list = this.getWishlist();
    const exists = list.includes(productId);
    const updated = exists ? list.filter((id) => id !== productId) : [...list, productId];
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }

  // Reset to initial demo data
  static resetToDefault(): { products: Product[]; categories: Category[]; banner: BannerSettings } {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(BANNER_STORAGE_KEY, JSON.stringify(INITIAL_BANNER_SETTINGS));
    return {
      products: INITIAL_PRODUCTS,
      categories: INITIAL_CATEGORIES,
      banner: INITIAL_BANNER_SETTINGS,
    };
  }
}
