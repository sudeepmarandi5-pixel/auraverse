/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  type StorageReference,
} from '@firebase/storage';
import { storage, auth } from '../lib/firebase';

export interface UploadProgressDetails {
  progress: number; // 0 to 100
  bytesTransferred: number;
  totalBytes: number;
}

/**
 * Checks if a given URL points to a file in Firebase Storage.
 */
export function isFirebaseStorageUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  return (
    url.includes('firebasestorage.googleapis.com') ||
    url.includes('storage.googleapis.com') ||
    url.startsWith('gs://')
  );
}

/**
 * Parses a Firebase Storage reference from either a download URL or storage path.
 */
export function getStorageRefFromUrl(url: string): StorageReference | null {
  if (!storage || !isFirebaseStorageUrl(url)) return null;

  try {
    // Modular SDK ref can directly parse gs:// and https://firebasestorage.googleapis.com/... URLs
    return ref(storage, url);
  } catch (err) {
    console.warn('Could not parse storage reference directly from URL:', err);
    return null;
  }
}

/**
 * Formats Firebase Storage errors into human-readable messages.
 */
function formatStorageError(error: any): string {
  if (!error) return 'An unknown error occurred while communicating with Firebase Storage.';
  const code = error.code || '';
  const message = error.message || '';

  if (code === 'storage/unauthorized') {
    return 'Permission Denied: You do not have permission to upload to Firebase Storage. Please ensure you are signed in as an authorized administrator.';
  }
  if (code === 'storage/canceled') {
    return 'The image upload was cancelled.';
  }
  if (code === 'storage/quota-exceeded') {
    return 'Firebase Storage Quota Exceeded: The free quota limit has been reached on this Firebase project.';
  }
  if (code === 'storage/retry-limit-exceeded') {
    return 'Upload timed out. Please check your internet connection and try again.';
  }
  if (code === 'storage/invalid-checksum') {
    return 'File checksum mismatch. Please re-select the image and try again.';
  }
  if (code === 'storage/bucket-not-found' || message.includes('bucket')) {
    return 'Firebase Storage bucket not found or not initialized in Firebase Console. Please verify Cloud Storage is activated.';
  }
  if (code === 'storage/project-not-found') {
    return 'Firebase Project not found. Please verify your Firebase project configuration.';
  }

  return message || 'Failed to upload image to Firebase Storage.';
}

/**
 * Uploads an image file to Firebase Storage using the modular SDK.
 *
 * @param file The image File to upload
 * @param folder Destination directory (e.g. 'products', 'categories', 'banner')
 * @param onProgress Optional callback receiving progress percentage and byte counts
 * @returns Resolves with the public Firebase Storage download URL
 */
export async function uploadImageFile(
  file: File,
  folder: string = 'products',
  onProgress?: (progressDetails: UploadProgressDetails) => void
): Promise<string> {
  // 1. Verify Storage SDK is initialized
  if (!storage) {
    throw new Error(
      'Firebase Storage is not initialized. Please ensure your Firebase configuration is valid.'
    );
  }

  // 2. Authentication check: Must be signed in with Firebase Auth
  const currentUser = auth?.currentUser;
  if (!currentUser) {
    throw new Error(
      'Authentication Required: You must be signed in as an authorized administrator to upload images to Firebase Storage.'
    );
  }

  // 3. File type validation
  const validTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/gif',
    'image/svg+xml',
  ];
  if (!file.type || !validTypes.includes(file.type.toLowerCase())) {
    throw new Error(
      `Unsupported file type (${file.type || 'unknown'}). Please upload a JPEG, PNG, WebP, AVIF, or GIF image.`
    );
  }

  // 4. File size validation (10 MB limit)
  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(
      `Image size (${sizeInMB} MB) exceeds the 10 MB maximum limit. Please compress or resize the photograph.`
    );
  }

  // 5. Generate secure, unique storage path
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const uniqueStoragePath = `${folder}/${Date.now()}_${sanitizedName}`;
  const storageRef = ref(storage, uniqueStoragePath);

  // 6. Define metadata
  const metadata = {
    contentType: file.type,
    cacheControl: 'public, max-age=31536000',
    customMetadata: {
      originalName: file.name,
      uploadedBy: currentUser.email || currentUser.uid,
      uploadedAt: new Date().toISOString(),
    },
  };

  // 7. Execute resumable upload with real progress tracking
  return new Promise<string>((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const percent = snapshot.totalBytes > 0
          ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          : 0;

        if (onProgress) {
          onProgress({
            progress: percent,
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
          });
        }
      },
      (error) => {
        const friendlyMessage = formatStorageError(error);
        console.error('Firebase Storage upload failed:', error);
        reject(new Error(friendlyMessage));
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (downloadErr) {
          const friendlyMessage = formatStorageError(downloadErr);
          console.error('Failed to get download URL from Storage:', downloadErr);
          reject(new Error(friendlyMessage));
        }
      }
    );
  });
}

/**
 * Safely deletes an image from Firebase Storage if it resides there.
 *
 * @param imageUrl The URL of the image to delete
 * @returns True if deleted successfully, false if not a storage URL or not found
 */
export async function deleteImageFromStorage(imageUrl: string): Promise<boolean> {
  if (!imageUrl || !isFirebaseStorageUrl(imageUrl) || !storage) {
    return false;
  }

  // If user is not authenticated, cannot perform delete
  if (!auth?.currentUser) {
    console.warn('Cannot delete image from Storage: User is not authenticated.');
    return false;
  }

  try {
    const storageRef = getStorageRefFromUrl(imageUrl);
    if (!storageRef) return false;

    await deleteObject(storageRef);
    console.info(`Successfully deleted image from Firebase Storage: ${imageUrl}`);
    return true;
  } catch (err: any) {
    // If the object was already deleted or doesn't exist, handle gracefully
    if (err?.code === 'storage/object-not-found') {
      console.info('Storage object already deleted or does not exist:', imageUrl);
      return false;
    }
    console.warn('Could not delete image from Firebase Storage:', err);
    return false;
  }
}
