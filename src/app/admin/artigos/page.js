import { Suspense } from 'react';
import { articlesApi } from '@/lib/api';
import { SearchBar } from '@/app/admin/_components/SearchBar';
import { Pagination } from '@/app/admin/_components/Pagination';
import { DeleteButton } from '@/app/admin/_components/DeleteButton';
import './styles.css';

const PER_PAGE = 10;

export default async function AdminArtigos({ searchParams }) {
  const { q = '', page = '1' } = await searchParams;
  const currentPage = Math.max(1, Number(page));

  const { items: artigos, total } = await articlesApi.list({ q, page: currentPage, perPage: PER_PAGE });

  return (
    <>
      <div className="adminArtigosHeader">
        <div>
          <h1 className="adminPageTitle">Artigos</h1>
          <p className="adminPageSubtitle">
            {total} artigo{total !== 1 ? 's' : ''}
            {q && <> encontrado{total !== 1 ? 's' : ''} para &ldquo;{q}&rdquo;</>}
          </p>
        </div>
        <a href="/admin/artigos/novo" className="adminArtigosNewBtn">
          <span className="material-symbols-outlined">add</span>
          Novo artigo
        </a>
      </div>

      <div className="adminArtigosToolbar">
        <Suspense>
          <SearchBar placeholder="Pesquisar por título ou tag..." />
        </Suspense>
      </div>

      {artigos.length === 0 ? (
        <div className="adminArtigosEmpty">
          <span className="material-symbols-outlined adminArtigosEmptyIcon">
            {q ? 'search_off' : 'article'}
          </span>
          <p className="adminArtigosEmptyText">
            {q ? `Nenhum artigo encontrado para "${q}".` : 'Nenhum artigo ainda.'}
          </p>
          {!q && (
            <a href="/admin/artigos/novo" className="adminArtigosEmptyLink">
              Criar primeiro artigo
            </a>
          )}
        </div>
      ) : (
        <div className="adminArtigosTableWrapper">
          <table className="adminArtigosTable">
            <thead>
              <tr>
                <th>Título</th>
                <th>Tags</th>
                <th>Status</th>
                <th>Data</th>
                <th><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody>
              {artigos.map(artigo => (
                <tr key={artigo.id} data-oculto={!artigo.visible || undefined}>
                  <td className="adminArtigosTitulo">
                    {!artigo.visible && (
                      <span
                        className="adminArtigosOcultoIcon"
                        title="Artigo oculto"
                        aria-label="Oculto"
                      >
                        <span className="material-symbols-outlined">visibility_off</span>
                      </span>
                    )}
                    {artigo.title}
                  </td>
                  <td>
                    <ul className="adminArtigosTags">
                      {artigo.tags?.map(tag => (
                        <li key={tag} className="adminArtigosTag">{tag}</li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <span className={`adminArtigosStatus adminArtigosStatus--${artigo.status}`}>
                      {artigo.status}
                    </span>
                  </td>
                  <td className="adminArtigosData">
                    {artigo.createdAt
                      ? new Date(artigo.createdAt).toLocaleDateString('pt-BR')
                      : '—'}
                  </td>
                  <td className="adminArtigosAcoes">
                    <a
                      href={`/admin/artigos/${artigo.id}/editar`}
                      className="adminArtigosAcaoBtn"
                      aria-label={`Editar "${artigo.title}"`}
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </a>
                    <DeleteButton
                      endpoint="/articles"
                      id={artigo.id}
                      nome={artigo.title}
                      className="adminArtigosAcaoBtn adminArtigosAcaoBtn--danger"
                      ariaLabel={`Excluir "${artigo.title}"`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Suspense>
            <Pagination total={total} perPage={PER_PAGE} currentPage={currentPage} />
          </Suspense>
        </div>
      )}
    </>
  );
}
