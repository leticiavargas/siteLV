import { ProjectCard } from '../ProjectCard';
import { SeeAllLink } from '../SeeAllLink';
import './styles.css';

const ProjectsSection = ({ projects = [] }) => {
  if (projects.length === 0) return null;

  return (
    <section className="projectsSection">
      <header className="projectsSectionHeader">
        <p className="projectsSectionEyebrow">Crafted Code</p>
        <h2 className="projectsSectionTitle">Laboratório Técnico</h2>
        <p className="projectsSectionSubtitle">Soluções autorais documentadas (ou talvez não) do código à arquitetura.</p>
      </header>
   
      <ul className="projectsGrid">
        {projects.map((project, index) => (
          <li
            key={index}
            className="animate-on-scroll"
            style={{ transitionDelay: `${index * 80}ms` }}
          >
            <ProjectCard
              title={project.title}
              description={project.description}
              tags={project.tags}
              imageUrl={project.imageUrl}
              href={`/projetos?abrir=${project.id}`}
            />
          </li>
        ))}
      </ul>
      <footer className="projectsFooter">
        <SeeAllLink href="/projetos">ver lista completa</SeeAllLink>
      </footer>
    </section>
  );
};

export { ProjectsSection };
