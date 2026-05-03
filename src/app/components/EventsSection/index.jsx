import { SeeAllLink } from '../SeeAllLink';
import './styles.css';

const MONTHS = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];

const FORMAT_LABEL = {
  'in-person': 'Presencial',
  'hybrid': 'Híbrido',
  'online': 'Online',
};

function formatAgendaDate(dateStr) {
  if (!dateStr) return '';
  const [, month, day] = dateStr.split('-');
  return `${parseInt(day)} ${MONTHS[parseInt(month) - 1]}`;
}

function buildSubtitle(format, location) {
  const parts = [FORMAT_LABEL[format], location].filter(Boolean);
  return parts.join(' · ');
}

const EventsSection = ({ events = [] }) => {
  if (!events.length) return null;

  return (
    <section className="eventsSection">
      <header className="eventsSectionHeader">
        <p className="eventsSectionLabel">AGENDA TECH</p>
        <SeeAllLink href="/eventos">ver lista completa</SeeAllLink>
      </header>

      <div className="eventsRhythmBars" aria-hidden="true">
        <span className="eventsBar eventsBar--accent" />
        <span className="eventsPulse eventsPulse--accent" />
        <span className="eventsBar eventsBar--navy-dim" />
        <span className="eventsPulse eventsPulse--navy" />
        <span className="eventsBar eventsBar--navy" />
      </div>

      <div className="eventsAgenda">
        <p className="eventsAgendaTitle">Próximos eventos</p>
        <ul className="eventsAgendaList">
          {events.map((event, i) => {
            const rowVariant = i % 2 === 0 ? 'accent' : 'navy';
            const subtitle = buildSubtitle(event.format, event.location);

            return (
              <li key={event.id ?? event.href ?? i} className={`eventsAgendaRow eventsAgendaRow--${rowVariant}`}>
                <div className="eventsAgendaLeft">
                  <span className={`eventsDateBadge${event.attending ? ' eventsDateBadge--attending' : ''}`}>
                    {formatAgendaDate(event.rawDate)}
                  </span>
                  <div className="eventsAgendaInfo">
                    <div className="eventsAgendaNameRow">
                      <a href={`/eventos/${event.id}`} className="eventsAgendaName">{event.title}</a>
                      {event.attending && (
                        <span className="eventsAttendingBadge">vou</span>
                      )}
                    </div>
                    {subtitle && <span className="eventsAgendaSubtitle">{subtitle}</span>}
                  </div>
                </div>
                {event.href && (
                  <a
                    href={event.href}
                    className="eventsAgendaLink"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Acessar ${event.title}`}
                  >↗</a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export { EventsSection };
