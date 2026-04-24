export const revalidate = 3600;

import Link from 'next/link';
import { Header, Footer } from '../components';
import { PageHero } from '../components/PageHero';
import { faqApi } from '@/lib/api';
import './styles.css';
import { AccordionList } from '../components/AccordionList';

export default async function FAQ({ searchParams }) {
  const q = (await searchParams).q ?? '';
  const data = await faqApi.list({ perPage: 100, status: 'published', visible: true, q });
  const questions = data.items;

  return (
    <>
      <Header />
      <main>
        <PageHero
          title="TL;DR"
          subtitle="Perguntas que eu já fiz, que já me fizeram e que a gente sempre esquece a resposta"
          searchPlaceholder="o que está te travando hoje?"
        />

        <section className='faqCommonSection'>
          <h2 className='faqCommonTitle'>
            {q ? `Resultados para "${q}"` : 'Guia de bolso'}
          </h2>
          {questions.length > 0 ? (
            <AccordionList items={questions} />
          ) : (
            <p className='faqEmptyState'>Nenhuma pergunta encontrada para &ldquo;{q}&rdquo;.</p>
          )}
        </section>

        <section className='faqNotFound'>
          <aside className='faqNotFoundSection'>
            <h2 className='faqNotFoundTitle'>Ainda no escuro?</h2>
            <p className='faqNotFoundText'>
              Se a resposta que você buscava não está aqui, vamos desatar esse nó juntos. 
              Nenhuma pergunta é pequena demais para ser explicada com clareza.
            </p>
          </aside>
          <Link href='/sobre?ref=tldr#contato' className='faqNotFoundCta'>
            Manda sua dúvida
            <span className='material-symbols-outlined'>arrow_forward</span>
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
