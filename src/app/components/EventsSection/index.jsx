'use client';

import { useState } from 'react';
import './styles.css';
import { EventCard } from '../EventCard';

const VISIBLE = 3;
const GAP_REM = 1.5;

const EventsSection = ({ events = [] }) => {
  const [index, setIndex] = useState(0);
  const maxIndex = Math.max(0, events.length - VISIBLE);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(maxIndex, i + 1));

  return (
    <section className='eventsSection'>
      <div className='eventsSectionHeader'>
        <h2 className='eventsTitle'>Conexões na Comunidade Tech</h2>
        <a href="/eventos" className='eventsSeeAll'>Ver todos os eventos</a>
      </div>

      <div className='eventsCarousel'>
        <button
          className='carouselBtn'
          onClick={prev}
          disabled={index === 0}
          aria-label="Evento anterior"
        >
          &#8249;
        </button>

        <div className='eventsViewport'>
          <ul
            className='eventsTrack'
            style={{ '--slide-index': index, '--gap': `${GAP_REM}rem` }}
          >
            {events.map((event, i) => (
              <li key={i} className='eventsSlide'>
                <EventCard
                  image={event.image}
                  title={event.title}
                  date={event.date}
                  href={event.href}
                  formato={event.formato}
                  vou={event.vou}
                />
              </li>
            ))}
          </ul>
        </div>

        <button
          className='carouselBtn'
          onClick={next}
          disabled={index >= maxIndex}
          aria-label="Próximo evento"
        >
          &#8250;
        </button>
      </div>
    </section>
  );
};

export { EventsSection };
