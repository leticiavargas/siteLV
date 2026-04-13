import { AreaForm } from '../_components/AreaForm';
import './styles.css';

export const metadata = {
  title: 'Nova área — Admin',
};

export default function NovaArea() {
  return (
    <>
      <div className="adminAreaPageHeader">
        <a href="/admin/materiais" className="adminAreaBackLink">
          <span className="material-symbols-outlined">arrow_back</span>
          Materiais
        </a>
        <h1 className="adminPageTitle">Nova área</h1>
      </div>

      <AreaForm />
    </>
  );
}
