import './styles.css';
import { Tag } from '../tag';
import { Icon } from '../Icon';

const ArticleHero = ({ tags = [], title, lead, authorName, authorDate, readTime }) => {
  return (
    <header className='articleHero'>
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
