'use client';

import { AccordionList } from '../AccordionList';
import { SeeAllLink } from '../SeeAllLink';
import './styles.css';

const FAQSection = ({ items = [] }) => {
  return (
    <section className="faqSection">
      <header>
        <p className="faqEyebrow">faq essencial</p>
        <h2 className="faqTitle">TL;DR</h2>
        <p className="faqSubtitle">
          Perguntas que eu já fiz, que já me fizeram e que a gente sempre esquece a resposta
        </p>
      </header>

      <div className="faqAccordionArea">
        <AccordionList items={items} />
        <footer className="faqFooter">
          <SeeAllLink href="/faq">ver lista completa</SeeAllLink>
        </footer>
      </div>
    </section>
  );
};

export { FAQSection };
