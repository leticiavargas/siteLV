# Plano: HandCrafted Dev Run — Mini-jogo no Footer

## Contexto

Easter egg no estilo Dino Run rodando diretamente no Footer. Canvas API, integrado visualmente ao sistema de design (cores CSS custom properties, tipografia monospace). Gatilho: botão `/* Iniciar Build */` ou tecla Espaço.

---

## Arquivos a criar/modificar

| Arquivo | Ação |
|---|---|
| `src/app/components/Footer/GameEaster/index.jsx` | Criar — Client Component com lógica do jogo |
| `src/app/components/Footer/GameEaster/styles.css` | Criar — estilos do wrapper, botão, overlays |
| `src/app/components/Footer/index.jsx` | Modificar — importar `<GameEaster />` entre `footerTop` e `footerBottom` |
| `src/app/components/Footer/styles.css` | Modificar — adicionar `.footerGame` |

---

## Estrutura do componente GameEaster

### Estado
```
gameState: 'idle' | 'playing' | 'gameover'
score: number (React state — para re-render da UI)
```
Tudo interno ao loop (player, obstacles, frames) fica em `useRef` para não causar re-renders.

### Player
```js
{ x: 60, y, width: 28, height: 28, vy: 0, onGround: true }
```
- Desenhado como texto `{}` em monospace, cor `--primary-color` (#9448BC)
- Gravidade: `vy += 0.7` por frame
- Pulo: `vy = -13` quando `onGround`

### Obstacle
```js
{ x, y, width, height, label, bubble }
```
- `bubble`: frase exibida em balão quando `x < canvasWidth * 0.55`
- Tipos:
  ```js
  const OBSTACLE_TYPES = [
    { label: '<div>',    bubble: null },
    { label: 'any',      bubble: null },
    { label: 'Hype',     bubble: null },
    { label: '// TODO',  bubble: null },
    { label: 'Legacy',   bubble: 'Me refatora!' },
    { label: 'npm i',    bubble: '737 vulnerabilities' },
    { label: 'deadline', bubble: 'pra ontem.' },
  ];
  ```
- Retângulo com borda `--primary-color`, texto branco monospace ~11px
- Velocidade inicial: `4px/frame`, cresce `+0.0015/frame`

### Constantes de layout
- Canvas height: `140px`
- `GROUND_Y = 100`
- Player Y inicial: `GROUND_Y - player.height`
- Canvas width: dinâmico via `ResizeObserver` no container

---

## Loop requestAnimationFrame

1. `clearRect` canvas inteiro
2. **Gutter** — faixa vertical 32px à esquerda, `rgba(255,255,255,0.04)`, números de linha em monospace `rgba(255,255,255,0.2)`
3. **Chão** — linha sólida `rgba(255,255,255,0.2)` + linha pontilhada acima `rgba(255,255,255,0.08)`
4. **Trail** — se `!player.onGround`, desenha 3 cópias de `{}` atrás com ctx.save/restore:
   ```js
   [{ offset:-8, alpha:0.15, blur:2 }, { offset:-16, alpha:0.08, blur:4 }, { offset:-24, alpha:0.03, blur:6 }]
   ```
5. **Player** — desenha `{}` na posição atual
6. **Obstáculos** — move x, desenha retângulo + label; se `bubble` e `x < width*0.55`, desenha balão acima
7. **Geração** — novo obstáculo a cada ~90 frames (cai para ~45 com score alto); altura aleatória 24–40px
8. **Colisão AABB** com margem 4px → game over
9. **Score** — `Math.floor(frames / 6)`; desenha no canto direito: `"Lines Processed: X"` + `"// Best: Y"` (opacity menor)
10. **SENIORITY UNLOCKED** — se score >= 2000 e flag `seniority2000Fired.current === false`:
    ```js
    console.log(
      '%c[ SENIORITY UNLOCKED ] %cVocê buildou sem erros por tempo suficiente. Letícia aprova.',
      'color: #9448BC; font-weight: bold;',
      'color: #162650;'
    );
    seniority2000Fired.current = true;
    ```
11. **Game over** — salva high score no localStorage se score > best; muda gameState

---

## Colisão AABB

```js
function collides(p, o) {
  const m = 4;
  return p.x+m < o.x+o.width && p.x+p.width-m > o.x && p.y+m < o.y+o.height && p.y+p.height > o.y;
}
```

---

## High Score

```js
const HS_KEY = 'handcrafted_dev_run_hs';
// Ler no mount: parseInt(localStorage.getItem(HS_KEY) ?? '0', 10)
// Salvar no game over: if (score > best) localStorage.setItem(HS_KEY, score)
```

---

## UI (HTML fora do canvas)

### idle
- Botão `/* Iniciar Build */`
- Hint: `[espaço] ou [↑] para pular`
- Se best > 0: `// Best: X`

### playing
- Apenas canvas

### gameover
- Mensagem aleatória:
  ```js
  ['Stack Overflow.', 'Hydration Mismatch.', 'O prompt falhou. Tente novamente.', 'Bug detectado na camada 8.', 'Cannot read properties of undefined.']
  ```
- Score final + `// Best: X`
- Botão `/* Hot Reload */`

---

## Controles

| Evento | Ação |
|---|---|
| Espaço / ArrowUp | Pula se playing; inicia/reinicia se idle/gameover |
| Click no canvas | Pula se playing |
| Click no botão | Inicia / Reinicia |

Listeners no `document`, removidos no cleanup do `useEffect`.

---

## CSS classes

```
.gameEaster        wrapper relativo
.gameEasterCanvas  block, cursor pointer, width 100%, height 140px
.gameEasterIdle    overlay idle centralizado (flex column, gap)
.gameEasterOverlay overlay gameover (position absolute, inset 0, flex center)
.gameEasterBtn     monospace, border --primary-color, hover fill roxo
.gameEasterHint    monospace, opacity 0.4, font-size 0.75rem
.gameEasterMsg     cor white, font-size 0.9rem, monospace
.gameEasterScore   monospace, opacity 0.5, font-size 0.75rem (score final + best no overlay)
```

---

## Footer — integração

```jsx
// Footer/index.jsx — entre footerTop e footerBottom:
<div className='footerGame'>
  <GameEaster />
</div>
```

```css
/* Footer/styles.css */
.footerGame {
  position: relative;
  z-index: 1;
  margin-top: 2rem;
  border-top: 1px solid color-mix(in srgb, var(--color-white) 8%, transparent);
  padding-top: 1.5rem;
}
```

---

## Acessibilidade

- `<canvas aria-label="HandCrafted Dev Run — easter egg interativo" role="img">`
- Botões com texto descritivo
- `prefers-reduced-motion`: jogo é sob demanda (não auto-inicia)

---

## Verificação

1. `pnpm dev` → rolar até o Footer
2. Ver botão `/* Iniciar Build */`
3. Clicar ou Espaço → jogo inicia, `{}` aparece sobre o chão estilo editor
4. Obstáculos surgem com labels; `Legacy`, `npm i`, `deadline` mostram balão ao se aproximar
5. Pular → rastro de blur atrás do `{}`
6. Score sobe; `// Best:` atualiza no canvas e persiste no localStorage
7. Atingir 2000 → checar console: `[ SENIORITY UNLOCKED ]`
8. Colisão → game over, mensagem aleatória, botão `/* Hot Reload */`
9. Reiniciar → tudo recomeça, high score persiste
10. Mobile: canvas responsivo, toque pula
