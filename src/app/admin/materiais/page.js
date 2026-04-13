import { Suspense } from 'react';
import { areasApi, materialItemsApi } from '@/lib/api';
import { SearchBar } from '@/app/admin/_components/SearchBar';
import { DeleteButton } from '@/app/admin/_components/DeleteButton';
import './styles.css';

export default async function AdminMateriais({ searchParams }) {
  const { q = '' } = await searchParams;

  const [{ items: areas, total: totalAreas }, { items: items, total: totalItems }] =
    await Promise.all([
      areasApi.list({ q }),
      materialItemsApi.list({ q }),
    ]);

  const areaMap = Object.fromEntries(areas.map(a => [a.id, a.title]));

  return (
    <>
      <div className="adminMateriaisHeader">
        <div>
          <h1 className="adminPageTitle">Materiais</h1>
          <p className="adminPageSubtitle">
            {totalAreas} área{totalAreas !== 1 ? 's' : ''} · {totalItems} material{totalItems !== 1 ? 'is' : ''}
            {q && <> — filtrando por &ldquo;{q}&rdquo;</>}
          </p>
        </div>
      </div>

      <div className="adminMateriaisToolbar">
        <Suspense>
          <SearchBar placeholder="Pesquisar em áreas e materiais..." />
        </Suspense>
      </div>

      {/* ── Áreas ─────────────────────────────────────────────── */}
      <section className="adminMateriaisSection">
        <div className="adminMateriaisSectionHeader">
          <h2 className="adminMateriaisSectionTitle">
            <span className="material-symbols-outlined">category</span>
            Áreas
          </h2>
          <a href="/admin/materiais/areas/novo" className="adminMateriaisNewBtn">
            <span className="material-symbols-outlined">add</span>
            Nova área
          </a>
        </div>

        {areas.length === 0 ? (
          <div className="adminMateriaisEmpty">
            <span className="material-symbols-outlined adminMateriaisEmptyIcon">
              {q ? 'search_off' : 'category'}
            </span>
            <p className="adminMateriaisEmptyText">
              {q ? `Nenhuma área encontrada para "${q}".` : 'Nenhuma área ainda.'}
            </p>
            {!q && (
              <a href="/admin/materiais/areas/novo" className="adminMateriaisEmptyLink">
                Criar primeira área
              </a>
            )}
          </div>
        ) : (
          <div className="adminMateriaisTableWrapper">
            <table className="adminMateriaisTable">
              <thead>
                <tr>
                  <th>Ícone</th>
                  <th>Título</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th><span className="sr-only">Ações</span></th>
                </tr>
              </thead>
              <tbody>
                {areas.map(area => (
                  <tr key={area.id} data-oculto={!area.visible || undefined}>
                    <td className="adminMateriaisIconCell">
                      <span className="material-symbols-outlined adminMateriaisIcon">
                        {area.iconName}
                      </span>
                    </td>
                    <td className="adminMateriaisTitulo">
                      {!area.visible && (
                        <span className="adminMateriaisOcultoIcon" title="Oculto" aria-label="Oculto">
                          <span className="material-symbols-outlined">visibility_off</span>
                        </span>
                      )}
                      {area.title}
                    </td>
                    <td className="adminMateriaisSlug">#{area.slug}</td>
                    <td>
                      <span className={`adminMateriaisStatus adminMateriaisStatus--${area.status}`}>
                        {area.status}
                      </span>
                    </td>
                    <td className="adminMateriaisAcoes">
                      <a
                        href={`/admin/materiais/areas/${area.id}/editar`}
                        className="adminMateriaisAcaoBtn"
                        aria-label={`Editar área "${area.title}"`}
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </a>
                      <DeleteButton
                        endpoint="/areas"
                        id={area.id}
                        nome={area.title}
                        className="adminMateriaisAcaoBtn adminMateriaisAcaoBtn--danger"
                        ariaLabel={`Excluir área "${area.title}"`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Materiais ─────────────────────────────────────────── */}
      <section className="adminMateriaisSection">
        <div className="adminMateriaisSectionHeader">
          <h2 className="adminMateriaisSectionTitle">
            <span className="material-symbols-outlined">menu_book</span>
            Materiais
          </h2>
          <a href="/admin/materiais/items/novo" className="adminMateriaisNewBtn">
            <span className="material-symbols-outlined">add</span>
            Novo material
          </a>
        </div>

        {items.length === 0 ? (
          <div className="adminMateriaisEmpty">
            <span className="material-symbols-outlined adminMateriaisEmptyIcon">
              {q ? 'search_off' : 'menu_book'}
            </span>
            <p className="adminMateriaisEmptyText">
              {q ? `Nenhum material encontrado para "${q}".` : 'Nenhum material ainda.'}
            </p>
            {!q && (
              <a href="/admin/materiais/items/novo" className="adminMateriaisEmptyLink">
                Criar primeiro material
              </a>
            )}
          </div>
        ) : (
          <div className="adminMateriaisTableWrapper">
            <table className="adminMateriaisTable">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Área</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th><span className="sr-only">Ações</span></th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} data-oculto={!item.visible || undefined}>
                    <td className="adminMateriaisTitulo">
                      {!item.visible && (
                        <span className="adminMateriaisOcultoIcon" title="Oculto" aria-label="Oculto">
                          <span className="material-symbols-outlined">visibility_off</span>
                        </span>
                      )}
                      {item.title}
                    </td>
                    <td className="adminMateriaisArea">
                      {areaMap[item.areaId] ?? item.areaId ?? '—'}
                    </td>
                    <td>
                      <span className="adminMateriaisTipo">{item.type}</span>
                    </td>
                    <td>
                      <span className={`adminMateriaisStatus adminMateriaisStatus--${item.status}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="adminMateriaisAcoes">
                      <a
                        href={`/admin/materiais/items/${item.id}/editar`}
                        className="adminMateriaisAcaoBtn"
                        aria-label={`Editar "${item.title}"`}
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </a>
                      <DeleteButton
                        endpoint="/materials"
                        id={item.id}
                        nome={item.title}
                        className="adminMateriaisAcaoBtn adminMateriaisAcaoBtn--danger"
                        ariaLabel={`Excluir "${item.title}"`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
