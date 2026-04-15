import { Button } from '../Button';
import { ProjectCard } from '../ProjectCard';
import './styles.css';

const ROTATIONS = [-1.2, 1.1, -0.9];

const ProjectsSection = ({ projects = [] }) => {
  if (projects.length === 0) return null;

  return (
    <section className="projectsSection">
      <div className="projectsSectionHeader">
        <div className="projectsSectionHeaderLeft">
          <h2 className="projectsSectionTitle">Crafted Code: Laboratório Técnico</h2>
          <p className="projectsSectionSubtitle">Soluções autorais documentadas (ou talvez não) do código à arquitetura.</p>
        </div>
        <Button variant="outlight" href="/projetos">explorar todos projetos</Button>
      </div>
      <ul className="projectsGrid">
        {projects.map((project, index) => (
          <li
            key={index}
            className="animate-on-scroll"
            style={{
              transform: `rotate(${ROTATIONS[index % ROTATIONS.length]}deg)`,
              transitionDelay: `${index * 80}ms`,
            }}
          >
            <ProjectCard
              title={project.title}
              description={project.description}
              tags={project.tags}
              imageUrl={project.imageUrl}
              href={project.liveHref || project.repoHref || null}
              variant={index}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export { ProjectsSection };
