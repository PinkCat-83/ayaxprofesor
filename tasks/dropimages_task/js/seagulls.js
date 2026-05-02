/* ═══════════════════════════════════════════════════════════
   DROP IMAGES – seagulls.js
   Gaviotas SVG animadas — muy lejanas, solo dos líneas
   que baten simulando el vuelo.
═══════════════════════════════════════════════════════════ */

// ── CONFIGURACIÓN ─────────────────────────────────────────
const SEAGULL_CONFIG = {
  count:    5,      // número de gaviotas simultáneas
  minY:     8,      // % desde el top (zona de cielo, por encima de las nubes)
  maxY:    30,
  minSpeed: 12,     // segundos para cruzar la pantalla (más rápidas que las nubes)
  maxSpeed: 25,
  minSize:   3,     // tamaño muy pequeño — están lejos
  maxSize:   7,
  flapSpeed: 0.6,   // segundos por ciclo de aleteo
};

// ── ESTADO ───────────────────────────────────────────────
let seagullsLayer = null;
let stageFrame    = null;
let seagulls      = [];

// ── INICIALIZACIÓN ────────────────────────────────────────
export function initSeagulls() {
  seagullsLayer = document.getElementById('seagulls-layer');
  stageFrame    = document.getElementById('stage-frame');
  if (!seagullsLayer || !stageFrame) return;

  for (let i = 0; i < SEAGULL_CONFIG.count; i++) {
    spawnSeagull(true);
  }
}

// ── CREAR GAVIOTA ─────────────────────────────────────────
function spawnSeagull(startInside = false) {
  const W      = stageFrame.offsetWidth  || 900;
  const H      = stageFrame.offsetHeight || 360;
  const size   = rand(SEAGULL_CONFIG.minSize, SEAGULL_CONFIG.maxSize);
  const speed  = rand(SEAGULL_CONFIG.minSpeed, SEAGULL_CONFIG.maxSpeed);
  const goLeft = Math.random() > 0.5;
  const y      = H * rand(SEAGULL_CONFIG.minY, SEAGULL_CONFIG.maxY) / 100;
  const x      = startInside ? rand(-50, W + 50) : (goLeft ? W + 50 : -50);
  const flapMs = SEAGULL_CONFIG.flapSpeed * 1000;

  // SVG contenedor
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.cssText = `
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    overflow: visible;
    z-index: 4;
  `;

  // Ala izquierda y ala derecha — dos líneas simples
  const wingL = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  const wingR = document.createElementNS('http://www.w3.org/2000/svg', 'line');

  [wingL, wingR].forEach(w => {
    w.setAttribute('stroke', '#1a1a1a');
    w.setAttribute('stroke-width', Math.max(0.8, size * 0.18));
    w.setAttribute('stroke-linecap', 'round');
  });

  svg.appendChild(wingL);
  svg.appendChild(wingR);
  seagullsLayer.appendChild(svg);

  const seagull = { svg, wingL, wingR, x, y, size, speed, goLeft, flapMs };
  seagulls.push(seagull);

  animateSeagull(seagull);
}

// ── ALETEO + MOVIMIENTO (unificados en rAF) ───────────────
function animateSeagull(s) {
  const W        = stageFrame?.offsetWidth || 900;
  const duration = s.speed * 1000;
  const xStart   = s.x;
  const xEnd     = s.goLeft ? -60 : W + 60;
  const sizeStart = s.size;
  const sizeEnd   = s.goLeft ? s.size * 0.3 : s.size * 0.3; // se aleja siempre

  let start = null;

  function step(ts) {
    if (!start) start = ts;
    const elapsed  = ts - start;
    const progress = Math.min(elapsed / duration, 1);

    // Posición horizontal
    const currentX = xStart + (xEnd - xStart) * progress;

    // Tamaño — se va haciendo más pequeña conforme avanza
    const currentSize = sizeStart + (sizeEnd - sizeStart) * progress;

    // Aleteo — ciclo sinusoidal
    const flapCycle = Math.sin(elapsed / (s.flapMs / 2) * Math.PI);
    const dy = flapCycle * currentSize * 1.2; // amplitud proporcional al tamaño

    // Ala izquierda
    s.wingL.setAttribute('x1', currentX);
    s.wingL.setAttribute('y1', s.y);
    s.wingL.setAttribute('x2', s.goLeft ? currentX + currentSize * 2 : currentX - currentSize * 2);
    s.wingL.setAttribute('y2', s.y + dy);

    // Ala derecha
    s.wingR.setAttribute('x1', currentX);
    s.wingR.setAttribute('y1', s.y);
    s.wingR.setAttribute('x2', s.goLeft ? currentX - currentSize * 2 : currentX + currentSize * 2);
    s.wingR.setAttribute('y2', s.y + dy);

    // Grosor proporcional al tamaño actual
    const sw = Math.max(0.5, currentSize * 0.18);
    s.wingL.setAttribute('stroke-width', sw);
    s.wingR.setAttribute('stroke-width', sw);

    if (progress < 1) {
      s.rafId = requestAnimationFrame(step);
    } else {
      // Reciclar — aparece desde el borde contrario, tamaño nuevo
      const H   = stageFrame?.offsetHeight || 360;
      s.goLeft  = !s.goLeft;
      s.x       = s.goLeft ? W + 60 : -60;
      s.y       = H * rand(SEAGULL_CONFIG.minY, SEAGULL_CONFIG.maxY) / 100;
      s.size    = rand(SEAGULL_CONFIG.minSize, SEAGULL_CONFIG.maxSize);
      s.speed   = rand(SEAGULL_CONFIG.minSpeed, SEAGULL_CONFIG.maxSpeed);
      animateSeagull(s);
    }
  }
  s.rafId = requestAnimationFrame(step);
}

// ── LIMPIEZA ──────────────────────────────────────────────
export function destroySeagulls() {
  seagulls.forEach(s => {
    cancelAnimationFrame(s.rafId);
    s.svg?.remove();
  });
  seagulls = [];
}

// ── UTILIDADES ────────────────────────────────────────────
function rand(min, max) {
  return min + Math.random() * (max - min);
}
