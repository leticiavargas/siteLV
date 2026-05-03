import './styles.css';

const FORMAT_LABEL = {
  'in-person': 'Presencial',
  'online': 'Online',
  'hybrid': 'Híbrido',
  presencial: 'Presencial',
  hibrido: 'Híbrido',
};

const ROLE_LABEL = {
  speaker: 'Palestrante',
  coordinator: 'Coordenador(a)',
  organizer: 'Organizador(a)',
};

const EventCard = ({ image, title, date, href, formato, vou, role }) => {
  const isInternal = href?.startsWith('/');

  const content = (
    <>
      {(formato || vou || role) && (
        <ul className='eventCardBadges'>
          {role && ROLE_LABEL[role] && (
            <li className='eventCardBadge eventCardBadge--role'>{ROLE_LABEL[role]}</li>
          )}
          {formato && (
            <li className={`eventCardBadge eventCardBadge--${formato}`}>
              {FORMAT_LABEL[formato]}
            </li>
          )}
          {vou && (
            <li className='eventCardBadge eventCardBadge--vou'>Vou!</li>
          )}
        </ul>
      )}
      <p className='eventCardTitle'>{title}</p>
      {date && <time className='eventCardDate'>{date}</time>}
    </>
  );

  return (
    <article
      className='eventCard'
      style={{ backgroundImage: `url(${image})` }}
      aria-label={title}
    >
      <div className='eventCardOverlay'>
        {href
          ? <a
              href={href}
              {...(!isInternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className='eventCardLink'
            >
              {content}
            </a>
          : content
        }
      </div>
    </article>
  );
};

export { EventCard };
