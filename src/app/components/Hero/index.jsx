import './styles.css';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { HeroTyped } from './HeroTyped';

const Hero = () => {
  return (
    <section className='heroContainer'>
      <span className='heroBlob heroBlob--1' aria-hidden="true" />
      <span className='heroBlob heroBlob--2' aria-hidden="true" />
      <span className='heroBlob heroBlob--3' aria-hidden="true" />

      <article className='heroContent'>
        <p className='heroTagline'><HeroTyped /></p>
        <h1>Engenharia de software com alma de artesã.</h1>
        <p className='heroDescription'>
          Um hub de conteúdo para quem quer entender o 'porquê' antes do 'como' (ou só está perdido mesmo), com menos hype e mais código.
        </p>
        <div className='heroCtas'>
          <Button label="Ler o que importa" variant="primary" href="/artigos" />
          <Button label="Sobre" variant="outline" href="/sobre" />
        </div>
      </article>

      <aside className='heroHighLight'>
        <h2>/* O que tem no Hub */</h2>
        <ul className='heroFeatureList'>
          <li>
            <Icon iconName="article" aria-hidden="true" />
            Explorações técnicas e opiniões (fortes).
          </li>
          <li>
            <Icon iconName="conversion_path" aria-hidden="true" />
            O que eu queria ter ouvido no começo.
          </li>
          <li>
            <Icon iconName="diversity_3" aria-hidden="true" />
            Agenda da comunidade (e onde nos vemos).
          </li>
          <li>
            <Icon iconName="Inventory_2" aria-hidden="true" />
            Recursos curados (e testados) por mim.
          </li>
        </ul>
      </aside>
    </section>
  );
}

export { Hero };
