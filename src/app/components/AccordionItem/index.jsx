import './styles.css';

const AccordionItem = ({ question, answer, links = [] }) => {
  return (
    <details className='accordionItem'>
      <summary className='accordionQuestion'>{question}</summary>
      <div className='accordionBody'>
        <div className='accordionAnswer' dangerouslySetInnerHTML={{ __html: answer }} />
        {links.length > 0 && (
          <nav className='accordionLinks' aria-label='Links complementares'>
            <ul>
              {links.map((link, i) => (
                <li key={i}>
                  <a href={link.url} target='_blank' rel='noopener noreferrer'>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </details>
  );
};

export { AccordionItem };
