export const revalidate = 1800;

import { Suspense } from 'react';
import { Header, Footer } from '../components';
import { PageHero } from '../components/PageHero';
import { ArticlesClient } from './ArticlesClient';
import { articlesApi } from '@/lib/api';
import './styles.css';

export default async function Artigos() {
  const data = await articlesApi.list({ perPage: 100, status: 'published', visible: true });
  const articles = data.items;
  return (
    <>
      <Header />
      <PageHero
        title="Artigos"
        subtitle="Textos sobre desenvolvimento web, frontend e tudo que aprendo no caminho."
        searchPlaceholder="Buscar artigos..."
      />
      <main>
        <Suspense>
          <ArticlesClient articles={articles} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
