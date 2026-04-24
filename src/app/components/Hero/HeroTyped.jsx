'use client';

import { useState, useEffect } from 'react';

const topics = [
  'Refinando... o que o prompt não resolve.',
  'Simplificando... o caos do frontend.',
  'Debugando... a vida e o código.',
  'Limpando... o rastro do copiar e colar',
  'Escovando... bits e selecionando cores',
  'Centralizando... divs com CSS puro.',
  'Compartilhando... a vida real do código.',
];

const HeroTyped = () => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = topics[index];

    if (!deleting && text.length < full.length) {
      const t = setTimeout(() => setText(full.slice(0, text.length + 1)), 60);
      return () => clearTimeout(t);
    }

    if (!deleting && text.length === full.length) {
      const t = setTimeout(() => setDeleting(true), 2200);
      return () => clearTimeout(t);
    }

    if (deleting && text.length > 0) {
      const t = setTimeout(() => setText(full.slice(0, text.length - 1)), 35);
      return () => clearTimeout(t);
    }

    if (deleting && text.length === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % topics.length);
    }
  }, [text, deleting, index]);

  const isComplete = !deleting && text === topics[index];

  return (
    <span>
      <span
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {isComplete ? topics[index] : ''}
      </span>
      <span aria-hidden="true">{text}</span>
      <span className='heroTypedCursor' aria-hidden="true" />
    </span>
  );
};

export { HeroTyped };
