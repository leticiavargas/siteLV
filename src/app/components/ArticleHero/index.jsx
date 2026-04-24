import './styles.css';
import { Tag } from '../tag';
import { Icon } from '../Icon';

const ArticleHero = ({ tags = [], title, lead, authorName, authorDate, readTime }) => {
  return (
    <header className='articleHero'>
      {/* Decorações geométricas */}
      <div className='articleHeroDotGrid' aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className='articleHeroDotGrid__dot' />
        ))}
      </div>
      <span className='articleHeroAccentLine articleHeroAccentLine--1' aria-hidden="true" />
      <span className='articleHeroAccentLine articleHeroAccentLine--2' aria-hidden="true" />
      <div className='articleHeroCrossAccent' aria-hidden="true">
        <span className='articleHeroCrossAccent__h' />
        <span className='articleHeroCrossAccent__v' />
      </div>

      {/* Code accents decorativos */}
      <div className='articleHeroCodeAccents' aria-hidden="true">
        <span>{'// artigo.jsx'}</span>
        <span>{'<Article author="leticia vargas"'}</span>
        <span>{'  publishedAt={article.publishedAt} />'}</span>
      </div>

      <div className='articleHeroInner'>
        <ul className='articleHeroTags'>
          {tags.map((tag) => (
            <li key={tag}><Tag text={tag} /></li>
          ))}
        </ul>

        <h1 className='articleHeroTitle'>{title}</h1>
        <p className='articleHeroLead'>{lead}</p>

        <hr className='articleHeroDivider' />

        <address className='articleHeroAuthor'>
          <div className='authorPhoto' aria-hidden="true"></div>
          <div className='authorInfo'>
            <span className='authorName'>{authorName}</span>
            <span className='authorMeta'>
              <time>{authorDate}</time>
              {readTime && <span> · {readTime}</span>}
            </span>
          </div>
        </address>
      </div>
    </header>
  );
};

export { ArticleHero };
