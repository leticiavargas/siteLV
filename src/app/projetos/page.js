import { Header, Footer } from '../components';
import { PageHero } from '../components/PageHero';
import { ProjectCard } from '../components/ProjectCard';
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
          searchPlaceholder="Buscar projetos..."
        />

        <section className='projetosSection'>
          <ul className='projetosGrid'>
            {projects.map((project, index) => (
              <li key={project.id}>
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  tags={project.tags ?? []}
                  imageUrl={project.imageUrl}
                  href={project.liveHref || project.repoHref || null}
                  variant={index}
                />
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
