export const dynamic = 'force-dynamic';
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

  const updatedDate = material.updatedAt && material.publishedAt && material.updatedAt > material.publishedAt
    ? new Date(material.updatedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    : null;

  let area = null;
  try {
    const areasData = await areasApi.list({ perPage: 100 });
    area = areasData.items.find(a => a.id === material.areaId) ?? null;
  } catch {
    // área opcional
  }

  return (
    <>
      <Header variant="dark" logo="white" />
      <main className='materialDetalhePage'>
        <section className='materialDetalheHero'>
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
                {updatedDate && (
                  <p className='materialDetalheAtualizado'>Atualizado em {updatedDate}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className='materialDetalheBody'>
          {material.content ? (
            <>
              <div
                className='materialDetalheConteudo'
                dangerouslySetInnerHTML={{ __html: material.content }}
              />
              {material.href && (
                <footer className='materialDetalheFonte'>
                  <span className='material-symbols-outlined'>open_in_new</span>
                  <span>Recurso original:</span>
                  <a
                    href={material.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    data-material-title={material.title}
                    data-material-type={material.type}
                  >
                    {material.href}
                  </a>
                </footer>
              )}
              {Array.isArray(material.sources) && material.sources.length > 0 && (
                <aside className='materialDetalheFontes'>
                  <p className='materialDetalheFontesTitle'>Fontes e leituras recomendadas</p>
                  <ul className='materialDetalhefontesList'>
                    {material.sources.map((source, i) => (
                      <li key={i} className='materialDetalheFontesItem'>
                        {source.label && (
                          <span className='materialDetalheFontesItemLabel'>{source.label}</span>
                        )}
                        <a
                          href={source.url.startsWith('http') ? source.url : `https://${source.url}`}
                          className='materialDetalheFontesItemLink'
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          {source.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </aside>
              )}
            </>
          ) : material.href ? (
            <section className='materialDetalheExterno'>
              <p className='materialDetalheExternoTexto'>
                Este material está hospedado em uma plataforma externa. Clique no botão abaixo para acessá-lo.
              </p>
              <a
                href={material.href}
                className='materialDetalheExternoBtn'
                target='_blank'
                rel='noopener noreferrer'
                data-material-title={material.title}
                data-material-type={material.type}
              >
                <Icon iconName='open_in_new' />
                Acessar material
              </a>
            </section>
          ) : (
            <p className='materialDetalheVazio'>Conteúdo em breve.</p>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
