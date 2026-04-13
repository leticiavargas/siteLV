import { ArticleForm } from '../_components/ArticleForm';
import './styles.css';

export const metadata = {
  title: 'Novo artigo — Admin',
};

export default function NovoArtigo() {
  return (
    <>
      <div className="adminArtigoPageHeader">
        <a href="/admin/artigos" className="adminArtigoBackLink">
          <span className="material-symbols-outlined">arrow_back</span>
          Artigos
        </a>
        <h1 className="adminPageTitle">Novo artigo</h1>
      </div>

      <ArticleForm />
    </>
  );
}
