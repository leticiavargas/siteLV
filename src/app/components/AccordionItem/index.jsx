import './styles.css';

const AccordionItem = ({ question, answer }) => {
  return (
    <details className='accordionItem'>
      <summary className='accordionQuestion'>{question}</summary>
      <div className='accordionAnswer' dangerouslySetInnerHTML={{ __html: answer }} />
    </details>
  );
};

export { AccordionItem };
