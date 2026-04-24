import Image from 'next/image';
import './styles.css';

import logoWhite from '@images/logo-white.webp';
import logoInvert from '@images/logo-invert.webp';
import { Icon } from '@components';
import { NavMobile } from './NavMobile';
import { NavLinks } from './NavLinks';

const Header = ({ variant }) => {
  const isDark = variant === 'dark';
  return (
    <header className={`headerContainer${isDark ? ' headerContainer--dark' : ''}`}>
      <a href="/" aria-label="Ir para a página inicial">
        <Image src={isDark ? logoInvert : logoWhite} alt="Marca Letícia Vargas" width={118} className="headerLogo" priority fetchPriority="high" />
      </a>
      <NavLinks />
      <ul className='social headerSocial' aria-label="Redes sociais">
        <li><a href="https://github.com/leticiavargas" target="_blank" rel="noopener noreferrer" aria-label="GitHub de Letícia Vargas, abre em nova aba"><Icon iconName="github" /></a></li>
        <li><a href="https://instagram.com/lekkinhah" target="_blank" rel="noopener noreferrer" aria-label="Instagram de Letícia Vargas, abre em nova aba"><Icon iconName="instagram" /></a></li>
        <li><a href="https://linkedin.com/in/leticiavargas" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn de Letícia Vargas, abre em nova aba"><Icon iconName="linkedin" /></a></li>
      </ul>
      <NavMobile />
    </header>
  );
};

export { Header };
