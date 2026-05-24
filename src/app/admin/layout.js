import { AdminLogout } from './_components/AdminLogout';
import { SessionRefresher } from './_components/SessionRefresher';
import './layout.css';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: 'dashboard' },
  { label: 'Artigos', href: '/admin/artigos', icon: 'article' },
  { label: 'Projetos', href: '/admin/projetos', icon: 'work' },
  { label: 'Materiais', href: '/admin/materiais', icon: 'menu_book' },
  { label: 'FAQ', href: '/admin/faq', icon: 'help' },
  { label: 'Eventos', href: '/admin/eventos', icon: 'event' },
  { label: 'Usuários', href: '/admin/usuarios', icon: 'manage_accounts' },
];

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin — Letícia Vargas',
};

export default function AdminLayout({ children }) {
  return (
    <div className='adminShell'>
      <SessionRefresher />
      <aside className='adminSidebar'>
        <div className='adminSidebarBrand'>
          <span className='adminSidebarBrandName'>letícia vargas</span>
          <span className='adminSidebarBrandTag'>admin</span>
        </div>

        <nav className='adminNav' aria-label="Navegação administrativa">
          <ul className='adminNavList'>
            {NAV_ITEMS.map(({ label, href, icon }) => (
              <li key={href}>
                <a href={href} className='adminNavLink'>
                  <span className='material-symbols-outlined adminNavIcon'>{icon}</span>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className='adminSidebarFooter'>
          <a href="/" className='adminExitLink'>
            <span className='material-symbols-outlined'>arrow_back</span>
            Ver site
          </a>
        </div>
      </aside>

      <div className='adminMain'>
        <header className='adminTopbar'>
          <div className='adminTopbarUser'>
            <AdminLogout />
          </div>
        </header>

        <main className='adminContent'>
          {children}
        </main>
      </div>
    </div>
  );
}
