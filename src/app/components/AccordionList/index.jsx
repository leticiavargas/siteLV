import './styles.css';
import { AccordionItem } from '../../components/AccordionItem';

const AccordionList = ({ items = [] }) => {

  return (
    <ul className='accordionList'>
      {items.map((item, i) => (
        <li key={item.id ?? i}>
          <AccordionItem question={item.question} answer={item.answer} links={item.links} />
        </li>
      ))}
    </ul>
  );
};

export { AccordionList };
