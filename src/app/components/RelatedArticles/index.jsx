import './styles.css';
import { Tag } from '../tag';

const RelatedArticleItem = ({ title, excerpt, tags = [], href = '#' }) => (
  <li className='relatedItem'>
    <a href={href} className='relatedItemLink'>
      <span className='relatedItemDot' aria-hidden="true"></span>
      <div className='relatedItemContent'>
        <p className='relatedItemTitle'>{title}</p>
        {excerpt && <p className='relatedItemExcerpt'>{excerpt}</p>}
        <ul className='relatedItemTags'>
          {tags.map((tag) => (
            <li key={tag}><Tag text={tag} /></li>
          ))}
        </ul>
      </div>
    </a>
  </li>
);

const RelatedArticles = ({ articles = [] }) => {
  if (articles.length === 0) return null;

  return (
    <aside className='relatedArticles'>
      <h2 className='relatedTitle'>Você também pode gostar</h2>
      <ul className='relatedList'>
        {articles.map((article, index) => (
          <RelatedArticleItem
            key={index}
            title={article.title}
            excerpt={article.excerpt}
            tags={article.tags}
            href={article.href}
          />
        ))}
      </ul>
    </aside>
  );
};

export { RelatedArticles };
