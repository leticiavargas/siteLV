'use client';

import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase-client';

export function AdminLogout() {
  const router = useRouter();

  async function handleLogout() {
    await auth.signOut();
    document.cookie = '__session=; path=/; max-age=0';
    router.push('/admin/login');
  }

  return (
    <button type="button" className='adminSignOutBtn' aria-label="Sair" onClick={handleLogout}>
      <span className='material-symbols-outlined'>logout</span>
    </button>
  );
}
