import './styles.css';
import { PageHeroSearch } from './PageHeroSearch';

const PageHero = ({ title, subtitle, searchPlaceholder }) => {
  return (
    <section className='pageHero'>
      {/* Decorações geométricas */}
      <div className='pageHeroDotGrid' aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className='pageHeroDotGrid__dot' />
        ))}
      </div>
      <span className='pageHeroAccentLine pageHeroAccentLine--1' aria-hidden="true" />
      <span className='pageHeroAccentLine pageHeroAccentLine--2' aria-hidden="true" />

      {/* Code accents decorativos */}
      <div className='pageHeroCodeAccents' aria-hidden="true">
        <span>{'import { content } from "@/lib/api";'}</span>
        <span>{'const data = await content.list();'}</span>
        <span>{'export default page;'}</span>
      </div>

      <div className='pageHeroContent'>
        <h1 className='pageHeroTitle'>{title}</h1>
        <hr className='pageHeroDivider' aria-hidden="true" />
        {subtitle && <p className='pageHeroSubtitle'>{subtitle}</p>}
      </div>
      {searchPlaceholder && (
        <PageHeroSearch placeholder={searchPlaceholder} />
      )}
    </section>
  );
};

export { PageHero };
