'use client';

import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Início' },
  { href: '/artigos', label: 'Artigos' },
  { href: '/projetos', label: 'Projetos' },
  { href: '/materiais', label: 'Materiais' },
  { href: '/sobre', label: 'Sobre' },
];

const NavLinks = () => {
  const pathname = usePathname();

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav className="headerNav">
      <ul>
        {NAV_ITEMS.map(({ href, label }) => (
          <li key={href}>
            <a href={href} className={isActive(href) ? 'navLink--active' : ''}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export { NavLinks, NAV_ITEMS };
