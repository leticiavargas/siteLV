import './styles.css';
import { CategoryCard } from '../CategoryCard';

const CategorySection = ({ title = 'Pesquise por categoria', categories = [] }) => {
  return (
    <section className='categorySection'>
      <h2 className='categorySectionTitle'>{title}</h2>
      <ul className='categoryGrid'>
        {categories.map((cat) => (
          <CategoryCard
            key={cat.title}
            iconName={cat.iconName}
            title={cat.title}
            description={cat.description}
            href={cat.href}
          />
        ))}
      </ul>
    </section>
  );
};

export { CategorySection };
