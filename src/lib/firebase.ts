/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, doc, getDoc, getDocFromServer, type Firestore } from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  type Auth,
  type User,
} from 'firebase/auth';
import { getStorage, type FirebaseStorage } from '@firebase/storage';
import firebaseConfig from '@/firebase-applet-config.json';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let storage: FirebaseStorage;

// Determine storage bucket from config or env
const configuredBucket =
  (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined) ||
  firebaseConfig.storageBucket ||
  (firebaseConfig.projectId ? `${firebaseConfig.projectId}.firebasestorage.app` : undefined);

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  auth = getAuth(app);
  storage = getStorage(
    app,
    configuredBucket ? `gs://${configuredBucket.replace(/^gs:\/\//, '')}` : undefined
  );
} catch (e) {
  console.error('Firebase initialization error:', e);
  app = initializeApp(firebaseConfig);
  db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  auth = getAuth(app);
  storage = getStorage(
    app,
    configuredBucket ? `gs://${configuredBucket.replace(/^gs:\/\//, '')}` : undefined
  );
}

export const isFirebaseConfigured = Boolean(firebaseConfig.projectId && firebaseConfig.apiKey);

// Authorized admin emails list for editorial control
export const AUTHORIZED_ADMIN_EMAILS = [
  'sudeep.marandi5@gmail.com',
  'editor@yatrababa.com',
];

/**
 * Checks if a given Firebase user is authorized as an administrator.
 * Validates against both hard-enforced email allowlist and Firestore user/admin records.
 */
export async function verifyUserIsAdmin(user: User | null): Promise<boolean> {
  if (!user || !user.email) return false;

  const normalizedEmail = user.email.toLowerCase().trim();

  // 1. Direct authorized email check
  if (AUTHORIZED_ADMIN_EMAILS.includes(normalizedEmail)) {
    return true;
  }

  // 2. Check Firestore 'user' collection (e.g. user/{email} -> admin: "sudeep")
  try {
    const userDocRef = doc(db, 'user', normalizedEmail);
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      if (data && (data.admin || data.role === 'admin')) {
        return true;
      }
    }
  } catch (err) {
    // Graceful fallback
  }

  // 3. Check Firestore 'admins' collection by UID
  try {
    const adminDocRef = doc(db, 'admins', user.uid);
    const adminSnap = await getDoc(adminDocRef);
    if (adminSnap.exists()) {
      return true;
    }
  } catch (err) {
    // Graceful fallback
  }

  return false;
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo:
        auth?.currentUser?.providerData?.map((p) => ({
          providerId: p.providerId,
          email: p.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  return new Error(JSON.stringify(errInfo));
}

// Test connection on boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.info('Firestore connection verified');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore is offline or unreachable:', error.message);
    }
    return false;
  }
}

// Real Firebase Auth Helpers (no demo bypasses)
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export async function signInWithEmail(email: string, pass: string) {
  return signInWithEmailAndPassword(auth, email.trim(), pass);
}

export async function logOut() {
  return signOut(auth);
}

export { app, db, auth, storage, firebaseConfig };
