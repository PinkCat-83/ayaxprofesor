/* ═══════════════════════════════════════════════════════════
   GATO SALTARÍN – engine.js
   Lógica del juego: pantallas, animaciones, preguntas y flujo.
═══════════════════════════════════════════════════════════ */
import {
  PLATFORM_Y, ROUND_WIDTH, ROCK_CX_LOCAL, ROCK_CY,
  CAT_IMAGES, CAT_Y_STAND, CAT_Y_ROCK, CAT_START_LOCAL, CAT_GOAL_LOCAL,
} from './constants.js';

import {
  state, $, screens,
  hudLives, hudProgress, peripheralLbl, feedbackMsg,
  catEl, catMirror, catImg, worldGroup, fireworksLayer,
  rockGroups, rockLabels,
  playSound, stopSound,
} from './state-dom.js';

// ── FONDO ANIMADO (webp animado) ─────────────────────────
const bgImage = document.querySelector('#stage-svg image[href^="img/background"]');

function startBgLoop() {}  // el webp se anima solo
function stopBgLoop()  {}  // nada que parar


export function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

// ── CARGA DE DATOS ────────────────────────────────────────
export async function cargarPerifericos() {
  try {
    const r = await fetch('json/perifericos.json');
    if (!r.ok) throw new Error('HTTP ' + r.status);
    state.perifericos = await r.json();
  } catch(e) {
    document.body.innerHTML = `
      <div style="
        display:flex; flex-direction:column; align-items:center; justify-content:center;
        height:100vh; font-family:'Nunito',sans-serif; background:#fce7f3; gap:1rem;
        text-align:center; padding:2rem;">
        <div style="font-size:3rem">😿</div>
        <h2 style="font-size:1.6rem; color:#be185d; margin:0">No se pudo cargar el juego</h2>
        <p style="color:#4c1d95; font-weight:600; max-width:360px; margin:0">
          No se encontró el archivo <code>perifericos.json</code>.<br>
          Asegúrate de que existe en la misma carpeta que este HTML.
        </p>
        <p style="color:#78716c; font-size:0.85rem; margin:0">Error: ${e.message}</p>
        <button onclick="location.reload()" style="
          margin-top:0.5rem; padding:0.6rem 1.8rem; border:none; border-radius:50px;
          background:#be185d; color:white; font-family:'Nunito',sans-serif;
          font-weight:800; font-size:1rem; cursor:pointer;">
          Reintentar
        </button>
      </div>`;
  }
}

// ── INICIO DEL JUEGO ──────────────────────────────────────
export function iniciarJuego(nivel) {
  stopFireworks();
  stopSound('fanfare');
  state.nivel        = nivel;
  state.vidasMax     = nivel === 1 ? 1 : 3;
  state.vidas        = state.vidasMax;
  state.indexActual  = 0;
  state.bloqueado    = false;
  state.rondaEnCurso = 0;
  state.worldOffset  = 0;
  state.catWorldX    = CAT_START_LOCAL;
  state.catWorldY    = CAT_Y_STAND;

  state.orden = mezclar([...Array(state.perifericos.length).keys()]);

  resetWorldLayout();
  aplicarCamara(0);
  initParalaje();
  startBgLoop();
  setCatState('idle');
  mostrarPregunta();
  actualizarHUD();
  showScreen('game');
}

// ── IMAGEN Y ANIMACIÓN DEL GATO ───────────────────────────
export function setCatState(key, delay) {
  if (delay) {
    setTimeout(() => setCatState(key), delay);
    return;
  }
  state.catImgKey = key;
  const img = CAT_IMAGES[key];
  catImg.setAttribute('href', img.src);
  catImg.setAttribute('width',  img.w);
  catImg.setAttribute('height', img.h);
  catImg.setAttribute('x', 0);
  catImg.setAttribute('y', 0);
  if (key === 'fanfare') {
    state.catWorldY = PLATFORM_Y - img.h +5;
  }
  applyCatAnimClasses();
  setCatSVG();
}

function applyCatAnimClasses() {
  const key = state.catImgKey;
  catEl.classList.remove('breathe', 'mirror', 'sinking');
  catMirror.classList.remove('sinking-mirror');
  void catEl.offsetHeight;
  if (!state.animEnabled) return;
  if (key === 'idle') catEl.classList.add('breathe');
  if (key === 'fanfare') { catEl.classList.add('breathe'); }
  if (key === 'water') {
    catEl.classList.add('sinking');
    catMirror.classList.add('sinking-mirror');
  }
}

