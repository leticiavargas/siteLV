'use client';

import { useState, useEffect } from 'react';
import { Header, Footer } from '../components';
import { PageHero } from '../components/PageHero';
import { EventCard } from '../components/EventCard';
import { eventsApi } from '@/lib/api';
import './styles.css';

const FILTERS = [
  { id: 'proximos', label: 'Próximos' },
  { id: 'todos', label: 'Todos' },
  { id: 'passados', label: 'Passados' },
];

function formatDate(date, endDate) {
  if (!date) return '';
  const opcoes = { day: '2-digit', month: 'short', year: 'numeric' };
  const inicio = new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR', opcoes);
  if (!endDate) return inicio;
  const fim = new Date(`${endDate}T12:00:00`).toLocaleDateString('pt-BR', opcoes);
  return `${inicio} – ${fim}`;
}

export default function Eventos() {
  const [filter, setFilter] = useState('proximos');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = { perPage: 100, status: 'published', visible: true };
    if (filter === 'proximos') params.future = true;
    if (filter === 'passados') params.past = true;

    eventsApi.list(params)
      .then(data => setEvents(data.items))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <>
      <Header />
      <PageHero
        title="Eventos"
        subtitle="Eventos de tecnologia que estou acompanhando ou pretendo participar."
      />
      <main className="eventosPage">
        <nav className="eventosFiltros" aria-label="Filtrar eventos">
          {FILTERS.map(f => (
            <button
              key={f.id}
              className={`eventosFiltroBtn${filter === f.id ? ' eventosFiltroBtn--ativo' : ''}`}
              onClick={() => setFilter(f.id)}
              aria-current={filter === f.id ? 'true' : undefined}
            >
              {f.label}
            </button>
          ))}
        </nav>

        {loading ? (
          <p className="eventosEmpty">Carregando eventos...</p>
        ) : events.length === 0 ? (
          <p className="eventosEmpty">Nenhum evento encontrado.</p>
        ) : (
          <ul className="eventosGrid">
            {events.map(event => (
              <li key={event.id}>
                <EventCard
                  image={event.imageUrl}
                  title={event.title}
                  date={formatDate(event.date, event.endDate)}
                  href={`/eventos/${event.id}`}
                  formato={event.format}
                  vou={event.attending}
                  role={event.role}
                />
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </>
  );
}
