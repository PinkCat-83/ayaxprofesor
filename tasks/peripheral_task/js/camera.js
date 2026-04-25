/* ═══════════════════════════════════════════════════════════
   GATO SALTARÍN – camera.js
   Cámara, paralaje de fondo y layout del mundo.
═══════════════════════════════════════════════════════════ */
import { ROUND_WIDTH, ROCK_CX_LOCAL, ROCK_CY } from './constants.js';
import { state, $, worldGroup, rockGroups } from './state-dom.js';

// ── FONDO ─────────────────────────────────────────────────
const bgImage = document.querySelector('#stage-svg image[href^="img/background"]');

const BG_ZOOM       = 1.1;
const BG_NATIVE_W   = 1600;
const BG_NATIVE_H   = 669;
const SVG_W         = 800;
const SVG_H         = 320;

const BG_RENDER_H   = SVG_H * BG_ZOOM;
const BG_RENDER_W   = BG_NATIVE_W * (BG_RENDER_H / BG_NATIVE_H);
const BG_Y          = -((BG_RENDER_H - SVG_H) / 2);
const BG_MAX_TRAVEL = (BG_RENDER_W - SVG_W) * 0.6;

let bgStepX = 0;

export function initParalaje() {
  bgStepX = BG_MAX_TRAVEL / state.perifericos.length;
  if (bgImage) {
    bgImage.setAttribute('width',  BG_RENDER_W.toFixed(1));
    bgImage.setAttribute('height', BG_RENDER_H.toFixed(1));
    bgImage.setAttribute('y',      BG_Y.toFixed(1));
    bgImage.setAttribute('x',      bgXForRonda(0).toFixed(1));
  }
}

export function bgXForRonda(ronda) {
  const centerX = -((BG_RENDER_W - SVG_W) / 2);
  const startX  = centerX + BG_MAX_TRAVEL / 2;
  return startX - ronda * bgStepX;
}

// ── CÁMARA ────────────────────────────────────────────────
export function aplicarCamara(camX) {
  worldGroup.setAttribute('transform', `translate(${-camX},0)`);
}

export function getCamXActual() {
  const t = worldGroup.getAttribute('transform') || 'translate(0,0)';
  const m = t.match(/translate\(([^,]+)/);
  return m ? -parseFloat(m[1]) : 0;
}

export function camXParaRonda() {
  return state.worldOffset;
}

export function animarCamara(startCamX, targetCamX, catEl, onComplete) {
  const duracion  = 600;
  const pasos     = 40;
  const intervalo = duracion / pasos;
  let paso = 0;

  const bgXStart  = bgXForRonda(state.rondaEnCurso - 1);
  const bgXTarget = bgXForRonda(state.rondaEnCurso);

  const timer = setInterval(() => {
    paso++;
    const t    = easeInOut(paso / pasos);
    const camX = startCamX + (targetCamX - startCamX) * t;
    aplicarCamara(camX);

    if (bgImage) bgImage.setAttribute('x', (bgXStart + (bgXTarget - bgXStart) * t).toFixed(1));

    const sx = state.catWorldX - camX;
    catEl.setAttribute('transform',
      `translate(${sx.toFixed(1)},${state.catWorldY.toFixed(1)})`);

    if (paso >= pasos) {
      clearInterval(timer);
      aplicarCamara(targetCamX);
      if (onComplete) onComplete();
    }
  }, intervalo);
}

// ── LAYOUT DEL MUNDO ──────────────────────────────────────
export function resetWorldLayout() {
  const off         = state.worldOffset;
  const totalRondas = state.perifericos.length - 1;
  const esPrimera   = state.rondaEnCurso === 0;
  const esUltima    = state.rondaEnCurso === totalRondas;

  const imgLeft  = esPrimera ? 'img/platform_ground.png' : 'img/platform.png';
  const imgRight = esUltima  ? 'img/platform_ground.png' : 'img/platform.png';

  $('plat-left').setAttribute('transform', `translate(${off},0)`);
  $('plat-left').querySelector('image').setAttribute('href', imgLeft);

  $('plat-right').setAttribute('transform', `translate(${off + ROUND_WIDTH},0)`);
  $('plat-right').querySelector('image').setAttribute('href', imgRight);

  rockGroups.forEach((g, i) => {
    g.setAttribute('transform', `translate(${off + ROCK_CX_LOCAL[i]},${ROCK_CY})`);
    g.classList.remove('correct', 'incorrect');
    g.style.visibility = '';
  });
}

// ── UTILIDAD ──────────────────────────────────────────────
function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
