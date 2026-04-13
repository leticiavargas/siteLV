import { Header, Footer } from '../components';
import { CategorySection } from '../components/CategorySection';
import { PageHero } from '../components/PageHero';
import { MaterialAreaSection } from '../components/MaterialAreaSection';
import { areasApi, materialItemsApi } from '@/lib/api';
import './styles.css';

export default async function Materiais() {
  const [areasData, materialsData] = await Promise.all([
    areasApi.list({ perPage: 100, status: 'published', visible: true }),
    materialItemsApi.list({ perPage: 100, status: 'published', visible: true }),
  ]);

  const areas = areasData.items;
  const materials = materialsData.items;

  const categories = areas.map(area => ({
    iconName: area.iconName,
    title: area.title,
    description: area.description,
    href: `/materiais/${area.slug}`,
  }));

  const areasSections = areas.map(area => ({
    id: area.slug,
    title: area.title,
    description: area.description,
    materials: materials
      .filter(m => m.areaId === area.id)
      .map(m => ({
        title: m.title,
        description: m.description,
        type: m.type,
        iconName: m.iconName,
        href: `/materiais/item/${m.id}`,
      })),
  }));

  return (
    <>
      <Header />
      <main>
        <PageHero
          title="Materiais"
          subtitle="Recursos selecionados para apoiar seu aprendizado em desenvolvimento web."
          searchPlaceholder="Buscar materiais..."
        />

        <CategorySection categories={categories} />

        <div className='materiaisContent'>
          {areasSections.map(area => (
            <MaterialAreaSection
              key={area.id}
              id={area.id}
              title={area.title}
              description={area.description}
              materials={area.materials}
            />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
