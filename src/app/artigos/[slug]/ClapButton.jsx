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

    fetch(`${API_BASE}/articles/${articleId}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(data => { if (typeof data.claps === 'number') setTotalClaps(data.claps); })
      .catch(() => {});
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
            <path d="M7 11.5V6.5a1.5 1.5 0 0 1 3 0v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 7.5V5a1.5 1.5 0 0 1 3 0v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13 6.5V8a1.5 1.5 0 0 1 3 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 11.5V10a1.5 1.5 0 0 1 3 0v3c0 4-2.5 7-6.5 7S6 17 6 13v-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className='clapCount'>{totalClaps}</span>
        {isExhausted && <span className='clapDoneLabel'>obrigada!</span>}
      </div>
    </div>
  );
};

export { ClapButton };
