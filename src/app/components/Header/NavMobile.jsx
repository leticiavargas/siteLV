'use client';

import { useState } from 'react';

const NavMobile = () => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

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
              <li><a href="/" onClick={close}>Início</a></li>
              <li><a href="/artigos" onClick={close}>Artigos</a></li>
              <li><a href="/projetos" onClick={close}>Projetos</a></li>
              <li><a href="/materiais" onClick={close}>Materiais</a></li>
              <li><a href="/sobre" onClick={close}>Sobre</a></li>
            </ul>
          </nav>
        </>
      )}
    </div>
  );
};

export { NavMobile };
