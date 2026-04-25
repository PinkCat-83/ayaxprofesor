/* ═══════════════════════════════════════════════════════════
   GATO SALTARÍN – cat.js
═══════════════════════════════════════════════════════════ */
import { CAT_IMAGES } from './constants.js';
import { state, catEl, catMirror, catImg } from './state-dom.js';
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
  const img = CAT_IMAGES[state.catImgKey];
  const cx  = img.w / 2;
  const cy  = img.h / 2;
  catImg.setAttribute('transform', `rotate(${deg.toFixed(1)},${cx},${cy})`);
}

// ── ANIMACIÓN DE SALTO ────────────────────────────────────
export function animarSalto(destWorldX, destWorldY, onComplete) {
  if (state.jumpCancelar) { state.jumpCancelar(); state.jumpCancelar = null; }

  const startX  = state.catWorldX;
  const startY  = state.catWorldY;
  const arcH    = Math.abs(destWorldX - startX) * 0.35;
  const duracion = 1000; // x5 temporal para depuración
  let rafId     = null;
  let startTime = null;

  setCatState('sjump');

  // Double-RAF: dejamos un frame para que el navegador pinte el sprite
  // sjump antes de arrancar el loop de animación.
  let outerRafId = null;

  function frame(now) {
    if (startTime === null) startTime = now;
    const t = Math.min((now - startTime) / duracion, 1);

    // Posición en arco: X lineal, Y interpola hacia destino + bóveda
    state.catWorldX = startX + (destWorldX - startX) * t;
    state.catWorldY = startY + (destWorldY - startY) * t - Math.sin(t * Math.PI) * Math.min(arcH, 90);

    // Rotación gradual: cos(t·π) va de +1 (subiendo) a -1 (bajando)
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
      onComplete?.();
    }
  }

  outerRafId = requestAnimationFrame(() => {
    rafId = requestAnimationFrame(frame);
  });

  state.jumpCancelar = () => {
    cancelAnimationFrame(outerRafId);
    cancelAnimationFrame(rafId);
    setCatRotation(0);
  };
}

// ── ANIMACIÓN CAÍDA AL AGUA ───────────────────────────────
export function animarCaida(onComplete) {
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
  const img = CAT_IMAGES[key];
  catImg.setAttribute('href',   img.src);
  catImg.setAttribute('width',  img.w);
  catImg.setAttribute('height', img.h);
  catImg.setAttribute('x', 0);
  catImg.setAttribute('y', 0);
  setCatSVG();
}