// ── LAYOUT DEL MUNDO ──────────────────────────────────────
function resetWorldLayout() {
  const off        = state.worldOffset;
  const totalRondas = state.perifericos.length - 1; // última ronda = último periférico
  const esPrimera  = state.rondaEnCurso === 0;
  const esUltima   = state.rondaEnCurso === totalRondas;

  const imgLeft  = esPrimera ? 'img/platform_ground.png' : 'img/platform.png';
  const imgRight = esUltima  ? 'img/platform_ground.png' : 'img/platform.png';

  $('plat-left').setAttribute('transform',  `translate(${off},0)`);
  $('plat-left').querySelector('image').setAttribute('href', imgLeft);

  $('plat-right').setAttribute('transform', `translate(${off + ROUND_WIDTH},0)`);
  $('plat-right').querySelector('image').setAttribute('href', imgRight);

  rockGroups.forEach((g, i) => {
    g.setAttribute('transform',
      `translate(${off + ROCK_CX_LOCAL[i]},${ROCK_CY})`);
    g.classList.remove('correct', 'incorrect');
    g.style.visibility = '';
  });
}

// ── CÁMARA Y PARALAJE ────────────────────────────────────
// Imagen original: 1600×669. Escenario SVG: 800×320.
// Con BG_ZOOM=1.1 la imagen se renderiza a ~1760px de ancho,
// dejando ~960px de margen para mover sin ver el corte.
const BG_ZOOM        = 1.1;
const BG_NATIVE_W    = 1600;
const BG_NATIVE_H    = 669;
const SVG_W          = 800;
const SVG_H          = 320;

// Dimensiones renderizadas manteniendo proporción y cubriendo alto del SVG
const BG_RENDER_H    = SVG_H * BG_ZOOM;
const BG_RENDER_W    = BG_NATIVE_W * (BG_RENDER_H / BG_NATIVE_H);
const BG_Y           = -((BG_RENDER_H - SVG_H) / 2);

// Margen horizontal disponible para mover sin ver el corte
// Empieza centrada (x = -(BG_RENDER_W - SVG_W)/2) y puede ir hasta 0 o hasta -(BG_RENDER_W - SVG_W)
const BG_MAX_TRAVEL  = (BG_RENDER_W - SVG_W) * 0.6; // usa el 60% del margen disponible

let bgTotalPreguntas = 1;
let bgStepX          = 0;

function initParalaje() {
  bgTotalPreguntas = state.perifericos.length;
  bgStepX = BG_MAX_TRAVEL / bgTotalPreguntas;

  if (bgImage) {
    bgImage.setAttribute('width',  BG_RENDER_W.toFixed(1));
    bgImage.setAttribute('height', BG_RENDER_H.toFixed(1));
    bgImage.setAttribute('y',      BG_Y.toFixed(1));
    bgImage.setAttribute('x',      bgXForRonda(0).toFixed(1));
  }
}

function bgXForRonda(ronda) {
  // ronda 0 → imagen desplazada hacia la derecha (inicio)
  // ronda N → se va moviendo a la izquierda suavemente
  const centerX = -((BG_RENDER_W - SVG_W) / 2);
  const startX  = centerX + BG_MAX_TRAVEL / 2;
  return startX - ronda * bgStepX;
}

function aplicarCamara(camX) {
  worldGroup.setAttribute('transform', `translate(${-camX},0)`);
}

function aplicarParalajeFondo(ronda) {
  if (bgImage) bgImage.setAttribute('x', bgXForRonda(ronda).toFixed(1));
}

