import './styles.css';
import { Tag } from '../tag';
import { Icon } from '../Icon';

const ProjectCard = ({ title, description, tags = [], liveHref, repoHref, imageSrc }) => {
  return (
    <article className='projectCard'>
      <div className='projectCardImage' style={imageSrc ? { backgroundImage: `url(${imageSrc})` } : undefined} aria-hidden="true"></div>

      <div className='projectCardBody'>
        <div className='projectCardInfo'>
          <h3 className='projectCardTitle'>{title}</h3>
          <p className='projectCardDescription'>{description}</p>
        </div>

        {tags.length > 0 && (
          <ul className='projectCardTags'>
            {tags.map((tag) => (
              <li key={tag}><Tag text={tag} variant='outline' /></li>
            ))}
          </ul>
        )}

        <div className='projectCardLinks'>
          {liveHref && (
            <a href={liveHref} target="_blank" rel="noopener noreferrer" className='projectCardLink projectCardLink--primary'>
              <Icon iconName="open_in_new" />
              Ver projeto
            </a>
          )}
          {repoHref && (
            <a href={repoHref} target="_blank" rel="noopener noreferrer" className='projectCardLink projectCardLink--ghost'>
              <Icon iconName="github" />
              Repositório
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export { ProjectCard };
