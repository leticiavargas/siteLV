import './styles.css';
import { MaterialCard } from '../MaterialCard';

const MaterialAreaSection = ({ id, title, description, materials = [] }) => {
  return (
    <section id={id} className='materialAreaSection'>
      <header className='materialAreaHeader'>
        <h2 className='materialAreaTitle'>{title}</h2>
        {description && <p className='materialAreaDescription'>{description}</p>}
      </header>
      <ul className='materialAreaList'>
        {materials.map((material, index) => (
          <li key={index}>
            <MaterialCard
              title={material.title}
              description={material.description}
              type={material.type}
              iconName={material.iconName}
              href={material.href}
              area={title}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export { MaterialAreaSection };
