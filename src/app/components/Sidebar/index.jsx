'use client';

import './styles.css';

const Sidebar = ({ title, tags = [], activeTag, onSelect }) => {
  return (
    <aside className='sidebar'>
      {title && <p className='sidebarTitle'>{title}</p>}
      <ul className='sidebarList'>
        {tags.map((tag) => (
          <li key={tag}>
            <button
              className={`sidebarTag ${activeTag === tag ? 'sidebarTag--active' : ''}`}
              onClick={() => onSelect?.(tag)}
              aria-pressed={activeTag === tag}
            >
              {tag}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export { Sidebar };
