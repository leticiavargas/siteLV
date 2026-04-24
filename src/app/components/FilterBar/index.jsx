'use client';

import { useState } from 'react';
import './styles.css';

const VISIBLE_COUNT = 5;

const FilterBar = ({ tags = [], activeTag, onSelect }) => {
  const [expanded, setExpanded] = useState(false);

  // 'Todas' sempre primeiro, depois as demais
  const [first, ...rest] = tags;
  const visibleTags = expanded ? tags : [first, ...rest.slice(0, VISIBLE_COUNT)];
  const hasMore = rest.length > VISIBLE_COUNT;

  return (
    <nav className='filterBarContainer' aria-label="Filtrar por tag">
      <ul className='filterList'>
        {visibleTags.map((tag) => (
          <li key={tag}>
            <button
              className={`filterBtn ${activeTag === tag ? 'filterBtn--active' : ''}`}
              onClick={() => onSelect?.(tag)}
              aria-pressed={activeTag === tag}
              aria-label={tag === 'Todas' ? 'Ver todos os artigos' : `Filtrar por ${tag}`}
            >
              {tag}
            </button>
          </li>
        ))}

        {hasMore && (
          <li>
            <button
              className='filterBtn filterBtn--expand'
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
            >
              {expanded ? 'Menos' : `+${rest.length - VISIBLE_COUNT} mais`}
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export { FilterBar };
