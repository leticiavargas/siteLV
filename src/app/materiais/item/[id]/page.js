import { notFound } from 'next/navigation';
import { Header, Footer } from '../../../components';
import { Tag } from '../../../components/tag';
import { Icon } from '../../../components/Icon';
import { materialItemsApi, areasApi } from '@/lib/api';
import './styles.css';

export default async function MaterialDetalhe({ params }) {
  const { id } = await params;

  let material;
  try {
    material = await materialItemsApi.get(id);
  } catch {
    notFound();
  }

  if (!material || material.visible === false || material.status !== 'published') {
    notFound();
  }

  let area = null;
  try {
    const areasData = await areasApi.list({ perPage: 100 });
    area = areasData.items.find(a => a.id === material.areaId) ?? null;
  } catch {
    // área opcional
  }

  return (
    <>
      <Header />
      <main className='materialDetalhePage'>
        <div className='materialDetalheHero'>
          <div className='materialDetalheHeroInner'>
            <nav className='materialDetalheBreadcrumb' aria-label='Navegação'>
              <a href='/materiais'>Materiais</a>
              {area && (
                <>
                  <span aria-hidden='true'>›</span>
                  <a href={`/materiais/${area.slug}`}>{area.title}</a>
                </>
              )}
            </nav>

            <div className='materialDetalheHeroContent'>
              <span className='materialDetalheIcon'>
                <Icon iconName={material.iconName ?? 'description'} />
              </span>
              <div>
                <div className='materialDetalheMeta'>
                  {material.type && <Tag text={material.type} variant='outline' />}
                </div>
                <h1 className='materialDetalheTitulo'>{material.title}</h1>
                {material.description && (
                  <p className='materialDetalheDescricao'>{material.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='materialDetalheBody'>
          {material.content ? (
            <>
              <div
                className='materialDetalheConteudo'
                dangerouslySetInnerHTML={{ __html: material.content }}
              />
              {material.href && (
                <div className='materialDetalheFonte'>
                  <span className='material-symbols-outlined'>open_in_new</span>
                  <span>Recurso original:</span>
                  <a
                    href={material.href}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {material.href}
                  </a>
                </div>
              )}
            </>
          ) : material.href ? (
            <div className='materialDetalheExterno'>
              <p className='materialDetalheExternoTexto'>
                Este material está hospedado em uma plataforma externa. Clique no botão abaixo para acessá-lo.
              </p>
              <a
                href={material.href}
                className='materialDetalheExternoBtn'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Icon iconName='open_in_new' />
                Acessar material
              </a>
            </div>
          ) : (
            <p className='materialDetalheVazio'>Conteúdo em breve.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
