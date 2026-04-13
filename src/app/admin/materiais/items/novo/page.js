import { areasApi } from '@/lib/api';
import { MaterialItemForm } from '../_components/MaterialItemForm';
import './styles.css';

export const metadata = {
  title: 'Novo material — Admin',
};

export default async function NovoMaterial() {
  const { items: areas } = await areasApi.list();

  return (
    <>
      <div className="adminItemPageHeader">
        <a href="/admin/materiais" className="adminItemBackLink">
          <span className="material-symbols-outlined">arrow_back</span>
          Materiais
        </a>
        <h1 className="adminPageTitle">Novo material</h1>
      </div>

      <MaterialItemForm areas={areas} />
    </>
  );
}
