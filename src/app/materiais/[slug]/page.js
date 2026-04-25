import { notFound } from 'next/navigation';
import { Header, Footer } from '../../components';
import { PageHero } from '../../components/PageHero';
import { MaterialCard } from '../../components/MaterialCard';
import { areasApi, materialItemsApi } from '@/lib/api';
import './styles.css';

export const dynamic = 'force-dynamic';

export default async function MaterialAreaPage({ params }) {
  const { slug } = await params;

  const [areasData, materialsData] = await Promise.all([
    areasApi.list({ perPage: 100, status: 'published', visible: true }),
    materialItemsApi.list({ perPage: 100, status: 'published', visible: true }),
  ]);

  const area = areasData.items.find(a => a.slug === slug);
  if (!area) notFound();

  const materials = materialsData.items
    .filter(m => m.areaId === area.id)
    .map(m => ({
      id: m.id,
      title: m.title,
      description: m.description,
      type: m.type,
      iconName: m.iconName,
    }));

  return (
    <>
      <Header />
      <main>
        <PageHero
          title={area.title}
          subtitle={area.description}
        />
        <section className='materialAreaPage'>
          <a href='/materiais' className='materialAreaBack'>
            <span className='material-symbols-outlined'>arrow_back</span>
            Todos os materiais
          </a>
          {materials.length === 0 ? (
            <p className='materialAreaEmpty'>Nenhum material disponível nesta área ainda.</p>
          ) : (
            <ul className='materialAreaPageList'>
              {materials.map(m => (
                <li key={m.id}>
                  <MaterialCard
                    title={m.title}
                    description={m.description}
                    type={m.type}
                    iconName={m.iconName}
                    href={`/materiais/item/${m.id}`}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
