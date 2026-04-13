import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

if (!getApps().length) {
  initializeApp({
    storageBucket: process.env.STORAGE_BUCKET ?? 'leticiavargassite.appspot.com',
  });
}

export const db = getFirestore();
export const storage = getStorage();
