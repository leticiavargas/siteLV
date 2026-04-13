import { Header, Footer } from '../../components';
import { ArticleHero } from '../../components/ArticleHero';
import { RelatedArticles } from '../../components/RelatedArticles';
import { ArticleSidebar } from '../../components/ArticleSidebar';
import { ShareButton } from './ShareButton';
import { articlesApi } from '@/lib/api';
import './styles.css';

export async function generateStaticParams() {
  const data = await articlesApi.list({ status: 'published', perPage: 100 });
  return data.items.map(a => ({ slug: a.id }));
}

export default async function ArtigoDetalhe({ params }) {
  const { slug } = await params;
  const artigo = await articlesApi.get(slug);

  const date = artigo.createdAt
    ? new Date(artigo.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    : '';

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

          <div className='articlePageShare'>
            <ShareButton />
          </div>
        </article>

        <div className='articlePageBottom'>
          <RelatedArticles articles={[]} />
          <ArticleSidebar
            description="Lorem ipsum dolor sit amet consectetur. Semper risus et aliquet tincidunt quis neque. Tristique tristique vitae euismod gravida a risus. Et ipsum vitae ultrices ligula in. Nisl nunc odio orci nulla. Tempor varius dui purus sit sed mattis porttitor sit."
            communityText="Entre para uma comunidade com mais gente começando na carreira de dev!"
            communityHref="#"
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
