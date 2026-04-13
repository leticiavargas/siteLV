import Image from 'next/image';
import './styles.css';

import logo from '@images/logo.webp';
import logoInvert from '@images/logo-invert.webp';
import { Icon } from '@components';
import { NavMobile } from './NavMobile';

const Header = ({ variant }) => {
  const isDark = variant === 'dark';
  return (
    <header className={`headerContainer${isDark ? ' headerContainer--dark' : ''}`}>
      <Image src={isDark ? logoInvert : logo} alt="Marca Letícia Vargas" width={118} />
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
        <li><Icon iconName="github" /></li>
        <li><Icon iconName="instagram" /></li>
        <li><Icon iconName="linkedin" /></li>
      </ul>
      <NavMobile />
    </header>
  );
};

export { Header };