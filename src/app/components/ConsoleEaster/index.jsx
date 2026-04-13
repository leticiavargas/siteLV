'use client';
import { useEffect } from 'react';

export function ConsoleEaster() {
  useEffect(() => {
    console.group('%c🔎 Diagnóstico de Build', 'color: #9448BC; font-size: 16px; font-weight: bold;');
    console.log('%cStatus: %cHandcrafted com esteroides', 'color: #162650;', 'color: #9448BC; font-weight: bold;');
    console.log('%cIA detectada: %cSim, mas só como copiloto (o cérebro ainda é humano).', 'color: #162650;', 'color: #666; font-style: italic;');
    console.log('%cCSS: %c100% autoral (Zero Tailwind, Zero dor de cabeça de abstração).', 'color: #162650;', 'color: #9448BC;');
    console.log('%cPropósito: %cCompartilhar o que o prompt não resolve sozinho.', 'color: #162650;', 'color: #162650;');
    console.groupEnd();

    console.log(
      '%c/* Curtiu o stack? Inspecione à vontade, só não repara na bagunça (ou repara, faz parte). */',
      'color: #9448BC; font-family: monospace;'
    );
  }, []);

  return null;
}
