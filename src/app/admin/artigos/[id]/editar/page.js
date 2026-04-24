import { articlesApi } from '@/lib/api';
import { ArticleForm } from '../../_components/ArticleForm';
import '../../../artigos/novo/styles.css';

export const metadata = {
  title: 'Editar artigo — Admin',
};

export default async function EditarArtigo({ params }) {
  const { id } = await params;
  const artigo = await articlesApi.get(id);

  if (!artigo) {
    return (
      <>
        <div className="adminArtigoPageHeader">
          <a href="/admin/artigos" className="adminArtigoBackLink">
            <span className="material-symbols-outlined">arrow_back</span>
            Artigos
          </a>
          <h1 className="adminPageTitle">Editar artigo</h1>
        </div>
        <p style={{ opacity: 0.5, fontSize: '0.9375rem' }}>
          Artigo não encontrado. Conecte a API para carregar os dados.
        </p>
      </>
    );
  }

  return (
    <>
      <div className="adminArtigoPageHeader">
        <a href="/admin/artigos" className="adminArtigoBackLink">
          <span className="material-symbols-outlined">arrow_back</span>
          Artigos
        </a>
        <h1 className="adminPageTitle">{artigo.title}</h1>
      </div>

      <ArticleForm
        artigoId={id}
        initialData={{
          title: artigo.title ?? '',
          excerpt: artigo.excerpt ?? '',
          content: artigo.content ?? '',
          tags: (artigo.tags ?? []).map(t => t.toLowerCase()),
          iconName: artigo.iconName ?? '',
          imageUrl: artigo.imageUrl ?? '',
          status: artigo.status ?? 'draft',
          visible: artigo.visible ?? true,
          featured: artigo.featured ?? false,
          publishedAt: artigo.publishedAt ?? null,
        }}
      />
    </>
  );
}
