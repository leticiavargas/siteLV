import Link from 'next/link';
import './styles.css';

const ProjectCard = ({ title, description, tags = [], imageUrl, href, variant = 0 }) => {
  const content = (
    <article className="projectCard" data-variant={variant % 3}>
      <div className="projectCardImage" aria-hidden="true">
        {imageUrl && <img src={imageUrl} alt="" aria-hidden="true" />}
      </div>
      <div className="projectCardBody">
        <div className="projectCardInfo">
          <h3 className="projectCardTitle">{title}</h3>
          {description && <p className="projectCardDescription">{description}</p>}
        </div>
        {tags.length > 0 && (
          <ul className="projectCardTags">
            {tags.map((tag) => (
              <li key={tag} className="projectCardTag">{tag}</li>
            ))}
          </ul>
        )}
        <span className="projectCardCta">ACESSAR DETALHES &gt;</span>
      </div>
    </article>
  );

  if (href) {
    return <Link href={href} className="projectCardLink">{content}</Link>;
  }

  return content;
};

export { ProjectCard };
