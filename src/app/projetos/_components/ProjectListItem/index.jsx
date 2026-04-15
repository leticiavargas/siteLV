'use client';
import { useState } from 'react';
import Image from 'next/image';
import './styles.css';

export function ProjectListItem({ title, description, details, tags = [], imageUrl, liveHref, repoHref }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <li className="projectListItem">
      <div className="projectListItemMain">
        {imageUrl && (
          <div className="projectListItemImage">
            <Image
              src={imageUrl}
              alt={title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="120px"
            />
          </div>
        )}

        <div className="projectListItemInfo">
          <div className="projectListItemHeader">
            <h2 className="projectListItemTitle">{title}</h2>
            <div className="projectListItemLinks">
              {liveHref && (
                <a
                  href={liveHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="projectListItemLink"
                  aria-label={`Acessar ${title}`}
                  onClick={e => e.stopPropagation()}
                >
                  <span className="material-symbols-outlined">open_in_new</span>
                  Live
                </a>
              )}
              {repoHref && (
                <a
                  href={repoHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="projectListItemLink"
                  aria-label={`Repositório de ${title}`}
                  onClick={e => e.stopPropagation()}
                >
                  <span className="material-symbols-outlined">code</span>
                  Repo
                </a>
              )}
            </div>
          </div>

          {description && <p className="projectListItemDescription">{description}</p>}

          {tags.length > 0 && (
            <ul className="projectListItemTags">
              {tags.map(tag => (
                <li key={tag} className="projectListItemTag">{tag}</li>
              ))}
            </ul>
          )}

          {details && (
            <button
              type="button"
              className="projectListItemToggle"
              onClick={() => setExpanded(prev => !prev)}
              aria-expanded={expanded}
            >
              <span className="material-symbols-outlined">
                {expanded ? 'expand_less' : 'expand_more'}
              </span>
              {expanded ? 'Ocultar detalhes' : 'Ver detalhes'}
            </button>
          )}
        </div>
      </div>

      {details && expanded && (
        <div
          className="projectListItemDetails"
          dangerouslySetInnerHTML={{ __html: details }}
        />
      )}
    </li>
  );
}
