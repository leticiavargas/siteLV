import './styles.css';
import { Button } from '../Button';
import { HeroTyped } from './HeroTyped';

const Hero = ({ featuredArticle }) => {
  const publishedDate = featuredArticle?.publishedAt
    ? new Date(featuredArticle.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
    : null;
  return (
    <section className='heroContainer'>
      <span className='heroBlob heroBlob--1' aria-hidden="true" />
      <span className='heroBlob heroBlob--2' aria-hidden="true" />
      <span className='heroBlob heroBlob--3' aria-hidden="true" />

      {/* Decorações geométricas */}
      <span className='heroAccentDot heroAccentDot--1' aria-hidden="true" />
      <span className='heroAccentDot heroAccentDot--2' aria-hidden="true" />
      <span className='heroAccentLine heroAccentLine--1' aria-hidden="true" />
      <span className='heroAccentLine heroAccentLine--2' aria-hidden="true" />
      <div className='heroDotGrid' aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className='heroDotGrid__dot' />
        ))}
      </div>
      <div className='heroCrossAccent' aria-hidden="true">
        <span className='heroCrossAccent__h' />
        <span className='heroCrossAccent__v' />
      </div>

      <div className='heroInner'>
        <div className='heroLeft'>
          <p className='heroTagline'><HeroTyped /></p>

          <div className='heroHeadline' aria-label="Engenharia de software com alma de artesã.">
            <span className='heroHeadline__1'>Engenharia de</span>
            <span className='heroHeadline__2'>software com alma de</span>
            <span className='heroHeadline__3'>artesã.</span>
          </div>

          <p className='heroDescription'>
            Um hub de conteúdos para quem quer entender o &apos;porquê&apos; antes do &apos;como&apos; (ou só está perdido mesmo).
          </p>

          <nav className='heroCtas' aria-label="Ações principais">
            <Button label="Explorar artigos →" variant="primary" href="/artigos" />
            <Button label="Sobre mim" variant="outline" href="/sobre" />
          </nav>
        </div>

        {featuredArticle && (
          <a
            href={`/artigos/${featuredArticle.id}`}
            className='heroFeaturedCard'
            aria-label={`Artigo em destaque: ${featuredArticle.title}`}
          >
            <span className='heroFeaturedCard__tag'>DESTAQUE</span>
            {featuredArticle.imageUrl && (
              <div className='heroFeaturedCard__image'>
                <img src={featuredArticle.imageUrl} alt="" />
              </div>
            )}
            <div className='heroFeaturedCard__divider' aria-hidden="true" />
            <h2 className='heroFeaturedCard__title'>{featuredArticle.title}</h2>
            {featuredArticle.excerpt && (
              <p className='heroFeaturedCard__body'>
                {featuredArticle.excerpt.length > 120
                  ? featuredArticle.excerpt.slice(0, featuredArticle.excerpt.lastIndexOf(' ', 120)) + '…'
                  : featuredArticle.excerpt}
              </p>
            )}
            <footer className='heroFeaturedCard__footer'>
              <span className='heroFeaturedCard__avatar' aria-hidden="true" />
              <div className='heroFeaturedCard__meta'>
                <span className='heroFeaturedCard__author'>leticia vargas</span>
                {publishedDate && <time className='heroFeaturedCard__date'>{publishedDate}</time>}
              </div>
              <span className='heroFeaturedCard__arrow' aria-hidden="true">&gt;</span>
            </footer>
          </a>
        )}
      </div>

      {/* Code accents decorativos */}
      <div className='heroCodeAccents' aria-hidden="true">
        <span aria-hidden="true">{'<div className="hero">'}</span>
        <span aria-hidden="true">{'  const [ready, setReady] = useState(true);'}</span>
        <span aria-hidden="true">{'</div>'}</span>
      </div>
    </section>
  );
}

export { Hero };
