import {
  Header,
  Hero,
  FilterBar,
  ArticleSection,
  AboutSection,
  EventsSection,
  FAQSection,
  Footer,
} from "./components";
import { artigosApi, faqApi, eventosApi } from '@/lib/api';

function formatarData(data, dataFim) {
  if (!data) return '';
  const opcoes = { day: '2-digit', month: 'short', year: 'numeric' };
  const inicio = new Date(`${data}T12:00:00`).toLocaleDateString('pt-BR', opcoes);
  if (!dataFim) return inicio;
  const fim = new Date(`${dataFim}T12:00:00`).toLocaleDateString('pt-BR', opcoes);
  return `${inicio} – ${fim}`;
}

export default async function Home() {
  const [artigosData, faqData, eventosData] = await Promise.all([
    artigosApi.listar({ perPage: 8, status: 'publicado', visivel: true }),
    faqApi.listar({ perPage: 3, status: 'publicado', visivel: true }),
    eventosApi.listar({ futuro: true, status: 'publicado', visivel: true, perPage: 10 }),
  ]);

  const articles = artigosData.items.map(a => ({
    title: a.titulo,
    description: a.lead,
    tags: a.tags ?? [],
    href: `/artigos/${a.id}`,
    iconName: a.iconName,
  }));

  const allTags = [...new Set(artigosData.items.flatMap(a => a.tags ?? []))];
  const filterTags = ['Todos', ...allTags, '+'];

  const faqItems = faqData.items.map(f => ({
    question: f.pergunta,
    answer: f.resposta,
  }));

  const events = eventosData.items.map(e => ({
    title: e.titulo,
    date: formatarData(e.data, e.dataFim),
    image: e.imageSrc,
    href: e.href,
    formato: e.formato,
    vou: e.vou,
  }));

  return (
    <>
      <Header />
      <main>
        <Hero />
        <FilterBar tags={filterTags} />
        <ArticleSection articles={articles} />
        <AboutSection
          description="Lorem ipsum dolor sit amet consectetur. Tristique tristique vitae euismod gravida a risus. Et ipsum vitae ultrices ligula in. Nisi nunc dui orci nulla. Tempor varius dui purus sit sed mattis porttitor sit."
          communityText="Entre para uma comunidade com mais gente começando na carreira de dev!"
          communityHref="#"
        />
        <EventsSection events={events} />
        <FAQSection items={faqItems} />
      </main>
      <Footer />
    </>
  );
}
