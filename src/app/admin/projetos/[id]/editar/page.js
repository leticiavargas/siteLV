import { projectsApi } from '@/lib/api';
import { ProjectForm } from '../../_components/ProjectForm';
import '../../../projetos/novo/styles.css';

export const metadata = {
  title: 'Editar projeto — Admin',
};

export default async function EditarProjeto({ params }) {
  const { id } = await params;
  const projeto = await projectsApi.get(id);

  if (!projeto) {
    return (
      <>
        <div className="adminProjetoPageHeader">
          <a href="/admin/projetos" className="adminProjetoBackLink">
            <span className="material-symbols-outlined">arrow_back</span>
            Projetos
          </a>
          <h1 className="adminPageTitle">Editar projeto</h1>
        </div>
        <p style={{ opacity: 0.5, fontSize: '0.9375rem' }}>
          Projeto não encontrado. Conecte a API para carregar os dados.
        </p>
      </>
    );
  }

  return (
    <>
      <div className="adminProjetoPageHeader">
        <a href="/admin/projetos" className="adminProjetoBackLink">
          <span className="material-symbols-outlined">arrow_back</span>
          Projetos
        </a>
        <h1 className="adminPageTitle">{projeto.title}</h1>
      </div>

      <ProjectForm
        projectId={id}
        initialData={{
          title: projeto.title,
          description: projeto.description,
          tags: projeto.tags,
          liveHref: projeto.liveHref,
          repoHref: projeto.repoHref,
          imageUrl: projeto.imageUrl,
          status: projeto.status,
          visible: projeto.visible,
        }}
      />
    </>
  );
}
