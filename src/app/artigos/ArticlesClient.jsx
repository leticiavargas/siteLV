'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FilterBar } from '../components/FilterBar';
import './styles.css';

// Em produção: 10. Reduzido para 2 para testes enquanto há poucos artigos.
const PAGE_SIZE = 8;

function formatDate(isoString) {
  if (!isoString) return null;
  return new Date(isoString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();
}

const ArticleListItem = ({ title, excerpt, tags = [], href, publishedAt, iconName, isLast }) => {
  const date = formatDate(publishedAt);

  return (
    <li className={`articleItem${isLast ? ' articleItem--last' : ''}`}>
      <div className='articleItemIcon' aria-hidden="true">
        <span className='articleItemIconCircle'>
          <span className='material-symbols-outlined'>{iconName || 'article'}</span>
        </span>
        {!isLast && <span className='articleItemLine' />}
      </div>

      <div className='articleItemContent'>
        <div className='articleItemMeta'>
          {date && <time className='articleItemDate' dateTime={publishedAt}>{date}</time>}
          {date && tags.length > 0 && <span className='articleItemDot' aria-hidden="true">·</span>}
          {tags.length > 0 && (
            <ul className='articleItemTags'>
              {tags.map(tag => (
                <li key={tag}>
                  <span className='articleItemTag'>{tag}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <h2 className='articleItemTitle'>
          <a href={href}>{title}</a>
        </h2>

        {excerpt && <p className='articleItemExcerpt'>{excerpt}</p>}

        <a href={href} className='articleItemCta' tabIndex={-1} aria-hidden="true">
          Ler artigo →
        </a>

        <span className='articleItemSeparator' aria-hidden="true" />
      </div>
    </li>
  );
};

const ArticlesClient = ({ articles }) => {
  const searchParams = useSearchParams();
  const q = searchParams.get('q')?.trim().toLowerCase() ?? '';

  const [activeTag, setActiveTag] = useState('Todas');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const allTags = ['Todas', ...new Set(articles.flatMap(a => a.tags ?? []))];

  const filtered = articles.filter(a => {
    const matchesTag = activeTag === 'Todas' || a.tags?.includes(activeTag);
    const matchesSearch = !q
      || a.title?.toLowerCase().includes(q)
      || a.excerpt?.toLowerCase().includes(q);
    return matchesTag && matchesSearch;
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  function handleTagSelect(tag) {
    setActiveTag(tag);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div className='artigosContent'>
      <div className='artigosHeader'>
        <div className='artigosHeaderText'>
          <h2 className='artigosTitle'>Últimos artigos</h2>
          <p className='artigosSubtitle'>Conteúdo sobre desenvolvimento, carreira e tecnologia</p>
        </div>
        <span className='artigosAccentLine' aria-hidden="true" />
      </div>

      <FilterBar tags={allTags} activeTag={activeTag} onSelect={handleTagSelect} />

      {visible.length > 0 ? (
        <ul className='artigosList' aria-live="polite" aria-atomic="false">
          {visible.map((article, index) => (
            <ArticleListItem
              key={article.id}
              title={article.title}
              excerpt={article.excerpt}
              tags={article.tags ?? []}
              href={`/artigos/${article.id}`}
              publishedAt={article.publishedAt ?? null}
              iconName={article.iconName ?? ''}
              isLast={index === visible.length - 1}
            />
          ))}
        </ul>
      ) : (
        <p className='artigosEmpty'>
          {q
            ? `Nenhum artigo encontrado para "${q}".`
            : 'Nenhum artigo encontrado para esta tag.'}
        </p>
      )}

      {hasMore && (
        <div className='artigosLoadMore'>
          <button
            className='artigosLoadMoreBtn'
            onClick={() => setVisibleCount(v => v + PAGE_SIZE)}
          >
            Carregar mais artigos
          </button>
        </div>
      )}
    </div>
  );
};

export { ArticlesClient };
