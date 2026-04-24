import './styles.css';
import perfil from '@assets/perfil.webp';

const AboutSection = () => {
  return (
    /* ── VERSÃO V5 — Split Tone (Pencil: About V5 - Split Tone, id=fL70x) ── */
    <section className='aboutSection'>
      <article className='aboutStrip'>

        {/* Coluna esquerda: foto com borda accent offset */}
        <div className='aboutPhotoCol' aria-hidden="true">
          <div className='aboutPhotoAccent' />
          <img src={perfil.src} alt="" className='aboutPhoto' />
        </div>

        {/* Coluna direita: texto */}
        <div className='aboutTextCol'>
          <span className='aboutLabel'>{'// Handcrafted por:'}</span>
          <div className='aboutHeadingRow'>
            <span className='aboutAccentLine' aria-hidden="true" />
            <h2 className='aboutHeading'>Letícia Vargas</h2>
          </div>
          <p className='aboutBody'>
            Construir software, para mim, é um exercício de intenção. 
            O código serve como ferramenta de inclusão, permitindo criar e mudar a vida de quem usa. 
            Prazer, esse é o meu laboratório para compartilhar o que aprendo pelo caminho.
          </p>
          <a href="/sobre" className='aboutCta'>um pouco mais...→</a>
        </div>

      </article>
    </section>
  );
};

export { AboutSection };
