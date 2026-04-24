import Link from 'next/link';
import Image from 'next/image';
import './styles.css';

const ProjectCard = ({ title, description, tags = [], imageUrl, href }) => {
  const content = (
    <article className="projectCard">
      <div className="projectCardImageWrap">
        <div className="projectCardOffset" aria-hidden="true" />
        <div className="projectCardImage">
          {imageUrl
            ? <Image src={imageUrl} alt={`Imagem do projeto ${title}`} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
            : (
              <div className="projectCardImagePlaceholder" aria-hidden="true">
                <span className="material-symbols-outlined">deployed_code</span>
              </div>
            )
          }
        </div>
      </div>
      <div className="projectCardBody">
        <div className="projectCardInfo">
          <h3 className="projectCardTitle">{title}</h3>
          {description && <p className="projectCardDescription">{description}</p>}
        </div>
        <div className="projectCardFooter">
          {tags.length > 0 && (
            <ul className="projectCardTags">
              {tags.map((tag) => (
                <li key={tag} className="projectCardTag">{tag}</li>
              ))}
            </ul>
          )}
          <span className="projectCardCta">VER →</span>
        </div>
      </div>
    </article>
  );

  if (href) {
    return <Link href={href} className="projectCardLink">{content}</Link>;
  }

  return content;
};

export { ProjectCard };
