import { articlesApi, projectsApi, materialItemsApi, faqApi, eventsApi } from '@/lib/api';
import './styles.css';

const QUICK_LINKS = [
  { label: 'Novo artigo', href: '/admin/artigos/novo', icon: 'add' },
  { label: 'Novo projeto', href: '/admin/projetos/novo', icon: 'add' },
  { label: 'Novo material', href: '/admin/materiais/items/novo', icon: 'add' },
  { label: 'Novo evento', href: '/admin/eventos/novo', icon: 'add' },
];

export default async function AdminDashboard() {
  const [
    { total: totalArtigos },
    { total: totalProjetos },
    { total: totalMateriais },
    { total: totalFaq },
    { total: totalEventos },
  ] = await Promise.all([
    articlesApi.list({ perPage: 1 }),
    projectsApi.list({ perPage: 1 }),
    materialItemsApi.list({ perPage: 1 }),
    faqApi.list({ perPage: 1 }),
    eventsApi.list({ perPage: 1 }),
  ]);

  const STATS = [
    { label: 'Artigos publicados', value: String(totalArtigos), icon: 'article' },
    { label: 'Projetos', value: String(totalProjetos), icon: 'work' },
    { label: 'Materiais', value: String(totalMateriais), icon: 'menu_book' },
    { label: 'Perguntas no FAQ', value: String(totalFaq), icon: 'help' },
    { label: 'Eventos', value: String(totalEventos), icon: 'event' },
  ];

  return (
    <>
      <div className='adminPageHeader'>
        <h1 className='adminPageTitle'>Dashboard</h1>
        <p className='adminPageSubtitle'>Bem-vinda de volta, Letícia!</p>
      </div>

      <section className='adminStatsGrid'>
        {STATS.map(({ label, value, icon }) => (
          <div key={label} className='adminStatCard'>
            <span className='material-symbols-outlined adminStatIcon'>{icon}</span>
            <div className='adminStatInfo'>
              <span className='adminStatValue'>{value}</span>
              <span className='adminStatLabel'>{label}</span>
            </div>
          </div>
        ))}
      </section>

      <section className='adminQuickSection'>
        <h2 className='adminSectionTitle'>Ações rápidas</h2>
        <ul className='adminQuickList'>
          {QUICK_LINKS.map(({ label, href, icon }) => (
            <li key={label}>
              <a href={href} className='adminQuickLink'>
                <span className='material-symbols-outlined'>{icon}</span>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
