/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

/**
 * Uploads an image file to Firebase Storage with automatic fallback to data URL.
 *
 * @param file The image file to upload
 * @param folder Directory inside storage bucket (e.g. 'products', 'categories', 'hero')
 * @param onProgress Callback function reporting upload percentage (0-100)
 * @returns Resolves with the image URL
 */
export async function uploadImageFile(
  file: File,
  folder: string = 'products',
  onProgress?: (progress: number) => void
): Promise<string> {
  // Validate file
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file (JPEG, PNG, WebP, etc.)');
  }

  // Max 10MB file check
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Image size exceeds 10MB limit. Please choose a smaller photo.');
  }

  if (storage) {
    try {
      const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storageRef = ref(storage, `${folder}/${Date.now()}_${cleanName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return await new Promise<string>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onProgress) onProgress(Math.round(progress));
          },
          (error) => {
            console.warn('Firebase Storage direct upload error, using local data URL fallback:', error);
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error('Failed to read image file'));
            reader.readAsDataURL(file);
          },
          async () => {
            try {
              const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadUrl);
            } catch (err) {
              console.warn('getDownloadURL failed, using local data URL fallback:', err);
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = () => reject(new Error('Failed to read image file'));
              reader.readAsDataURL(file);
            }
          }
        );
      });
    } catch (err) {
      console.warn('Storage reference error, using FileReader fallback:', err);
    }
  }

  // Direct FileReader fallback
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Could not read image file'));
    reader.readAsDataURL(file);
  });
}
