import { Header, Footer, Icon } from '../components';
import { PageHero } from '../components/PageHero';
import { ContactForm } from '../components/ContactForm';
import perfil from '@assets/perfil.webp';
import './styles.css';

const SOCIAL_LINKS = [
  { iconName: 'github', label: 'github.com/leticiavargas', href: 'https://github.com/leticiavargas' },
  { iconName: 'instagram', label: 'instagram.com/lekkinhah', href: 'https://instagram.com/lekkinhah' },
  { iconName: 'linkedin', label: 'linkedin.com/in/leticiavargas', href: 'https://linkedin.com/in/leticiavargas' },
];

export default async function Sobre({ searchParams }) {
  const ref = (await searchParams).ref;
  return (
    <>
      <Header />
      <main>
        <PageHero
          title="Por trás do código"
          subtitle="Desenvolvedora frontend, criadora de conteúdo e apaixonada por comunidade."
          searchPlaceholder=""
        />

        {/* ── ABOUT ───────────────────────────────────────────────────── */}
        <section className='aboutSection'>
          <div className='aboutContent'>
            <div className='aboutPhoto' aria-hidden="true">
              <div className='aboutPhotoAccent' />
              <img src={perfil.src} alt="" className='aboutPhotoImg' />
            </div>

            <div className='aboutText'>
              <h2 className='aboutTitle'>Quem é a <strong>Letícia?</strong></h2>

              <p>
                Construir software deve ter propósito, exige técnica, intenção e, acima de tudo, respeito por quem vai utiliza-los.
                Para mim, o código nunca foi um fim em si mesmo, mas uma ferramenta que permite incluir, democratizar e expandir conhecimento.
              </p>
              <p>
                No dia a dia, trilhar um caminho <i>slow code</i>, com uma arquitetura pensada no detalhe e a clareza do código
                permite entender como cada elemento se comunica e compõem o todo.
              </p>
              <p>
                Um bom projeto tem alma, tem intensão para além de uma simples tela. É sobre criar estruturas que suportem a vida, ou os dados,
                com elegância e sem excessos.
              </p>
              <p>
                Sou essa dualidade, muitos interesses, muitos sonhos e um desejo por mudar o mundo. Sou uma <span>otimista cronica</span>, sempre buscando enxergar
                o lado bom da vida, manter a esperança e acreditar no potencial humano, mesmo quando o mundo parece caótico.
              </p>
              <p>
                No fim das contas, sou movida pela troca. Gosto de gente, de conversas que fogem do script e de descobrir que a tecnologia é complexa,
                mas a gente não precisa ser.
              </p>
              <p>
                Este site é o meu laboratório pessoal, um espaço onde tento traduzir essa busca por clareza e compartilhar o que aprendo pelo caminho — de preferência, direto ao ponto e sem o hype que costuma cercar a nossa área.
              </p>
              <code>// Em busca do código que inclui.</code>
            </div>
          </div>

          <div className='aboutSkills'>
            <h3 className='aboutSkillsTitle'>Com o que trabalho</h3>
            <ul className='aboutSkillsList'>
              {['React', 'Next.js', 'JavaScript', 'CSS', 'Figma', 'Git'].map((skill) => (
                <li key={skill} className='aboutSkillsItem'>{skill}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── CONTACT ─────────────────────────────────────────────────── */}
        <section id="contato" className='contactSection'>
          <div className='contactContent'>
            <div className='contactText'>
              <h2 className='contactTitle'>{ref === 'tldr' ? 'Para além do resumo...' : "Vamos falar sobre o que importa?"}</h2>
              <p className='contactSubtitle'>
                {
                  ref === 'tldr' ?
                  "O TL;DR resolve o agora, mas se você quer entender o porquê ou tem uma dúvida que foge do script, me manda um sinal." :
                  "Seja para discutir  software, trocar ideias sobre otimismo em tempos caóticos ou apenas fugir do script por um momento."}
              </p>

              <ul className='contactLinks'>
                {SOCIAL_LINKS.map(({ iconName, label, href }) => (
                  <li key={iconName}>
                    <a href={href} target="_blank" rel="noopener noreferrer" className='contactLink'>
                      <Icon iconName={iconName} />
                      <span>{label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className='contactFormCard'>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
