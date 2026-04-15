import {
  Header,
  Hero,
  AboutSection,
  HomeArticlesSection,
  ProjectsSection,
  EventsSection,
  FAQSection,
  Footer,
} from "./components";
import { PageAnimations } from './components/PageAnimations';
import { articlesApi, faqApi, eventsApi, projectsApi } from '@/lib/api';

function formatDate(date, endDate) {
  if (!date) return '';
  const opcoes = { day: '2-digit', month: 'short', year: 'numeric' };
  const inicio = new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR', opcoes);
  if (!endDate) return inicio;
  const fim = new Date(`${endDate}T12:00:00`).toLocaleDateString('pt-BR', opcoes);
  return `${inicio} – ${fim}`;
}

export default async function Home() {
  const [articlesData, faqData, eventsData, projectsData, featuredData] = await Promise.all([
    articlesApi.list({ perPage: 8, status: 'published', visible: true }),
    faqApi.list({ perPage: 4, status: 'published', visible: true }),
    eventsApi.list({ future: true, status: 'published', visible: true, perPage: 10 }),
    projectsApi.list({ status: 'published', visible: true, perPage: 3 }),
    articlesApi.list({ featured: true, status: 'published', visible: true, perPage: 1 }),
  ]);

  const articles = articlesData.items.map(a => ({
    title: a.title,
    description: a.excerpt,
    tags: a.tags ?? [],
    href: `/artigos/${a.id}`,
    iconName: a.iconName,
    publishedAt: a.publishedAt ?? null,
    imageUrl: a.imageUrl ?? null,
  }));

  const faqItems = faqData.items.map(f => ({
    question: f.question,
    answer: f.answer,
  }));

  const events = eventsData.items.map(e => ({
    title: e.title,
    rawDate: e.date,
    href: e.href,
    format: e.format,
    location: e.location,
    attending: e.attending,
  }));

  const featuredArticle = featuredData.items[0] ?? null;

  const projects = projectsData.items.map(p => ({
    title: p.title,
    description: p.description,
    tags: p.tags ?? [],
    liveHref: p.liveHref,
    repoHref: p.repoHref,
    imageUrl: p.imageUrl,
  }));

  return (
    <>
      <main>
        <PageAnimations />
        <Header variant="dark" />
        <Hero featuredArticle={featuredArticle} />
        <HomeArticlesSection
          articles={articles}
          moreHref="/artigos"
        />
        <div className="animate-on-scroll">
          <ProjectsSection projects={projects} />
        </div>
        <div className="animate-on-scroll">
          <EventsSection events={events} />
        </div>
        <div className="animate-on-scroll">
          <FAQSection items={faqItems} />
        </div>
        <div className="animate-on-scroll">
          <AboutSection />
        </div>
      </main>
      <Footer />
    </>
  );
}
