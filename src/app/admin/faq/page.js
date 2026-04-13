import { Suspense } from 'react';
import { faqApi } from '@/lib/api';
import { SearchBar } from '@/app/admin/_components/SearchBar';
import { Pagination } from '@/app/admin/_components/Pagination';
import { DeleteButton } from '@/app/admin/_components/DeleteButton';
import './styles.css';

const PER_PAGE = 10;

export default async function AdminFaq({ searchParams }) {
  const { q = '', page = '1' } = await searchParams;
  const currentPage = Math.max(1, Number(page));

  const { items: perguntas, total } = await faqApi.list({ q, page: currentPage, perPage: PER_PAGE });

  return (
    <>
      <div className="adminFaqHeader">
        <div>
          <h1 className="adminPageTitle">FAQ</h1>
          <p className="adminPageSubtitle">
            {total} pergunta{total !== 1 ? 's' : ''}
            {q && <> encontrada{total !== 1 ? 's' : ''} para &ldquo;{q}&rdquo;</>}
          </p>
        </div>
        <a href="/admin/faq/novo" className="adminFaqNewBtn">
          <span className="material-symbols-outlined">add</span>
          Nova pergunta
        </a>
      </div>

      <div className="adminFaqToolbar">
        <Suspense>
          <SearchBar placeholder="Pesquisar por pergunta..." />
        </Suspense>
      </div>

      {perguntas.length === 0 ? (
        <div className="adminFaqEmpty">
          <span className="material-symbols-outlined adminFaqEmptyIcon">
            {q ? 'search_off' : 'help'}
          </span>
          <p className="adminFaqEmptyText">
            {q ? `Nenhuma pergunta encontrada para "${q}".` : 'Nenhuma pergunta ainda.'}
          </p>
          {!q && (
            <a href="/admin/faq/novo" className="adminFaqEmptyLink">
              Criar primeira pergunta
            </a>
          )}
        </div>
      ) : (
        <div className="adminFaqTableWrapper">
          <table className="adminFaqTable">
            <thead>
              <tr>
                <th>Pergunta</th>
                <th>Links</th>
                <th>Status</th>
                <th>Data</th>
                <th><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody>
              {perguntas.map(item => (
                <tr key={item.id} data-oculto={!item.visible || undefined}>
                  <td className="adminFaqPergunta">
                    {!item.visible && (
                      <span className="adminFaqOcultoIcon" title="Oculto" aria-label="Oculto">
                        <span className="material-symbols-outlined">visibility_off</span>
                      </span>
                    )}
                    {item.question}
                  </td>
                  <td className="adminFaqLinks">
                    {item.links?.length > 0 ? (
                      <span className="adminFaqLinkCount">
                        <span className="material-symbols-outlined">link</span>
                        {item.links.length}
                      </span>
                    ) : (
                      <span className="adminFaqNoLinks">—</span>
                    )}
                  </td>
                  <td>
                    <span className={`adminFaqStatus adminFaqStatus--${item.status}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="adminFaqData">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString('pt-BR')
                      : '—'}
                  </td>
                  <td className="adminFaqAcoes">
                    <a
                      href={`/admin/faq/${item.id}/editar`}
                      className="adminFaqAcaoBtn"
                      aria-label={`Editar "${item.question}"`}
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </a>
                    <DeleteButton
                      endpoint="/faq"
                      id={item.id}
                      nome={item.question}
                      className="adminFaqAcaoBtn adminFaqAcaoBtn--danger"
                      ariaLabel={`Excluir "${item.question}"`}
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
