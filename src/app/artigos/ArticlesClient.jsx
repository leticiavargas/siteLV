'use client';

import { useState } from 'react';
import { FilterBar } from '../components/FilterBar';
import { Card } from '../components/card';
import './styles.css';

function formatDate(isoString) {
  if (!isoString) return null;
  return new Date(isoString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const ArticlesClient = ({ articles }) => {
  const [activeTag, setActiveTag] = useState('Todas');

  const allTags = ['Todas', ...new Set(articles.flatMap(a => a.tags ?? []))];

  const filtered = activeTag === 'Todas'
    ? articles
    : articles.filter(a => a.tags?.includes(activeTag));

  const [featured, ...rest] = filtered;

  return (
    <div className='artigosContent'>
      <FilterBar tags={allTags} activeTag={activeTag} onSelect={setActiveTag} />

      {featured && (
        <article className='artigosFeatured animate-on-scroll'>
          {featured.imageUrl && (
            <div className='artigosFeaturedImage'>
              <img src={featured.imageUrl} alt={featured.title} />
            </div>
          )}
          <div className={`artigosFeaturedInner${featured.imageUrl ? ' artigosFeaturedInner--withImage' : ''}`}>
            <div className='artigosFeaturedMeta'>
              {featured.tags?.[0] && (
                <span className='artigosFeaturedTag'>{featured.tags[0]}</span>
              )}
              {featured.publishedAt && (
                <time className='artigosFeaturedDate' dateTime={featured.publishedAt}>
                  {formatDate(featured.publishedAt)}
                </time>
              )}
            </div>
            <h2 className='artigosFeaturedTitle'>
              <a href={`/artigos/${featured.id}`}>{featured.title}</a>
            </h2>
            {featured.excerpt && (
              <p className='artigosFeaturedExcerpt'>{featured.excerpt}</p>
            )}
            <a href={`/artigos/${featured.id}`} className='artigosFeaturedCta' tabIndex={-1} aria-hidden="true">
              Ler artigo <span aria-hidden="true">→</span>
            </a>
          </div>
        </article>
      )}

      {rest.length > 0 && (
        <ul className='artigosGrid'>
          {rest.map((article, index) => (
            <li
              key={article.id}
              className='animate-on-scroll'
              style={{ transitionDelay: `${index * 60}ms` }}
            >
              <Card
                title={article.title}
                description={article.excerpt}
                tags={article.tags ?? []}
                href={`/artigos/${article.id}`}
                iconName={article.iconName}
                imageUrl={article.imageUrl ?? null}
                publishedAt={article.publishedAt ?? null}
              />
            </li>
          ))}
        </ul>
      )}

      {filtered.length === 0 && (
        <p className='artigosEmpty'>Nenhum artigo encontrado para esta tag.</p>
      )}
    </div>
  );
};

export { ArticlesClient };
