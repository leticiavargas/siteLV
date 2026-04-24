'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import './styles.css';

export function ProjectListItem({ id, title, description, details, tags = [], iconName, imageUrl, liveHref, repoHref, isLast, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const ref = useRef(null);

  useEffect(() => {
    if (defaultExpanded && ref.current) {
      setTimeout(() => ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [defaultExpanded]);

  return (
    <li ref={ref} className={`projectListItem${isLast ? ' projectListItem--last' : ''}`}>
      <div className='projectListItemIcon' aria-hidden="true">
        <span className='projectListItemIconCircle'>
          <span className='material-symbols-outlined'>{iconName || 'rocket_launch'}</span>
        </span>
        {!isLast && <span className='projectListItemLine' />}
      </div>

      <div className='projectListItemBody'>
        <div className='projectListItemMain'>
          {imageUrl && (
            <figure className='projectListItemImage'>
              <Image
                src={imageUrl}
                alt={title}
                fill
                style={{ objectFit: 'cover' }}
                sizes="120px"
              />
            </figure>
          )}

          <div className='projectListItemInfo'>
            <header className='projectListItemHeader'>
              <h2 className='projectListItemTitle'>{title}</h2>
              <nav className='projectListItemLinks' aria-label={`Links de ${title}`}>
                {liveHref && (
                  <a
                    href={liveHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='projectListItemLink'
                    aria-label={`Acessar ${title}`}
                  >
                    <span className='material-symbols-outlined'>open_in_new</span>
                    Live
                  </a>
                )}
                {repoHref && (
                  <a
                    href={repoHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='projectListItemLink'
                    aria-label={`Repositório de ${title}`}
                  >
                    <span className='material-symbols-outlined'>code</span>
                    Repo
                  </a>
                )}
              </nav>
            </header>

            {description && <p className='projectListItemDescription'>{description}</p>}

            {tags.length > 0 && (
              <ul className='projectListItemTags'>
                {tags.map(tag => (
                  <li key={tag} className='projectListItemTag'>{tag}</li>
                ))}
              </ul>
            )}

            {details && (
              <button
                type="button"
                className='projectListItemToggle'
                onClick={() => setExpanded(prev => !prev)}
                aria-expanded={expanded}
              >
                <span className='material-symbols-outlined'>
                  {expanded ? 'expand_less' : 'expand_more'}
                </span>
                {expanded ? 'Ocultar detalhes' : 'Ver detalhes'}
              </button>
            )}
          </div>
        </div>

        {details && expanded && (
          <div
            className='projectListItemDetails'
            dangerouslySetInnerHTML={{ __html: details }}
          />
        )}

        <span className='projectListItemSeparator' aria-hidden="true" />
      </div>
    </li>
  );
}
