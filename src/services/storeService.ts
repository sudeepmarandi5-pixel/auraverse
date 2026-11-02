/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Category, BannerSettings } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BANNER_SETTINGS } from '../data/initialData';
import { db, isFirebaseConfigured, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';
import { deleteImageFromStorage } from './storageService';

const PRODUCTS_STORAGE_KEY = 'yatrababa_products_v2';
const CATEGORIES_STORAGE_KEY = 'yatrababa_categories_v2';
const BANNER_STORAGE_KEY = 'yatrababa_banner_v2';
const WISHLIST_STORAGE_KEY = 'yatrababa_wishlist_v2';

export class StoreService {
  // --- Seed initial data to Firestore ---
  static async seedFirestore(): Promise<void> {
    if (!isFirebaseConfigured || !db) return;

    try {
      // Seed products
      for (const prod of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), prod, { merge: true });
      }

      // Seed categories
      for (const cat of INITIAL_CATEGORIES) {
        await setDoc(doc(db, 'categories', cat.id), cat, { merge: true });
      }

      // Seed banner
      await setDoc(doc(db, 'settings', 'banner'), INITIAL_BANNER_SETTINGS, { merge: true });
      console.info('Firestore seeded with initial editorial data successfully.');
    } catch (err) {
      console.warn('Seed to Firestore error:', err);
    }
  }

  // --- Products ---
  static async getProducts(): Promise<Product[]> {
    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        if (!querySnapshot.empty) {
          const prods: Product[] = [];
          querySnapshot.forEach((d) => prods.push({ id: d.id, ...d.data() } as Product));
          const saree = INITIAL_PRODUCTS[0];
          const existingSaree = prods.find((p) => p.id === 'prod-saree-ivory-sage');
          if (existingSaree) {
            existingSaree.imageUrl = saree.imageUrl;
            existingSaree.secondaryImageUrl = saree.secondaryImageUrl;
            setDoc(doc(db, 'products', saree.id), existingSaree, { merge: true }).catch(() => {});
          } else {
            prods.unshift(saree);
            setDoc(doc(db, 'products', saree.id), saree, { merge: true }).catch(() => {});
          }
          localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(prods));
          return prods;
        } else {
          // Auto-seed if newly provisioned database is empty
          await this.seedFirestore();
          return INITIAL_PRODUCTS;
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'products');
      }
    }

    const local = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (local) {
      try {
        const parsed: Product[] = JSON.parse(local);
        const saree = INITIAL_PRODUCTS[0];
        const existingSaree = parsed.find((p) => p.id === 'prod-saree-ivory-sage');
        if (existingSaree) {
          existingSaree.imageUrl = saree.imageUrl;
          existingSaree.secondaryImageUrl = saree.secondaryImageUrl;
        } else {
          parsed.unshift(saree);
        }
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(parsed));
        return parsed;
      } catch {
        // fallback
      }
    }
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }

  static async saveProduct(product: Product): Promise<void> {
    const products = await this.getProducts();
    const existingIndex = products.findIndex((p) => p.id === product.id);

    // If an existing product image is being replaced, safely delete the previous image from Storage
    if (existingIndex >= 0) {
      const oldProduct = products[existingIndex];
      if (oldProduct.imageUrl && oldProduct.imageUrl !== product.imageUrl) {
        deleteImageFromStorage(oldProduct.imageUrl).catch((err) =>
          console.warn('Could not clean up replaced product image:', err)
        );
      }
      if (
        oldProduct.secondaryImageUrl &&
        oldProduct.secondaryImageUrl !== product.secondaryImageUrl
      ) {
        deleteImageFromStorage(oldProduct.secondaryImageUrl).catch((err) =>
          console.warn('Could not clean up replaced secondary product image:', err)
        );
      }
      products[existingIndex] = product;
    } else {
      products.unshift(product);
    }
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'products', product.id), product, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `products/${product.id}`);
      }
    }
  }

  static async deleteProduct(id: string): Promise<void> {
    const products = await this.getProducts();
    const productToDelete = products.find((p) => p.id === id);

    // Safely delete associated image(s) from Firebase Storage
    if (productToDelete) {
      if (productToDelete.imageUrl) {
        deleteImageFromStorage(productToDelete.imageUrl).catch((err) =>
          console.warn('Could not delete product primary image from Storage:', err)
        );
      }
      if (productToDelete.secondaryImageUrl) {
        deleteImageFromStorage(productToDelete.secondaryImageUrl).catch((err) =>
          console.warn('Could not delete product secondary image from Storage:', err)
        );
      }
    }

    const filtered = products.filter((p) => p.id !== id);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(filtered));

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
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
          const sareeCat = INITIAL_CATEGORIES.find((c) => c.id === 'cat-3');
          const existingCat = cats.find((c) => c.id === 'cat-3');
          if (existingCat && sareeCat) {
            existingCat.imageUrl = sareeCat.imageUrl;
          }
          localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(cats));
          return cats;
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'categories');
      }
    }

    const local = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (local) {
      try {
        const parsed: Category[] = JSON.parse(local);
        const sareeCat = INITIAL_CATEGORIES.find((c) => c.id === 'cat-3');
        const existingCat = parsed.find((c) => c.id === 'cat-3');
        if (existingCat && sareeCat) {
          existingCat.imageUrl = sareeCat.imageUrl;
        }
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(parsed));
        return parsed;
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
      const oldCat = categories[idx];
      if (oldCat.imageUrl && oldCat.imageUrl !== category.imageUrl) {
        deleteImageFromStorage(oldCat.imageUrl).catch((err) =>
          console.warn('Could not clean up replaced category image:', err)
        );
      }
      categories[idx] = category;
    } else {
      categories.push(category);
    }
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'categories', category.id), category, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `categories/${category.id}`);
      }
    }
  }

  static async deleteCategory(id: string): Promise<void> {
    const categories = await this.getCategories();
    const catToDelete = categories.find((c) => c.id === id);

    if (catToDelete && catToDelete.imageUrl) {
      deleteImageFromStorage(catToDelete.imageUrl).catch((err) =>
        console.warn('Could not delete category image from Storage:', err)
      );
    }

    const filtered = categories.filter((c) => c.id !== id);
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(filtered));

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'categories', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `categories/${id}`);
      }
    }
  }

  // --- Banner Settings ---
  static async getBannerSettings(): Promise<BannerSettings> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDoc(doc(db, 'settings', 'banner'));
        if (snap.exists()) {
          const data = snap.data() as BannerSettings;
          localStorage.setItem(BANNER_STORAGE_KEY, JSON.stringify(data));
          return data;
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'settings/banner');
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
    const currentBanner = await this.getBannerSettings();
    if (currentBanner.imageUrl && currentBanner.imageUrl !== settings.imageUrl) {
      deleteImageFromStorage(currentBanner.imageUrl).catch((err) =>
        console.warn('Could not clean up replaced banner image:', err)
      );
    }

    localStorage.setItem(BANNER_STORAGE_KEY, JSON.stringify(settings));

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'settings', 'banner'), settings, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'settings/banner');
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

  // Reset to initial demo data & re-sync to Firestore
  static async resetToDefault(): Promise<{ products: Product[]; categories: Category[]; banner: BannerSettings }> {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(BANNER_STORAGE_KEY, JSON.stringify(INITIAL_BANNER_SETTINGS));
    await this.seedFirestore();
    return {
      products: INITIAL_PRODUCTS,
      categories: INITIAL_CATEGORIES,
      banner: INITIAL_BANNER_SETTINGS,
    };
  }
}
