import Link from 'next/link';
import Image from 'next/image';
import { SeeAllLink } from '../SeeAllLink';
import './styles.css';

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

        <header className="homeArticlesHeader">
          <div className="homeArticlesHeaderLeft">
            <span className="homeArticlesEdition">{editionLabel()}</span>
            <h2 className="homeArticlesTitle">Dos conceitos à prática.</h2>
          </div>
          {moreHref && (
            <SeeAllLink href={moreHref}>ver arquivo completo</SeeAllLink>
          )}
        </header>

        <div className="homeArticlesContent">
          <Link href={featured.href} className="homeArticlesFeatured">
            {featured.imageUrl && (
              <Image
                src={featured.imageUrl}
                alt={featured.title}
                fill
                sizes="(max-width: 768px) 100vw, clamp(300px, 52vw, 720px)"
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

          <ul className="homeArticlesList">
            {listItems.map((article, i) => {
              const num = String(i + 2).padStart(2, '0');
              const date = formatShortDate(article.publishedAt);
              const tags = article.tags;
              return (
                <li key={i} className="homeArticlesItem">
                  <Link href={article.href} className="homeArticlesItemLink">
                    <span className="homeArticlesItemNum" aria-hidden="true">{num}</span>
                    <div className="homeArticlesItemContent">
                      <h3 className="homeArticlesItemTitle">{article.title}</h3>
                      <ul className="homeArticlesListTags">
                        {tags.map((tag) => <li key={tag} className="homeArticlesItemTag">{tag}</li>)}
                      </ul>
                      {date && <span className="homeArticlesItemDate">{date}</span>}
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
