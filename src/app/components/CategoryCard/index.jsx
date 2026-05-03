import './styles.css';
import { Icon } from '../Icon';

const CategoryCard = ({ iconName, title, description, href = '#' }) => {
  return (
    <li>
      <a href={href} className='categoryCard' data-area-title={title}>
        <Icon iconName={iconName} className='categoryCardIcon' />
        <h3 className='categoryCardTitle'>{title}</h3>
        <p className='categoryCardDescription'>{description}</p>
      </a>
    </li>
  );
};

export { CategoryCard };
