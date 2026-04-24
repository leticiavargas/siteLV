'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const MAX_CLAPS = 10;
const STORAGE_KEY = (id) => `claps_${id}`;
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const ClapButton = ({ articleId, initialClaps = 0 }) => {
  const [totalClaps, setTotalClaps] = useState(initialClaps);
  const [myClaps, setMyClaps] = useState(0);
  const [burst, setBurst] = useState(false);
  const [floatCount, setFloatCount] = useState(null);

  const pendingRef = useRef(0);
  const timerRef = useRef(null);
  const floatTimerRef = useRef(null);

  useEffect(() => {
    const saved = parseInt(localStorage.getItem(STORAGE_KEY(articleId)) ?? '0', 10);
    setMyClaps(saved);
  }, [articleId]);

  const flush = useCallback(async () => {
    const amount = pendingRef.current;
    if (amount <= 0) return;
    pendingRef.current = 0;
    try {
      const res = await fetch(`${API_BASE}/articles/${articleId}/clap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claps: amount }),
      });
      if (res.ok) {
        const data = await res.json();
        setTotalClaps(data.claps);
      }
    } catch {
      // silently fail — count já foi atualizado localmente
    }
  }, [articleId]);

  function handleClap() {
    const saved = parseInt(localStorage.getItem(STORAGE_KEY(articleId)) ?? '0', 10);
    if (saved >= MAX_CLAPS) return;

    const newMyClaps = saved + 1;
    localStorage.setItem(STORAGE_KEY(articleId), String(newMyClaps));
    setMyClaps(newMyClaps);
    setTotalClaps(prev => prev + 1);
    pendingRef.current += 1;

    // animação burst
    setBurst(true);
    setTimeout(() => setBurst(false), 300);

    // float count
    setFloatCount(prev => (prev ?? 0) + 1);
    clearTimeout(floatTimerRef.current);
    floatTimerRef.current = setTimeout(() => setFloatCount(null), 1200);

    // debounce flush
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(flush, 1000);
  }

  const remaining = MAX_CLAPS - myClaps;
  const isExhausted = remaining <= 0;

  return (
    <div className='clapWrapper'>
      <div className='clapContainer'>
        <button
          className={`clapBtn${burst ? ' clapBtn--burst' : ''}${isExhausted ? ' clapBtn--done' : ''}`}
          onClick={handleClap}
          disabled={isExhausted}
          aria-label={isExhausted ? 'Você já deu todos os claps' : `Dar clap (${remaining} restantes)`}
        >
          {floatCount !== null && (
            <span className='clapFloat' aria-hidden="true">+{floatCount}</span>
          )}
          <svg className='clapIcon' viewBox="0 0 24 24" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M8.5 4.5L9.5 2M11.5 4L13 1.5M14.5 4.5L17 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M9.5 7.5C9.5 6.7 10.05 6 10.85 5.85C11.65 5.7 12.4 6.15 12.65 6.9L13 8M9.5 7.5L7 14.5C7 14.5 6.5 16.5 8.5 18C10.5 19.5 14 19.5 16 17.5C17 16.5 17 14.5 16.5 13L14 7.5C13.75 6.75 13 6.3 12.2 6.45C11.4 6.6 11 7.35 11 8.1V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.5 7.5L9 9M11 8.5V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M13 8L14.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        <span className='clapCount'>{totalClaps}</span>
        {isExhausted && <span className='clapDoneLabel'>obrigada!</span>}
      </div>
    </div>
  );
};

export { ClapButton };
