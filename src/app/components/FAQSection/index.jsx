'use client';

import './styles.css';
import { Button } from '../Button';

const FAQSection = ({ items = [] }) => {
  return (
    <section className="faqSection">
      <div className="faqIntro">
        <p className="faqEyebrow">FAQ ESSENCIAL</p>
        <h2 className="faqTitle">TL;DR</h2>
        <p className="faqSubtitle">
          Respostas rápidas para perguntas que a IA costuma enrolar para responder.
        </p>
      </div>

      <div className="faqAccordionArea">
        <ul className="faqList">
          {items.map((item, i) => {
            const num = String(i + 1).padStart(2, '0');
            return (
              <li key={i}>
                <details className="faqItem">
                  <summary className="faqItemSummary">
                    <span className="faqItemQuestion">
                      {num} // {item.question}
                    </span>
                    <span className="faqItemToggle" aria-hidden="true" />
                  </summary>
                  <div
                    className="faqItemAnswer"
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                  />
                </details>
              </li>
            );
          })}
        </ul>

        <div className="faqFooter">
          <Button
            variant="navy"
             href="/faq" 
          >
            ver lista completa
          </Button>
        </div>
      </div>
    </section>
  );
};

export { FAQSection };
