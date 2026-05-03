export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { Header, Footer } from '../../components';
import { PageHero } from '../../components/PageHero';
import { eventsApi } from '@/lib/api';
import './styles.css';

const FORMAT_LABEL = {
  'in-person': 'Presencial',
  'hybrid': 'Híbrido',
  'online': 'Online',
};

const ROLE_LABEL = {
  speaker: 'Palestrante',
  coordinator: 'Coordenador(a)',
  organizer: 'Organizador(a)',
  attendee: 'Participante',
};

const PARTICIPATION_SECTION_TITLE = {
  speaker: 'Minha palestra',
  coordinator: 'Minha coordenação',
  organizer: 'Minha contribuição',
};

function formatDate(date, endDate) {
  if (!date) return '';
  const opcoes = { day: '2-digit', month: 'long', year: 'numeric' };
  const inicio = new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR', opcoes);
  if (!endDate) return inicio;
  const fim = new Date(`${endDate}T12:00:00`).toLocaleDateString('pt-BR', opcoes);
  return `${inicio} – ${fim}`;
}

function buildSubtitle(event) {
  const parts = [FORMAT_LABEL[event.format], event.location].filter(Boolean);
  return parts.join(' · ');
}

export default async function EventoDetalhe({ params }) {
  const { id } = await params;
  let event;
  try {
    event = await eventsApi.get(id);
  } catch {
    notFound();
  }

  if (!event || event.status !== 'published' || event.visible === false) notFound();

  const date = formatDate(event.date, event.endDate);
  const subtitle = buildSubtitle(event);
  const hasParticipation = event.role && event.role !== 'attendee' && event.talkTitle;
  const sectionTitle = PARTICIPATION_SECTION_TITLE[event.role];

  return (
    <>
      <Header />
      <PageHero
        title={event.title}
        subtitle={subtitle || event.description}
      />
      <main className="eventoDetalhe">
        {event.imageUrl && (
          <div className="eventoDetalheImagem">
            <img src={event.imageUrl} alt={event.title} className="eventoDetalheImg" />
          </div>
        )}

        <div className="eventoDetalheContent">
          <div className="eventoDetalheMeta">
            {event.role && event.role !== 'attendee' && (
              <span className="eventoDetalheBadge eventoDetalheBadge--role">
                {ROLE_LABEL[event.role]}
              </span>
            )}
            {event.attending && (
              <span className="eventoDetalheBadge eventoDetalheBadge--attending">Vou!</span>
            )}
          </div>

          {date && (
            <p className="eventoDetalheData">
              <span className="material-symbols-outlined">calendar_today</span>
              {date}
            </p>
          )}

          {event.location && (
            <p className="eventoDetalheLocal">
              <span className="material-symbols-outlined">location_on</span>
              {event.location}
            </p>
          )}

          {event.description && (
            <p className="eventoDetalheDescricao">{event.description}</p>
          )}

          {hasParticipation && (
            <section className="eventoDetalhePalestra">
              <h2 className="eventoDetalhePalestraTitle">{sectionTitle}</h2>
              <p className="eventoDetalhePalestraNome">{event.talkTitle}</p>
              {event.materialsHref && (
                <a
                  href={event.materialsHref}
                  className="eventoDetalheMateriais"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="material-symbols-outlined">open_in_new</span>
                  Ver materiais
                </a>
              )}
            </section>
          )}

          <div className="eventoDetalheActions">
            {event.href && (
              <a
                href={event.href}
                className="eventoDetalheLinkExterno"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="material-symbols-outlined">open_in_new</span>
                Página oficial do evento
              </a>
            )}
            <a href="/eventos" className="eventoDetalheVoltar">
              ← Ver todos os eventos
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
