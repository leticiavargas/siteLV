import { ProjectForm } from '../_components/ProjectForm';
import './styles.css';

export const metadata = {
  title: 'Novo projeto — Admin',
};

export default function NovoProjeto() {
  return (
    <>
      <div className="adminProjetoPageHeader">
        <a href="/admin/projetos" className="adminProjetoBackLink">
          <span className="material-symbols-outlined">arrow_back</span>
          Projetos
        </a>
        <h1 className="adminPageTitle">Novo projeto</h1>
      </div>

      <ProjectForm />
    </>
  );
}
