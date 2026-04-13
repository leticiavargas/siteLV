import { Suspense } from 'react';
import { projectsApi } from '@/lib/api';
import { SearchBar } from '@/app/admin/_components/SearchBar';
import { Pagination } from '@/app/admin/_components/Pagination';
import { DeleteButton } from '@/app/admin/_components/DeleteButton';
import './styles.css';

const PER_PAGE = 10;

export default async function AdminProjetos({ searchParams }) {
  const { q = '', page = '1' } = await searchParams;
  const currentPage = Math.max(1, Number(page));

  const { items: projetos, total } = await projectsApi.list({ q, page: currentPage, perPage: PER_PAGE });

  return (
    <>
      <div className="adminProjetosHeader">
        <div>
          <h1 className="adminPageTitle">Projetos</h1>
          <p className="adminPageSubtitle">
            {total} projeto{total !== 1 ? 's' : ''}
            {q && <> encontrado{total !== 1 ? 's' : ''} para &ldquo;{q}&rdquo;</>}
          </p>
        </div>
        <a href="/admin/projetos/novo" className="adminProjetosNewBtn">
          <span className="material-symbols-outlined">add</span>
          Novo projeto
        </a>
      </div>

      <div className="adminProjetosToolbar">
        <Suspense>
          <SearchBar placeholder="Pesquisar por título ou tag..." />
        </Suspense>
      </div>

      {projetos.length === 0 ? (
        <div className="adminProjetosEmpty">
          <span className="material-symbols-outlined adminProjetosEmptyIcon">
            {q ? 'search_off' : 'rocket_launch'}
          </span>
          <p className="adminProjetosEmptyText">
            {q ? `Nenhum projeto encontrado para "${q}".` : 'Nenhum projeto ainda.'}
          </p>
          {!q && (
            <a href="/admin/projetos/novo" className="adminProjetosEmptyLink">
              Criar primeiro projeto
            </a>
          )}
        </div>
      ) : (
        <div className="adminProjetosTableWrapper">
          <table className="adminProjetosTable">
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
              {projetos.map(projeto => (
                <tr key={projeto.id} data-oculto={!projeto.visible || undefined}>
                  <td className="adminProjetosTitulo">
                    {!projeto.visible && (
                      <span
                        className="adminProjetosOcultoIcon"
                        title="Projeto oculto"
                        aria-label="Oculto"
                      >
                        <span className="material-symbols-outlined">visibility_off</span>
                      </span>
                    )}
                    {projeto.title}
                  </td>
                  <td>
                    <ul className="adminProjetosTags">
                      {projeto.tags?.map(tag => (
                        <li key={tag} className="adminProjetosTag">{tag}</li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <span className={`adminProjetosStatus adminProjetosStatus--${projeto.status}`}>
                      {projeto.status}
                    </span>
                  </td>
                  <td className="adminProjetosData">
                    {projeto.createdAt
                      ? new Date(projeto.createdAt).toLocaleDateString('pt-BR')
                      : '—'}
                  </td>
                  <td className="adminProjetosAcoes">
                    <a
                      href={`/admin/projetos/${projeto.id}/editar`}
                      className="adminProjetosAcaoBtn"
                      aria-label={`Editar "${projeto.title}"`}
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </a>
                    <DeleteButton
                      endpoint="/projects"
                      id={projeto.id}
                      nome={projeto.title}
                      className="adminProjetosAcaoBtn adminProjetosAcaoBtn--danger"
                      ariaLabel={`Excluir "${projeto.title}"`}
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
