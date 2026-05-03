export const revalidate = 1800;
export const dynamic = 'force-dynamic';

import { Header, Footer } from '../../components';
import { ArticleHero } from '../../components/ArticleHero';
import { RelatedArticles } from '../../components/RelatedArticles';
import { ShareButton } from './ShareButton';
import { ClapButton } from './ClapButton';
import { articlesApi } from '@/lib/api';
import './styles.css';

function getRelatedArticles(allArticles, currentId, currentTags = []) {
  const others = allArticles.filter(a => a.id !== currentId);
  if (currentTags.length > 0) {
    const withMatch = others
      .map(a => ({ ...a, matchCount: (a.tags ?? []).filter(t => currentTags.includes(t)).length }))
      .filter(a => a.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount)
      .slice(0, 3);
    if (withMatch.length > 0) return withMatch;
  }
  return others.slice(0, 3);
}

export default async function ArtigoDetalhe({ params }) {
  const { slug } = await params;
  const [artigo, allData] = await Promise.all([
    articlesApi.get(slug),
    articlesApi.list({ status: 'published', visible: true, perPage: 100 }),
  ]);

  const date = artigo.publishedAt
    ? new Date(artigo.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    : '';

  const updatedDate = artigo.updatedAt && artigo.publishedAt && artigo.updatedAt > artigo.publishedAt
    ? new Date(artigo.updatedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    : null;

  const relatedArticles = getRelatedArticles(allData.items, artigo.id, artigo.tags ?? []).map(a => ({
    title: a.title,
    excerpt: a.excerpt,
    tags: a.tags ?? [],
    href: `/artigos/${a.id}`,
  }));

  return (
    <>
      <Header />
      <main className='articlePageLayout'>
        <ArticleHero
          tags={artigo.tags ?? []}
          title={artigo.title}
          lead={artigo.excerpt}
          authorName="Letícia Vargas"
          authorDate={date}
        />

        <article className='articlePageContent'>
          <div
            className='articlePageBody'
            dangerouslySetInnerHTML={{ __html: artigo.content }}
          />

          {updatedDate && (
            <p className='articlePageUpdated'>Atualizado em {updatedDate}</p>
          )}

          <div className='articlePageShare'>
            <ClapButton articleId={artigo.id} initialClaps={artigo.claps ?? 0} />
            <ShareButton />
          </div>
        </article>

        <section className='articlePageBottom'>
          <RelatedArticles articles={relatedArticles} />
        </section>
      </main>
      <Footer />
    </>
  );
}