function getCamXActual() {
  const t = worldGroup.getAttribute('transform') || 'translate(0,0)';
  const m = t.match(/translate\(([^,]+)/);
  return m ? -parseFloat(m[1]) : 0;
}

function camXParaRonda() {
  return state.worldOffset;
}

// ── POSICIÓN GATO SVG ─────────────────────────────────────
function setCatSVG() {
  const camX = getCamXActual();
  const sx = state.catWorldX - camX;
  catEl.setAttribute('transform',
    `translate(${sx.toFixed(1)},${state.catWorldY.toFixed(1)})`);
}

// ── HUD ───────────────────────────────────────────────────
function actualizarHUD() {
  hudLives.innerHTML = '';
  for (let i = 0; i < state.vidasMax; i++) {
    const s = document.createElement('span');
    s.textContent = i < state.vidas ? '🐱' : '💀';
    hudLives.appendChild(s);
  }
  hudProgress.textContent =
    `Periférico ${state.indexActual + 1} / ${state.perifericos.length}`;
}

// ── MOSTRAR PREGUNTA ──────────────────────────────────────
function mostrarPregunta() {
  state.bloqueado = false;
  const p = state.perifericos[state.orden[state.indexActual]];

  peripheralLbl.style.animation = 'none';
  peripheralLbl.offsetHeight;
  peripheralLbl.style.animation = '';
  peripheralLbl.textContent = p.nombre;

  const opciones = mezclar(['Entrada', 'Salida', 'Ambas']);

  rockGroups.forEach((g, i) => {
    g.classList.remove('correct', 'incorrect');
    g.style.visibility = '';
    rockLabels[i].textContent = opciones[i];
  });

  state.respuestaCorrecta = p.respuesta;
  state.opcionesActuales  = opciones;
}

// ── CLICK EN ROCA ─────────────────────────────────────────
export function manejarClick(indiceRoca) {
  if (state.bloqueado) return;
  state.bloqueado = true;

  const elegida = state.opcionesActuales[indiceRoca];
  const correcta = elegida === state.respuestaCorrecta;
  const indiceCorrectoRoca = state.opcionesActuales.indexOf(state.respuestaCorrecta);

  if (correcta) {
    rockGroups[indiceRoca].classList.add('correct');
    mostrarFeedback('✓ ¡Correcto!', true);
    playSound('jump');

    const rocaWorldX = state.worldOffset + ROCK_CX_LOCAL[indiceCorrectoRoca];
    const goalWorldX = state.worldOffset + ROUND_WIDTH + CAT_GOAL_LOCAL;
    const rocaLandX  = rocaWorldX - Math.round(CAT_IMAGES.fjump.w / 2);

    setCatState('sjump');
    animarSalto(rocaLandX, CAT_Y_ROCK, () => {
      setTimeout(() => {
        playSound('jump');
        animarSalto(goalWorldX, CAT_Y_STAND, () => {
          setTimeout(() => {
            setCatState('idle');
            ocultarFeedback();
            state.indexActual++;
            if (state.indexActual >= state.perifericos.length) {
              setTimeout(() => victoria(), 400);
            } else {
              setTimeout(() => scrollAndNextRound(), 300);
            }
          }, 300);
        });
      }, 350);
    });

  } else {
    rockGroups[indiceRoca].classList.add('incorrect');
    rockGroups[indiceCorrectoRoca].classList.add('correct');
    mostrarFeedback('✗ ¡Al agua!', false);
    playSound('splash');

    const rocaEquivocadaWorldX = state.worldOffset + ROCK_CX_LOCAL[indiceRoca];
    const rocaLandX = rocaEquivocadaWorldX - Math.round(CAT_IMAGES.fjump.w / 2);

    setCatState('sjump');
    animarSalto(rocaLandX, CAT_Y_ROCK, () => {
      setTimeout(() => {
        rockGroups[indiceRoca].style.visibility = 'hidden';
        setCatState('water');
        setTimeout(() => {
          ocultarFeedback();
          state.vidas--;
          actualizarHUD();
          if (state.vidas <= 0) {
            playSound('gameover');
            setTimeout(() => gameOver(), 800);
          } else {
            setTimeout(() => {
              state.catWorldX = state.worldOffset + CAT_START_LOCAL;
              state.catWorldY = CAT_Y_STAND;
              aplicarCamara(camXParaRonda());
              setCatState('idle');
              mostrarPregunta();
            }, 1200);
          }
        }, 1800);
      }, 250);
    });
  }
}

// ── SCROLL Y NUEVA RONDA ──────────────────────────────────
function scrollAndNextRound() {
  state.rondaEnCurso++;
  state.worldOffset = state.rondaEnCurso * ROUND_WIDTH;

  state.catWorldX = state.worldOffset + CAT_START_LOCAL;
  state.catWorldY = CAT_Y_STAND;

  const camXActual  = getCamXActual();
  const camXDestino = camXParaRonda();

  animarCamara(camXActual, camXDestino, () => {
    resetWorldLayout();
    setCatState('idle');
    actualizarHUD();
    mostrarPregunta();
  });
}

// ── ANIMACIÓN DE CÁMARA ───────────────────────────────────
function animarCamara(startCamX, targetCamX, onComplete) {
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

// ── ANIMACIÓN DE SALTO ────────────────────────────────────
function animarSalto(destWorldX, destWorldY, onComplete) {
  const duracion  = 480;
  const pasos     = 28;
  const intervalo = duracion / pasos;
  const startX    = state.catWorldX;
  const startY    = state.catWorldY;
  let paso = 0;

  setCatState('sjump');
  const timer = setInterval(() => {
    paso++;
    const t = paso / pasos;

    if (t < 0.5) setCatState('sjump');
    else          setCatState('fjump');

    state.catWorldX = startX + (destWorldX - startX) * t;
    const arcH = Math.abs(destWorldX - startX) * 0.35;
    state.catWorldY = startY - Math.sin(t * Math.PI) * Math.min(arcH, 90);
    setCatSVG();

    if (paso >= pasos) {
      clearInterval(timer);
      state.catWorldX = destWorldX;
      state.catWorldY = destWorldY;
      setCatSVG();
      if (onComplete) onComplete();
    }
  }, intervalo);
}

// ── ANIMACIÓN CAÍDA AL AGUA ───────────────────────────────
export function animarCaida(onComplete) {
  const duracion  = 350;
  const pasos     = 20;
  const intervalo = duracion / pasos;
  const startX    = state.catWorldX;
  const startY    = state.catWorldY;
  const targetY   = ROCK_CY - CAT_IMAGES.water.h + 10;
  let paso = 0;

  const timer = setInterval(() => {
    paso++;
    const t    = paso / pasos;
    const ease = t * t;
    state.catWorldX = startX + ease * 8;
    state.catWorldY = startY + ease * (targetY - startY);
    setCatSVG();
    if (paso >= pasos) {
      clearInterval(timer);
      if (onComplete) onComplete();
    }
  }, intervalo);
}

// ── FUEGOS ARTIFICIALES ───────────────────────────────────
let fireworkInterval = null;

export function startFireworks() {
  if (!state.animEnabled) return;
  spawnFirework();
  fireworkInterval = setInterval(spawnFirework, 800);
}

export function stopFireworks() {
  if (fireworkInterval) { clearInterval(fireworkInterval); fireworkInterval = null; }
  stopBgLoop();
  fireworksLayer.innerHTML = '';
}

function spawnFirework() {
  const cx = 80 + Math.random() * 640;
  const cy = 30 + Math.random() * 120;
  const colors = ['#fcd34d','#f9a8d4','#86efac','#93c5fd','#fb7185','#c4b5fd'];
  const color  = colors[Math.floor(Math.random() * colors.length)];
  const count  = 12 + Math.floor(Math.random() * 8);

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const dist  = 20 + Math.random() * 30;
    const ex    = cx + Math.cos(angle) * dist;
    const ey    = cy + Math.sin(angle) * dist;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', cx);
    line.setAttribute('y1', cy);
    line.setAttribute('x2', ex.toFixed(1));
    line.setAttribute('y2', ey.toFixed(1));
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', '2.5');
    line.setAttribute('stroke-linecap', 'round');
    line.classList.add('firework-particle');
    fireworksLayer.appendChild(line);
    setTimeout(() => line.remove(), 950);
  }

  const core = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  core.setAttribute('cx', cx);
  core.setAttribute('cy', cy);
  core.setAttribute('r', '4');
  core.setAttribute('fill', 'white');
  core.classList.add('firework-particle');
  fireworksLayer.appendChild(core);
  setTimeout(() => core.remove(), 950);
}

// ── FEEDBACK ──────────────────────────────────────────────
function mostrarFeedback(msg, ok) {
  feedbackMsg.textContent = msg;
  feedbackMsg.className   = 'show ' + (ok ? 'correct-msg' : 'wrong-msg');
}
function ocultarFeedback() { feedbackMsg.className = ''; }

// ── FIN DE PARTIDA ────────────────────────────────────────
function victoria() {
  stopFireworks();
  stopBgLoop();
  ocultarFeedback();
  setCatState('fanfare');
  playSound('fanfare');
  startFireworks();
  $('victory-text').textContent =
    `¡Has superado los ${state.perifericos.length} periféricos!`;
  const irAVictoria = () => {
    screens.game.removeEventListener('click', irAVictoria);
    stopFireworks();
    stopSound('fanfare');
    showScreen('victory');
  };
  setTimeout(() => {
    screens.game.addEventListener('click', irAVictoria);
  }, 600);
}

function gameOver() {
  stopBgLoop();
  $('gameover-text').textContent =
    'El gato se ha caído. ¡Inténtalo de nuevo!';
  showScreen('gameover');
}

// ── UTILIDADES ────────────────────────────────────────────
function mezclar(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
