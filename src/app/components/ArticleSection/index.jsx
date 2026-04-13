import './styles.css';
import { Card } from '../card';
import { Button } from '../Button';

const ArticleSection = ({ articles = [], columns = 4, moreHref, title, subtitle }) => {
  return (
    <section className='articleSection'>
      {title && (
        <div className='articleSectionHeader'>
          <h2 className='articleSectionTitle'>{title}</h2>
          {subtitle && <p className='articleSectionSubtitle'>{subtitle}</p>}
        </div>
      )}
      <ul className='articleGrid' style={{ '--article-columns': columns }}>
        {articles.map((article, index) => (
          <li
            key={index}
            className='animate-on-scroll'
            style={{ transitionDelay: `${index * 60}ms` }}
          >
            <Card
              title={article.title}
              description={article.description}
              tags={article.tags}
              href={article.href}
              iconName={article.iconName}
              publishedAt={article.publishedAt}
            />
          </li>
        ))}
      </ul>
      {moreHref && (
        <div className='articleMore'>
          <Button label="Aprofundar nos artigos ..." variant="outline" href={moreHref} />
        </div>
      )}
    </section>
  );
};

export { ArticleSection };
