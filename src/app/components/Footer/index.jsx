import Image from 'next/image';
import './styles.css';
import { Icon } from '../Icon';
import { GameEaster } from './GameEaster';

import icone from '@images/icone_invert.webp';

const SOCIAL_LINKS = [
  { iconName: 'github', label: 'github.com/leticiavargas', href: 'https://github.com/leticiavargas' },
  { iconName: 'instagram', label: '@lekkinhah', href: 'https://instagram.com/lekkinhah' },
  { iconName: 'linkedin', label: 'in/leticiavargas', href: 'https://linkedin.com/in/leticiavargas' },
];

const NAV_LINKS = [
  { label: 'Início', href: '/' },
  { label: 'Artigos', href: '/artigos' },
  { label: 'Crafted Code', href: '/projetos' },
  { label: 'Materiais', href: '/materiais' },
  { label: 'Eventos', href: '/eventos' },
  { label: 'TL;DR', href: '/faq' },
  { label: 'Sobre', href: '/sobre' },
  { label: 'Contato', href: '/sobre#contato' },
];

const Footer = () => {
  return (
    <footer className='footerContainer'>
      <div className='footerTop'>
        <div className='footerBrand'>
          <Image src={icone} alt="Ícone Letícia Vargas" width={48} />
        </div>

        <nav className='footerNav' aria-label="Links do rodapé">
          <ul className='footerNavList'>
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a href={href} className='footerNavLink'>{label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <ul className='footerSocial' aria-label="Redes sociais">
          {SOCIAL_LINKS.map(({ iconName, label, href }) => (
            <li key={iconName}>
              <a href={href} target="_blank" rel="noopener noreferrer" className='footerSocialLink'>
                <Icon iconName={iconName} />
                <span>{label}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className='footerGame'>
          <GameEaster />
        </div>
      </div>

      

      <div className='footerBottom'>
        <address className='footerCredits'>
          {/* All rights handcrafted. */}
          © 2026 Letícia Vargas. All rights handcrafted.
        </address>
      </div>
    </footer>
  );
};

export { Footer };
