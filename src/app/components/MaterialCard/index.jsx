import './styles.css';
import { Icon } from '../Icon';
import { Tag } from '../tag';

const MaterialCard = ({ title, description, type, iconName = 'description', href = '#' }) => {
  return (
    <article className='materialCard'>
      <a href={href} className='materialCardLink'>
        <span className='materialCardIcon'>
          <Icon iconName={iconName} />
        </span>
        <div className='materialCardBody'>
          <h3 className='materialCardTitle'>{title}</h3>
          <p className='materialCardDescription'>{description}</p>
        </div>
        {type && <Tag text={type} variant='outline' />}
      </a>
    </article>
  );
};

export { MaterialCard };
