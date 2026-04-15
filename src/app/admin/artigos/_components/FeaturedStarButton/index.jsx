'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { articlesApi } from '@/lib/api';
import './styles.css';

export function FeaturedStarButton({ articleId, isFeatured, currentFeaturedId }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    try {
      if (isFeatured) {
        await articlesApi.update(articleId, { featured: false });
      } else {
        if (currentFeaturedId && currentFeaturedId !== articleId) {
          await articlesApi.update(currentFeaturedId, { featured: false });
        }
        await articlesApi.update(articleId, { featured: true });
      }
      router.refresh();
    } catch {
      // silently fail — page refresh will show real state
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`featuredStarBtn${isFeatured ? ' featuredStarBtn--active' : ''}`}
      title={isFeatured ? 'Remover destaque' : 'Definir como destaque'}
      aria-label={isFeatured ? 'Remover destaque' : 'Definir como destaque'}
    >
      <span className="material-symbols-outlined">
        {isFeatured ? 'star' : 'star_border'}
      </span>
    </button>
  );
}
