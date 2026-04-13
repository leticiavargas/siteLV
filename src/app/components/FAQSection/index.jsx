import './styles.css';
import { AccordionItem } from '../AccordionItem';
import { Button } from '../Button';

const FAQSection = ({ items = [] }) => {
  return (
    <section className='faqSection'>
      <div className='faqHeading'>
        <h2>TL;DR</h2>
        <p>Respostas rápidas para perguntas que o ChatGPT costuma enrolar para responder.</p>
      </div>
      <div className='faqContent'>
        <ul className='faqList'>
          {items.map((item, index) => (
            <li key={index}>
              <AccordionItem question={item.question} answer={item.answer} />
            </li>
          ))}
        </ul>
        <div className='faqMore'>
          <Button label="Acessar lista completa" variant="outline" href="/faq" />
        </div>
      </div>
    </section>
  );
};

export { FAQSection };
