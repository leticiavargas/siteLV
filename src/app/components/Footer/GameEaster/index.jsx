'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import './styles.css';

const HS_KEY = 'handcrafted_dev_run_hs';

const OBSTACLE_TYPES = [
  { label: '<div>',    bubble: null },
  { label: 'any',      bubble: null },
  { label: 'Hype',     bubble: null },
  { label: '// TODO',  bubble: null },
  { label: 'Legacy',   bubble: 'Me refatora!' },
  { label: 'npm i',    bubble: '737 vulnerabilities' },
  { label: 'deadline', bubble: 'pra ontem.' },
];

const GAMEOVER_MSGS = [
  'Stack Overflow.',
  'Hydration Mismatch.',
  'O prompt falhou. Tente novamente.',
  'Bug detectado na camada 8.',
  'Cannot read properties of undefined.',
];

const CANVAS_H = 200;
const GROUND_Y = 150;

const GameEaster = () => {
  const [gameState, setGameState] = useState('idle');
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameoverMsg, setGameoverMsg] = useState('');

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const gameStateRef = useRef('idle');

  // All mutable game state in refs to avoid re-renders
  const playerRef = useRef(null);
  const obstaclesRef = useRef([]);
  const framesRef = useRef(0);
  const speedRef = useRef(4);
  const nextObstacleRef = useRef(90);
  const scoreRef = useRef(0);
  const bestRef = useRef(0);
  const seniority2000Fired = useRef(false);

  const initPlayer = useCallback((canvasWidth) => {
    const h = 28;
    playerRef.current = {
      x: 140,
      y: GROUND_Y - h,
      width: 28,
      height: h,
      vy: 0,
      onGround: true,
    };
  }, []);

  const resetGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    obstaclesRef.current = [];
    framesRef.current = 0;
    speedRef.current = 4;
    nextObstacleRef.current = 90;
    scoreRef.current = 0;
    seniority2000Fired.current = false;
    initPlayer(canvas.width);
    setScore(0);
  }, [initPlayer]);

  const startGame = useCallback(() => {
    resetGame();
    gameStateRef.current = 'playing';
    setGameState('playing');
  }, [resetGame]);

  const collides = (p, o) => {
    const m = 4;
    return (
      p.x + m < o.x + o.width &&
      p.x + p.width - m > o.x &&
      p.y + m < o.y + o.height &&
      p.y + p.height > o.y
    );
  };

  const endGame = useCallback(() => {
    const finalScore = scoreRef.current;
    const currentBest = bestRef.current;
    if (finalScore > currentBest) {
      bestRef.current = finalScore;
      setBest(finalScore);
      try { localStorage.setItem(HS_KEY, String(finalScore)); } catch {}
    }
    gameStateRef.current = 'gameover';
    setScore(finalScore);
    setGameoverMsg(GAMEOVER_MSGS[Math.floor(Math.random() * GAMEOVER_MSGS.length)]);
    setGameState('gameover');
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  // Game loop
  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const player = playerRef.current;

    ctx.clearRect(0, 0, W, CANVAS_H);

    // Gutter
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    ctx.fillRect(0, 0, 32, CANVAS_H);
    ctx.font = '10px monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    const lineCount = Math.floor(CANVAS_H / 14);
    for (let i = 0; i < lineCount; i++) {
      ctx.fillText(String(i + 1), 6, 12 + i * 14);
    }

    // Ground
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(W, GROUND_Y);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y - 2);
    ctx.lineTo(W, GROUND_Y - 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Physics
    player.vy += 0.7;
    player.y += player.vy;
    if (player.y >= GROUND_Y - player.height) {
      player.y = GROUND_Y - player.height;
      player.vy = 0;
      player.onGround = true;
    } else {
      player.onGround = false;
    }

    // Trail
    if (!player.onGround) {
      const trail = [
        { offset: -8,  alpha: 0.15, blur: 2 },
        { offset: -16, alpha: 0.08, blur: 4 },
        { offset: -24, alpha: 0.03, blur: 6 },
      ];
      trail.forEach(({ offset, alpha, blur }) => {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.filter = `blur(${blur}px)`;
        ctx.font = 'bold 18px monospace';
        ctx.fillStyle = '#9448BC';
        ctx.fillText('{}', player.x + offset, player.y + player.height - 4);
        ctx.restore();
      });
    }

    // Player
    ctx.font = 'bold 18px monospace';
    ctx.fillStyle = '#9448BC';
    ctx.fillText('{}', player.x, player.y + player.height - 4);

    // Obstacles
    const speed = speedRef.current;
    speedRef.current += 0.0015;

    obstaclesRef.current.forEach((o) => {
      o.x -= speed;

      // Draw rect
      ctx.strokeStyle = '#9448BC';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(o.x, o.y, o.width, o.height);
      ctx.fillStyle = 'rgba(148,72,188,0.15)';
      ctx.fillRect(o.x, o.y, o.width, o.height);

      // Label
      ctx.font = '11px monospace';
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.fillText(o.label, o.x + 4, o.y + o.height / 2 + 4);

      // Bubble
      if (o.bubble && o.x < W * 0.55) {
        const bx = o.x + o.width / 2;
        const by = o.y - 8;
        const bubbleW = o.bubble.length * 6.5 + 12;
        const bubbleH = 20;
        const bubbleX = bx - bubbleW / 2;
        const bubbleY = by - bubbleH;

        ctx.fillStyle = 'rgba(22,38,80,0.85)';
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 4);
        ctx.fill();
        ctx.stroke();

        // Tail
        ctx.beginPath();
        ctx.moveTo(bx - 4, by);
        ctx.lineTo(bx, by + 6);
        ctx.lineTo(bx + 4, by);
        ctx.fillStyle = 'rgba(22,38,80,0.85)';
        ctx.fill();

        ctx.font = '10px monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fillText(o.bubble, bubbleX + 6, bubbleY + 13);
      }
    });

    // Spawn obstacles
    framesRef.current += 1;
    const frames = framesRef.current;
    const currentScore = Math.floor(frames / 6);
    const interval = currentScore > 500 ? 45 : 90;

    if (frames >= nextObstacleRef.current) {
      const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
      const h = 24 + Math.floor(Math.random() * 17); // 24–40
      const labelW = type.label.length * 7 + 12;
      obstaclesRef.current.push({
        x: W + 10,
        y: GROUND_Y - h,
        width: Math.max(labelW, 44),
        height: h,
        label: type.label,
        bubble: type.bubble,
      });
      nextObstacleRef.current = frames + interval + Math.floor(Math.random() * 30);
    }

    // Remove off-screen obstacles
    obstaclesRef.current = obstaclesRef.current.filter((o) => o.x + o.width > 0);

    // Collision
    for (const o of obstaclesRef.current) {
      if (collides(player, o)) {
        endGame();
        return;
      }
    }

    // Score
    scoreRef.current = currentScore;
    if (currentScore % 10 === 0) setScore(currentScore);

    // SENIORITY UNLOCKED
    if (currentScore >= 2000 && !seniority2000Fired.current) {
      console.log(
        '%c[ SENIORITY UNLOCKED ] %cVocê buildou sem erros por tempo suficiente. Letícia aprova.',
        'color: #9448BC; font-weight: bold;',
        'color: #162650;'
      );
      seniority2000Fired.current = true;
    }

    // HUD
    const displayBest = bestRef.current;
    ctx.font = '11px monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText(`Lines Processed: ${currentScore}`, W - 170, 18);
    if (displayBest > 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillText(`// Best: ${displayBest}`, W - 170, 32);
    }

    rafRef.current = requestAnimationFrame(loop);
  }, [endGame]);

  // Start RAF when playing
  useEffect(() => {
    if (gameState === 'playing') {
      rafRef.current = requestAnimationFrame(loop);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [gameState, loop]);

  // ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        canvas.width = entry.contentRect.width;
      }
    });
    ro.observe(container);
    canvas.width = container.offsetWidth;

    return () => ro.disconnect();
  }, []);

  // Load best from localStorage
  useEffect(() => {
    try {
      const saved = parseInt(localStorage.getItem(HS_KEY) ?? '0', 10);
      if (!isNaN(saved) && saved > 0) {
        bestRef.current = saved;
        setBest(saved);
      }
    } catch {}
  }, []);

  const togglePause = useCallback(() => {
    if (gameStateRef.current === 'playing') {
      gameStateRef.current = 'paused';
      setGameState('paused');
    } else if (gameStateRef.current === 'paused') {
      gameStateRef.current = 'playing';
      setGameState('playing');
    }
  }, []);

  // Keyboard controls
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Escape' || e.code === 'KeyP') {
        const state = gameStateRef.current;
        if (state === 'playing' || state === 'paused') {
          e.preventDefault();
          togglePause();
        }
        return;
      }
      if (e.code !== 'Space' && e.code !== 'ArrowUp') return;
      e.preventDefault();

      const state = gameStateRef.current;
      if (state === 'playing') {
        const player = playerRef.current;
        if (player && player.onGround) player.vy = -13;
      } else if (state === 'idle' || state === 'gameover') {
        startGame();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [startGame, togglePause]);

  const handleCanvasClick = () => {
    if (gameStateRef.current === 'playing') {
      const player = playerRef.current;
      if (player && player.onGround) player.vy = -13;
    }
  };

  return (
    <div className='gameEaster' ref={containerRef}>
      <canvas
        ref={canvasRef}
        height={CANVAS_H}
        className='gameEasterCanvas'
        onClick={handleCanvasClick}
        aria-label="HandCrafted Dev Run — easter egg interativo"
        role="img"
      />

      {gameState === 'idle' && (
        <div className='gameEasterIdle'>
          {best > 0 && <span className='gameEasterHint'>// Best: {best}</span>}
          <button className='gameEasterBtn' onClick={startGame}>
            /* Iniciar Build */
          </button>
          <span className='gameEasterHint'>[espaço] ou [↑] para pular</span>
        </div>
      )}

      {gameState === 'paused' && (
        <div className='gameEasterOverlay'>
          <p className='gameEasterMsg'>/* Pausado */</p>
          <p className='gameEasterScore'>Lines Processed: {score}</p>
          <button className='gameEasterBtn' onClick={togglePause}>
            /* Resumir */
          </button>
          <span className='gameEasterHint'>[Esc] ou [P] para pausar/resumir</span>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className='gameEasterOverlay'>
          <p className='gameEasterMsg'>{gameoverMsg}</p>
          <p className='gameEasterScore'>
            Lines Processed: {score}
            {best > 0 && <> &nbsp;·&nbsp; // Best: {best}</>}
          </p>
          <button className='gameEasterBtn' onClick={startGame}>
            /* Hot Reload */
          </button>
        </div>
      )}
    </div>
  );
};

export { GameEaster };
