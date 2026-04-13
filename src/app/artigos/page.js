import { Header, Footer } from '../components';
import { PageHero } from '../components/PageHero';
import { PageAnimations } from '../components/PageAnimations';
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
      />
      <main>
        <PageAnimations />
        <ArticlesClient articles={articles} />
      </main>
      <Footer />
    </>
  );
}
