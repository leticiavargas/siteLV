import Link from 'next/link';
import Image from 'next/image';
import './styles.css';
import { Button } from '../Button';

function formatShortDate(isoString) {
  if (!isoString) return null;
  return new Date(isoString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function editionLabel() {
  const now = new Date();
  return `edição · ${now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`;
}

const HomeArticlesSection = ({ articles = [], moreHref }) => {
  const featured = articles[0];
  const listItems = articles.slice(1, 5);

  if (!featured) return null;

  return (
    <section className="homeArticles">
      <div className="homeArticlesInner">
        <span className="homeArticlesDecoWord" aria-hidden="true">artigos</span>
        <span className="homeArticlesDecoLabel" aria-hidden="true">BLOG · DEV · FRONTEND</span>

        <div className="homeArticlesHeader">
          <div className="homeArticlesHeaderLeft">
            <span className="homeArticlesEdition">{editionLabel()}</span>
            <h2 className="homeArticlesTitle">Dos conceitos à prática.</h2>
          </div>
          {moreHref && (
            <Button variant="ghost" href={moreHref} label="Ver arquivo completo →" className="homeArticlesMoreLink" />
          )}
        </div>

        <div className="homeArticlesContent">
          <Link href={featured.href} className="homeArticlesFeatured">
            {featured.imageUrl && (
              <Image
                src={featured.imageUrl}
                alt={featured.title}
                fill
                sizes="720px"
                style={{ objectFit: 'cover' }}
              />
            )}
            <div className="homeArticlesFeaturedOverlay" aria-hidden="true" />
            <span className="homeArticlesFeaturedNum" aria-hidden="true">01</span>
            <div className="homeArticlesFeaturedBottom">
              <div className="homeArticlesFeaturedAccent" aria-hidden="true" />
              <h3 className="homeArticlesFeaturedTitle">{featured.title}</h3>
              {featured.description && (
                <p className="homeArticlesFeaturedDesc">{featured.description}</p>
              )}
              <span className="homeArticlesFeaturedCta">Ler artigo →</span>
            </div>
          </Link>

          <div className="homeArticlesDivider" aria-hidden="true" />

          <ul className="homeArticlesList">
            {listItems.map((article, i) => {
              const num = String(i + 2).padStart(2, '0');
              const date = formatShortDate(article.publishedAt);
              const tag = article.tags?.[0];
              return (
                <li key={i} className="homeArticlesItem">
                  <Link href={article.href} className="homeArticlesItemLink">
                    <span className="homeArticlesItemNum" aria-hidden="true">{num}</span>
                    <div className="homeArticlesItemContent">
                      <h3 className="homeArticlesItemTitle">{article.title}</h3>
                      <div className="homeArticlesItemMeta">
                        {tag && <span className="homeArticlesItemTag">{tag}</span>}
                        {tag && date && <span className="homeArticlesItemDot" aria-hidden="true">·</span>}
                        {date && <span className="homeArticlesItemDate">{date}</span>}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export { HomeArticlesSection };
