/* ═══════════════════════════════════════════════════════════
   GATO SALTARÍN – cat.js
═══════════════════════════════════════════════════════════ */
import { CAT_IMAGES } from './constants.js';
import { state, catEl, catMirror, catRot, catImgs } from './state-dom.js';
import { getCamXActual } from './camera.js';

// ── POSICIÓN SVG ──────────────────────────────────────────
export function setCatSVG() {
  const camX = getCamXActual();
  const sx   = state.catWorldX - camX;
  catEl.setAttribute('transform',
    `translate(${sx.toFixed(1)},${state.catWorldY.toFixed(1)})`);
}

// ── ROTACIÓN ──────────────────────────────────────────────
const MAX_ANGLE = 25; // grados

function setCatRotation(deg) {
  // Todos los sprites tienen el mismo tamaño (96×84), el pivote es siempre el mismo
  const cx = CAT_IMAGES.idle.w / 2;  // 48
  const cy = CAT_IMAGES.idle.h / 2;  // 42
  catRot.setAttribute('transform', `rotate(${deg.toFixed(1)},${cx},${cy})`);
}

// ── ANIMACIÓN DE SALTO ────────────────────────────────────
export function animarSalto(destWorldX, destWorldY, onComplete) {
  if (state.jumpCancelar) { state.jumpCancelar(); state.jumpCancelar = null; }

  const startX   = state.catWorldX;
  const startY   = state.catWorldY;
  const arcH     = Math.abs(destWorldX - startX) * 0.35;
  const duracion = 1000;
  let rafId      = null;

  catEl.classList.remove('breathe');
  // show/hide instantáneo: no hay cambio de href, no hay repintado pendiente
  setCatState('sjump');

  function frame(now) {
    if (frame.startTime === null) frame.startTime = now;
    const t = Math.min((now - frame.startTime) / duracion, 1);

    state.catWorldX = startX + (destWorldX - startX) * t;
    state.catWorldY = startY + (destWorldY - startY) * t - Math.sin(t * Math.PI) * Math.min(arcH, 90);

    const angle = -Math.cos(t * Math.PI) * MAX_ANGLE;
    setCatRotation(angle);
    setCatSVG();

    if (t < 1) {
      rafId = requestAnimationFrame(frame);
    } else {
      state.jumpCancelar = null;
      state.catWorldX    = destWorldX;
      state.catWorldY    = destWorldY;
      setCatRotation(0);
      setCatSVG();
      catEl.classList.add('breathe');
      onComplete?.();
    }
  }
  frame.startTime = null;
  rafId = requestAnimationFrame(frame);

  state.jumpCancelar = () => {
    cancelAnimationFrame(rafId);
    setCatRotation(0);
    catEl.classList.add('breathe');
  };
}

// ── ANIMACIÓN CAÍDA AL AGUA ───────────────────────────────
export function animarCaida(onComplete) {
  catEl.classList.remove('breathe');
  setCatState('water');
  setCatRotation(0);
  catEl.classList.add('sinking');
  catMirror.classList.add('sinking-mirror');
  // La animación CSS dura 2.2s (sinkFade / sinkAndMirror)
  setTimeout(() => {
    catEl.classList.remove('sinking');
    catMirror.classList.remove('sinking-mirror');
    onComplete?.();
  }, 2200);
}

// ── ESTADO E IMAGEN ───────────────────────────────────────
export function setCatState(key) {
  state.catImgKey = key;
  // Ocultar todos los sprites y mostrar solo el activo
  for (const [k, el] of Object.entries(catImgs)) {
    el.style.display = k === key ? '' : 'none';
  }
  setCatSVG();
}
