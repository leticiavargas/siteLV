import './styles.css';

const FORMATO_LABEL = {
  presencial: 'Presencial',
  online: 'Online',
  hibrido: 'Híbrido',
};

const EventCard = ({ image, title, date, href, formato, vou }) => {
  const content = (
    <>
      {(formato || vou) && (
        <div className='eventCardBadges'>
          {formato && (
            <span className={`eventCardBadge eventCardBadge--${formato}`}>
              {FORMATO_LABEL[formato]}
            </span>
          )}
          {vou && (
            <span className='eventCardBadge eventCardBadge--vou'>Vou!</span>
          )}
        </div>
      )}
      <p className='eventCardTitle'>{title}</p>
      {date && <time className='eventCardDate'>{date}</time>}
    </>
  );

  return (
    <article
      className='eventCard'
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className='eventCardOverlay'>
        {href
          ? <a href={href} target="_blank" rel="noopener noreferrer" className='eventCardLink'>{content}</a>
          : content
        }
      </div>
    </article>
  );
};

export { EventCard };
