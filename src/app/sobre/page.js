import { Header, Footer, Icon } from '../components';
import { PageHero } from '../components/PageHero';
import { ContatoForm } from './_components/ContatoForm';
import './styles.css';

const SOCIAL_CONTATO = [
  { iconName: 'github', label: 'github.com/leticiavargas', href: 'https://github.com/leticiavargas' },
  { iconName: 'instagram', label: 'instagram.com/lekkinhah', href: 'https://instagram.com/lekkinhah' },
  { iconName: 'linkedin', label: 'linkedin.com/in/leticiavargas', href: 'https://linkedin.com/in/leticiavargas' },
];

export default function Sobre() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          title="Por trás do código"
          subtitle="Desenvolvedora frontend, criadora de conteúdo e apaixonada por comunidade."
          searchPlaceholder=""
        />

        {/* ── SOBRE ───────────────────────────────────────────────────── */}
        <section className='sobreSection'>
          <div className='sobreContent'>
            <div className='sobreFoto' aria-hidden="true"></div>

            <div className='sobreTexto'>
              <h2 className='sobreTitulo'>Quem é a <strong>Letícia?</strong></h2>

              <p>
                Sou desenvolvedora frontend com foco em criar experiências digitais acessíveis e bem feitas.
                Trabalho com React, Next.js e CSS moderno no dia a dia, e acredito que código limpo e design
                cuidadoso andam sempre juntos.
              </p>
              <p>
                Além do trabalho, compartilho conteúdo sobre desenvolvimento web — desde fundamentos até
                boas práticas — porque aprendi a programar pela internet e quero devolver isso à comunidade.
              </p>
              <p>
                Quando não estou codando, estou provavelmente tomando café, lendo sobre tipografia ou
                redesenhando algo que não precisava ser redesenhado.
              </p>
            </div>
          </div>

          <div className='sobreHabilidades'>
            <h3 className='sobreHabilidadesTitulo'>Com o que trabalho</h3>
            <ul className='sobreHabilidadesList'>
              {['React', 'Next.js', 'JavaScript', 'CSS', 'Figma', 'Git'].map((skill) => (
                <li key={skill} className='sobreHabilidadeItem'>{skill}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── CONTATO ─────────────────────────────────────────────────── */}
        <section id="contato" className='contatoSection'>
          <div className='contatoContent'>
            <div className='contatoTexto'>
              <h2 className='contatoTitulo'>Vamos conversar?</h2>
              <p className='contatoSubtitulo'>
                Me manda uma mensagem — seja pra bater um papo, trocar uma ideia ou fechar um projeto.
              </p>

              <ul className='contatoLinks'>
                {SOCIAL_CONTATO.map(({ iconName, label, href }) => (
                  <li key={iconName}>
                    <a href={href} target="_blank" rel="noopener noreferrer" className='contatoLink'>
                      <Icon iconName={iconName} />
                      <span>{label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <ContatoForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
