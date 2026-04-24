'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from './NavLinks';

const NavMobile = () => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const pathname = usePathname();

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <div className="navMobileWrapper">
      <button
        className="navHamburger"
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={open}
        aria-controls="navMobileMenu"
        onClick={() => setOpen(!open)}
      >
        <span className="material-symbols-outlined">
          {open ? 'close' : 'menu'}
        </span>
      </button>

      {open && (
        <>
          <div className="navMobileOverlay" onClick={close} aria-hidden="true" />
          <nav id="navMobileMenu" className="navMobileMenu" aria-label="Menu mobile">
            <ul>
              {NAV_ITEMS.map(({ href, label }) => (
                <li key={href}>
                  <a href={href} onClick={close} className={isActive(href) ? 'navLink--active' : ''}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
};

export { NavMobile };
