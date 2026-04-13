import './styles.css';
import { Icon } from '../Icon';

const PageHero = ({ title, subtitle, searchPlaceholder }) => {
  return (
    <section className='pageHero'>
      <div className='pageHeroContent'>
        <h1 className='pageHeroTitle'>{title}</h1>
        <hr className='pageHeroDivider' />
        {subtitle && <p className='pageHeroSubtitle'>{subtitle}</p>}
      </div>
      {searchPlaceholder && (
        <label className='pageHeroSearch' htmlFor='page-hero-search'>
          <Icon iconName="search" aria-hidden="true" />
          <input
            id='page-hero-search'
            type='search'
            placeholder={searchPlaceholder}
            className='pageHeroInput'
          />
        </label>
      )}
    </section>
  );
};

export { PageHero };
