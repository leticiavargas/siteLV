'use client';

import { useEffect, useRef, useState } from 'react';
import './styles.css';

import perfil from '@assets/perfil.webp';

const TOTAL_LINES = 24;
const ACTIVE_LINE = 20; // 0-indexed → exibe linha 16

const AboutSection = () => {
  const sectionRef = useRef(null);
  const [scanLine, setScanLine] = useState(-1);
  const [done, setDone] = useState(false);
  const animated = useRef(false);

  /* useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;

          if (prefersReduced) {
            setScanLine(ACTIVE_LINE);
            setDone(true);
            return;
          }

          let line = 0;
          const interval = setInterval(() => {
            setScanLine(line);
            line++;
            if (line > ACTIVE_LINE) {
              clearInterval(interval);
              setDone(true);
            }
          }, 120);
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []); */

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const runScan = () => {
      setDone(false); // Reset do estado de conclusão
      let line = 0;
      
      const interval = setInterval(() => {
        setScanLine(line);
        line++;
        
        if (line > ACTIVE_LINE) {
          clearInterval(interval);
          setDone(true);
          
          // AGUARDA 15 SEGUNDOS E REINICIA
          setTimeout(() => {
            if (animated.current) runScan(); 
          }, 15000); 
        }
      }, 120); // 120ms para ser elegante
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          runScan();
        } else if (!entry.isIntersecting) {
          // Opcional: para a animação se o user sair da secção
          animated.current = false;
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <section className='aboutSection' ref={sectionRef}>
      <article className='aboutCard'>

        {/* Coluna esquerda: foto + gutter de números */}
        <div className='aboutGutter' aria-hidden="true">
          <div className='aboutGutterPhoto'>
            <div 
              className="aboutScanBar" 
              style={{ top: `${(scanLine / TOTAL_LINES) * 100}%` }} 
            />
            <img src={perfil.src} alt="" className='aboutGutterImg' />
          </div>

          <div className='aboutGutterLines'>
            {Array.from({ length: TOTAL_LINES }, (_, i) => (
              <span
                key={i}
                className={[
                  'aboutLineNum',
                  i === scanLine ? 'aboutLineNum--scan' : '',
                  i === ACTIVE_LINE && done ? 'aboutLineNum--active' : '',
                ].filter(Boolean).join(' ')}
              >
                {i + 1}
              </span>
            ))}
          </div>
        </div>

        {/* Coluna direita: conteúdo */}
        <div className='aboutContent'>
          <div className='aboutManifestoText'>
            <div className="aboutTerminalHeader">
              <span className="dot"></span><span className="dot"></span><span className="dot"></span>
              <span className="terminalPath">~/leticia-vargas/manifesto.js</span>
            </div>
            <span className='aboutFileTag'>{'// Handcrafted por:'}</span>
            <p className='aboutRole'>Dev &amp; mentora</p>
            <h2 className='aboutHeading'>Menos hype, mais contexto</h2>
            <p className='aboutDescription'>
              Sou Letícia Vargas, desenvolvedora Full Stack com mais de 6 anos de jornada técnica. 

              Após trocar os <strong>códigos de lei</strong> pelos <strong>códigos de programação</strong>, encontrei na tecnologia minha forma de artesania. Criei este hub para consolidar o que o prompt nem sempre resolve sozinho.
            </p>
            <a href="/sobre" className='aboutLink'>Conheça minha história →</a>
          </div>
          <aside className='aboutTerminalStats' aria-hidden="true">
            <div className='statsHeader'>[ BUILD_INFO ]</div>
            <ul className='statsList'>
              <li> {'>'} STACK: NEXT.js 15 // REACT 19</li>
              <li> {'>'} CSS: HANDCRAFTED // ZERO_FRAMEWORK</li>
              <li> {'>'} BUNDLE: 42KB (GZIPPED)</li>
              <li> {'>'} PERF: 100 // ACC: 100 // SEO: 100</li>
              <li> {'>'} DEPLOY_TIME: 1.2s</li>
              <li> 
                {'>'} STATUS: STABLE
                <span className="terminalCursor" aria-hidden="true">|</span>
              </li>
            </ul>
            <div className='statsFooter'>L-VRS // REF.06</div>
          </aside>
        </div>
            

      </article>

    </section>
  );
};

export { AboutSection };
