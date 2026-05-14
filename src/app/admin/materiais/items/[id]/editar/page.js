import { areasApi, materialItemsApi } from '@/lib/api';
import { MaterialItemForm } from '../../_components/MaterialItemForm';
import '../../../items/novo/styles.css';

export const metadata = {
  title: 'Editar material — Admin',
};

export default async function EditarMaterial({ params }) {
  const { id } = await params;
  const [item, { items: areas }] = await Promise.all([
    materialItemsApi.get(id),
    areasApi.list(),
  ]);

  if (!item) {
    return (
      <>
        <div className="adminItemPageHeader">
          <a href="/admin/materiais" className="adminItemBackLink">
            <span className="material-symbols-outlined">arrow_back</span>
            Materiais
          </a>
          <h1 className="adminPageTitle">Editar material</h1>
        </div>
        <p style={{ opacity: 0.5, fontSize: '0.9375rem' }}>
          Material não encontrado. Conecte a API para carregar os dados.
        </p>
      </>
    );
  }

  return (
    <>
      <div className="adminItemPageHeader">
        <a href="/admin/materiais" className="adminItemBackLink">
          <span className="material-symbols-outlined">arrow_back</span>
          Materiais
        </a>
        <h1 className="adminPageTitle">{item.title}</h1>
      </div>

      <MaterialItemForm
        itemId={id}
        areas={areas}
        initialData={{
          title: item.title ?? '',
          description: item.description ?? '',
          content: item.content ?? '',
          type: item.type ?? 'Artigo',
          iconName: item.iconName ?? '',
          href: item.href ?? '',
          areaId: item.areaId ?? '',
          status: item.status ?? 'draft',
          visible: item.visible ?? false,
          sources: item.sources ?? [],
        }}
      />
    </>
  );
}
