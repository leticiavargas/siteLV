import { Header, Footer } from '../components';
import { PageHero } from '../components/PageHero';
import { AccordionItem } from '../components/AccordionItem';
import { faqApi } from '@/lib/api';
import './styles.css';

export default async function FAQ() {
  const data = await faqApi.list({ perPage: 100, status: 'published', visible: true });
  const questions = data.items;

  return (
    <>
      <Header />
      <main>
        <PageHero
          title="FAQ"
          subtitle="Tem alguma dúvida? Talvez ela já tenha sido respondida aqui!"
          searchPlaceholder="Procure por respostas"
        />

        <section className='faqCommonSection'>
          <h2 className='faqCommonTitle'>Perguntas mais comuns</h2>
          <ul className='faqCommonList'>
            {questions.map(item => (
              <li key={item.id}>
                <AccordionItem question={item.question} answer={item.answer} />
              </li>
            ))}
          </ul>
        </section>

        <section className='faqNotFound'>
          <h2 className='faqNotFoundTitle'>Não encontrou o que você procurava?</h2>
          <p className='faqNotFoundText'>Entre em contato e envie sua pergunta</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
