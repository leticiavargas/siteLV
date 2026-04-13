import './styles.css';
import { ProjectCard } from '../ProjectCard';
import { Button } from '../Button';

const ProjectsSection = ({ projects = [] }) => {
  if (projects.length === 0) return null;

  return (
    <section className='projectsSection'>
      <div className='projectsSectionHeader'>
        <div>
          <h2 className='projectsSectionTitle'>Crafted Code: Laboratório técnico</h2>
          <p className='projectsSectionSubtitle'>Soluções autorais documentadas (ou talvez não) do código à arquitetura.</p>
        </div>
        <Button label="Explorar todos os projetos" variant="outline" href="/projetos" />
      </div>
      <ul className='projectsGrid'>
        {projects.map((project, index) => (
          <li
            key={index}
            className='animate-on-scroll'
            style={{ transitionDelay: `${index * 80}ms` }}
          >
            <ProjectCard
              title={project.title}
              description={project.description}
              tags={project.tags}
              liveHref={project.liveHref}
              repoHref={project.repoHref}
              imageSrc={project.imageSrc}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export { ProjectsSection };
