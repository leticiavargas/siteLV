import { auth, signOut } from '@/auth';
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

export default async function AdminLayout({ children }) {
  const session = await auth();

  return (
    <div className='adminShell'>
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
          {session?.user && (
            <div className='adminTopbarUser'>
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name ?? 'Usuária'}
                  className='adminUserAvatar'
                  width={32}
                  height={32}
                  referrerPolicy="no-referrer"
                />
              )}
              <span className='adminUserName'>{session.user.name}</span>
              <form action={async () => {
                'use server';
                await signOut({ redirectTo: '/admin/login' });
              }}>
                <button type="submit" className='adminSignOutBtn' aria-label="Sair">
                  <span className='material-symbols-outlined'>logout</span>
                </button>
              </form>
            </div>
          )}
        </header>

        <main className='adminContent'>
          {children}
        </main>
      </div>
    </div>
  );
}
