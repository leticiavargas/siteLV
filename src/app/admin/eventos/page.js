import { Suspense } from 'react';
import { eventsApi } from '@/lib/api';
import { SearchBar } from '@/app/admin/_components/SearchBar';
import { Pagination } from '@/app/admin/_components/Pagination';
import { DeleteButton } from '@/app/admin/_components/DeleteButton';
import './styles.css';

const PER_PAGE = 10;

export default async function AdminEventos({ searchParams }) {
  const { q = '', page = '1' } = await searchParams;
  const currentPage = Math.max(1, Number(page));

  const { items: eventos, total } = await eventsApi.list({ q, page: currentPage, perPage: PER_PAGE });

  return (
    <>
      <div className="adminEventosHeader">
        <div>
          <h1 className="adminPageTitle">Eventos</h1>
          <p className="adminPageSubtitle">
            {total} evento{total !== 1 ? 's' : ''}
            {q && <> encontrado{total !== 1 ? 's' : ''} para &ldquo;{q}&rdquo;</>}
          </p>
        </div>
        <a href="/admin/eventos/novo" className="adminEventosNewBtn">
          <span className="material-symbols-outlined">add</span>
          Novo evento
        </a>
      </div>

      <div className="adminEventosToolbar">
        <Suspense>
          <SearchBar placeholder="Pesquisar por título ou local..." />
        </Suspense>
      </div>

      {eventos.length === 0 ? (
        <div className="adminEventosEmpty">
          <span className="material-symbols-outlined adminEventosEmptyIcon">
            {q ? 'search_off' : 'event'}
          </span>
          <p className="adminEventosEmptyText">
            {q ? `Nenhum evento encontrado para "${q}".` : 'Nenhum evento ainda.'}
          </p>
          {!q && (
            <a href="/admin/eventos/novo" className="adminEventosEmptyLink">
              Criar primeiro evento
            </a>
          )}
        </div>
      ) : (
        <div className="adminEventosTableWrapper">
          <table className="adminEventosTable">
            <thead>
              <tr>
                <th>Título</th>
                <th>Data</th>
                <th>Local / Formato</th>
                <th>Vou</th>
                <th>Status</th>
                <th><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody>
              {eventos.map(evento => (
                <tr key={evento.id} data-oculto={!evento.visible || undefined}>
                  <td className="adminEventosTitulo">
                    {!evento.visible && (
                      <span
                        className="adminEventosOcultoIcon"
                        title="Evento oculto"
                        aria-label="Oculto"
                      >
                        <span className="material-symbols-outlined">visibility_off</span>
                      </span>
                    )}
                    {evento.title}
                  </td>
                  <td className="adminEventosData">
                    {evento.date ?? '—'}
                    {evento.endDate && ` → ${evento.endDate}`}
                  </td>
                  <td className="adminEventosLocal">
                    {evento.location ?? '—'}
                    {evento.format && (
                      <span className={`adminEventosFormato adminEventosFormato--${evento.format}`}>
                        {evento.format}
                      </span>
                    )}
                  </td>
                  <td className="adminEventosVou">
                    {evento.attending
                      ? <span className="material-symbols-outlined adminEventosVouSim" title="Vai ao evento">check_circle</span>
                      : <span className="material-symbols-outlined adminEventosVouNao" title="Não vai">cancel</span>
                    }
                  </td>
                  <td>
                    <span className={`adminEventosStatus adminEventosStatus--${evento.status}`}>
                      {evento.status}
                    </span>
                  </td>
                  <td className="adminEventosAcoes">
                    <a
                      href={`/admin/eventos/${evento.id}/editar`}
                      className="adminEventosAcaoBtn"
                      aria-label={`Editar "${evento.title}"`}
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </a>
                    <DeleteButton
                      endpoint="/events"
                      id={evento.id}
                      nome={evento.title}
                      className="adminEventosAcaoBtn adminEventosAcaoBtn--danger"
                      ariaLabel={`Excluir "${evento.title}"`}
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
