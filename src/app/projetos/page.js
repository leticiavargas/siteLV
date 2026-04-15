import { Header, Footer } from '../components';
import { PageHero } from '../components/PageHero';
import { ProjectListItem } from './_components/ProjectListItem';
import { projectsApi } from '@/lib/api';
import './styles.css';

export default async function Projetos() {
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
          {projects.length === 0 ? (
            <p className='projetosEmpty'>Nenhum projeto publicado ainda.</p>
          ) : (
            <ul className='projetosList'>
              {projects.map((project) => (
                <ProjectListItem
                  key={project.id}
                  title={project.title}
                  description={project.description}
                  details={project.details}
                  tags={project.tags ?? []}
                  imageUrl={project.imageUrl}
                  liveHref={project.liveHref}
                  repoHref={project.repoHref}
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
