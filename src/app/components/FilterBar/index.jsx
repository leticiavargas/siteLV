'use client';

import './styles.css';

const FilterBar = ({ tags = [], activeTag, onSelect }) => {
  return (
    <nav className='filterBarContainer' aria-label="Filtrar por tag">
      <span className='filterHash' aria-hidden="true">#</span>
      <ul className='filterList'>
        {tags.map((tag) => (
          <li key={tag}>
            <button
              className={`filterBtn ${tag === '+' ? 'filterBtn--plus' : ''} ${activeTag === tag ? 'filterBtn--active' : ''}`}
              onClick={() => onSelect?.(tag)}
              aria-pressed={activeTag === tag}
            >
              {tag}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export { FilterBar };
