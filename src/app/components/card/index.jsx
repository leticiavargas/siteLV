import './styles.css';

import { Tag } from '../tag';
import { Icon } from '../Icon';

function formatarData(isoString) {
  if (!isoString) return null;
  return new Date(isoString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const Card = ({ title, description, tags = [], href, iconName, imageUrl, publishedAt }) => {
  const dataFormatada = formatarData(publishedAt);

  return (
    <article className='cardContainer'>
      {imageUrl ? (
        <div className='cardThumb'>
          <img src={imageUrl} alt="" />
        </div>
      ) : (
        <div className='cardBall'>
          {iconName && <Icon iconName={iconName} />}
        </div>
      )}
      <h2 className='cardTitle'>
        {href ? <a href={href}>{title}</a> : title}
      </h2>
      <p className='cardDescription'>{description}</p>

      <footer className='cardFooter'>
        {tags.length > 0 && (
          <ul className='cardTags'>
            {tags.map((tag) => (
              <li key={tag}>
                <Tag text={tag} />
              </li>
            ))}
          </ul>
        )}
        {dataFormatada && (
          <time className='cardDate' dateTime={publishedAt}>{dataFormatada}</time>
        )}
      </footer>
    </article>
  );
}

export { Card };
