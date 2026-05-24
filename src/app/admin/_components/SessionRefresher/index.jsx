'use client';
import { useEffect } from 'react';
import { onIdTokenChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';

export function SessionRefresher() {
  useEffect(() => {
    const unsub = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        document.cookie = `__session=${token}; path=/; max-age=86400; SameSite=Lax`;
      }
    });
    return () => unsub();
  }, []);

  return null;
}
