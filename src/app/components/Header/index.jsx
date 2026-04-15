import Image from 'next/image';
import './styles.css';

import logoWhite from '@images/logo-white.webp';
import logoInvert from '@images/logo-invert.webp';
import { Icon } from '@components';
import { NavMobile } from './NavMobile';

const Header = ({ variant }) => {
  const isDark = variant === 'dark';
  return (
    <header className={`headerContainer${isDark ? ' headerContainer--dark' : ''}`}>
      <Image src={isDark ? logoInvert : logoWhite} alt="Marca Letícia Vargas" width={118} className="headerLogo" />
      <nav className='headerNav'>
        <ul>
          <li><a href="/">Início</a></li>
          <li><a href="/artigos">Artigos</a></li>
          <li><a href="/projetos">Projetos</a></li>
          <li><a href="/materiais">Materiais</a></li>
          <li><a href="/sobre">Sobre</a></li>
        </ul>
      </nav>
      <ul className='social headerSocial'>
        <li><a href="https://github.com/leticiavargas" target="_blank" rel="noopener noreferrer"><Icon iconName="github" /></a></li>
        <li><a href="https://instagram.com/lekkinhah" target="_blank" rel="noopener noreferrer"><Icon iconName="instagram" /></a></li>
        <li><a href="https://linkedin.com/in/leticiavargas" target="_blank" rel="noopener noreferrer"><Icon iconName="linkedin" /></a></li>
      </ul>
      <NavMobile />
    </header>
  );
};

export { Header };
