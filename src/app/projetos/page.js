export const revalidate = 3600;

import { Header, Footer } from '../components';
import { PageHero } from '../components/PageHero';
import { ProjectListItem } from './_components/ProjectListItem';
import { projectsApi } from '@/lib/api';
import './styles.css';

export default async function Projetos({ searchParams }) {
  const params = await searchParams;
  const abrirId = params?.abrir ?? null;
  const data = await projectsApi.list({ perPage: 100, status: 'published', visible: true });
  const projects = data.items;

  return (
    <>
      <Header />
      <main>
        <PageHero
          title="Projetos"
          subtitle="Coisas que construí, aprendi e publiquei por aí."
        />

        <section className='projetosSection'>
          <div className='projetosHeader'>
            <div className='projetosHeaderText'>
              <h2 className='projetosTitle'>Projetos</h2>
              <p className='projetosSubtitle'>Coisas que construí, aprendi e publiquei por aí.</p>
            </div>
            <span className='projetosAccentLine' aria-hidden="true" />
          </div>

          {projects.length === 0 ? (
            <p className='projetosEmpty'>Nenhum projeto publicado ainda.</p>
          ) : (
            <ul className='projetosList'>
              {projects.map((project, index) => (
                <ProjectListItem
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  description={project.description}
                  details={project.details}
                  tags={project.tags ?? []}
                  iconName={project.iconName ?? ''}
                  imageUrl={project.imageUrl}
                  liveHref={project.liveHref}
                  repoHref={project.repoHref}
                  isLast={index === projects.length - 1}
                  defaultExpanded={project.id === abrirId}
                />
              ))}
            </ul>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
