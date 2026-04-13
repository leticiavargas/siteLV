import { areasApi } from '@/lib/api';
import { AreaForm } from '../../_components/AreaForm';
import '../../../areas/novo/styles.css';

export const metadata = {
  title: 'Editar área — Admin',
};

export default async function EditarArea({ params }) {
  const { id } = await params;
  const area = await areasApi.get(id);

  if (!area) {
    return (
      <>
        <div className="adminAreaPageHeader">
          <a href="/admin/materiais" className="adminAreaBackLink">
            <span className="material-symbols-outlined">arrow_back</span>
            Materiais
          </a>
          <h1 className="adminPageTitle">Editar área</h1>
        </div>
        <p style={{ opacity: 0.5, fontSize: '0.9375rem' }}>
          Área não encontrada. Conecte a API para carregar os dados.
        </p>
      </>
    );
  }

  return (
    <>
      <div className="adminAreaPageHeader">
        <a href="/admin/materiais" className="adminAreaBackLink">
          <span className="material-symbols-outlined">arrow_back</span>
          Materiais
        </a>
        <h1 className="adminPageTitle">{area.title}</h1>
      </div>

      <AreaForm
        areaId={id}
        initialData={{
          title: area.title,
          slug: area.slug,
          iconName: area.iconName,
          description: area.description,
          status: area.status,
          visible: area.visible,
        }}
      />
    </>
  );
}
