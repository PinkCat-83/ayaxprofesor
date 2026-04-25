/* ═══════════════════════════════════════════════════════════
   GATO SALTARÍN – engine.js
   Flujo del juego: inicio, preguntas, clicks, HUD, fin.
═══════════════════════════════════════════════════════════ */
import { ROUND_WIDTH, ROCK_CX_LOCAL, CAT_IMAGES, CAT_Y_STAND, CAT_Y_ROCK, CAT_START_LOCAL, CAT_GOAL_LOCAL } from './constants.js';
import { state, $, screens, hudLives, hudProgress, peripheralLbl, feedbackMsg, rockGroups, rockLabels, catEl, playSound, stopSound, stopAllSounds } from './state-dom.js';
import { initParalaje, aplicarCamara, getCamXActual, camXParaRonda, animarCamara, resetWorldLayout } from './camera.js';
import { setCatState, animarSalto, animarCaida } from './cat.js';
import { startFireworks, stopFireworks } from './fireworks.js';

// ── PANTALLAS ─────────────────────────────────────────────
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
  } catch (e) {
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
  stopAllSounds();
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
  catEl.style.visibility = ''; // Bug 1: restaurar si venía de game over
  setCatState('idle');
  mostrarPregunta();
  actualizarHUD();
  showScreen('game');
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
    g.classList.remove('correct', 'incorrect', 'rock-shaking', 'rock-sinking');
    g.style.visibility = '';
    g.removeAttribute('opacity');
    // Restaurar transform original (solo translate X, Y=240 fijo en el HTML)
    const match = g.getAttribute('transform').match(/translate\(([^,]+)/);
    const tx = match ? parseFloat(match[1]) : 0;
    g.setAttribute('transform', `translate(${tx},240)`);
    g.querySelectorAll('.rock-crack').forEach(el => el.remove());
    rockLabels[i].textContent = opciones[i];
  });

  state.respuestaCorrecta = p.respuesta;
  state.opcionesActuales  = opciones;
}

// ── CLICK EN ROCA ─────────────────────────────────────────
export function manejarClick(indiceRoca) {
  if (state.bloqueado) return;
  state.bloqueado = true;

  const elegida            = state.opcionesActuales[indiceRoca];
  const correcta           = elegida === state.respuestaCorrecta;
  const indiceCorrectoRoca = state.opcionesActuales.indexOf(state.respuestaCorrecta);

  const rocaWorldX = state.worldOffset + ROCK_CX_LOCAL[indiceRoca];
  const rocaLandX  = rocaWorldX - Math.round(CAT_IMAGES.fjump.w / 2);

  playSound('jump');

  if (correcta) {
    // ── CORRECTO ──
    mostrarFeedback('✓ ¡Correcto!', true);
    hundirRocasMalas(indiceCorrectoRoca);
    animarSalto(rocaLandX, CAT_Y_ROCK, () => {
      rockGroups[indiceRoca].classList.add('correct');
      const goalWorldX = state.worldOffset + ROUND_WIDTH + CAT_GOAL_LOCAL;
      playSound('jump');
      animarSalto(goalWorldX, CAT_Y_STAND, () => {
        setCatState('idle');
        ocultarFeedback();
        state.indexActual++;
        if (state.indexActual >= state.perifericos.length) {
          startFireworks();
          setTimeout(() => victoria(), 400);
        } else {
          setTimeout(() => scrollAndNextRound(), 300);
        }
      });
    });

  } else {
    // ── INCORRECTO ──
    mostrarFeedback('✗ ¡Al agua!', false);
    hundirRocasMalas(indiceCorrectoRoca); // hunde todas menos la correcta

    // El gato salta directamente hacia el agua (posición de la roca rota)
    animarSalto(rocaLandX, CAT_Y_ROCK + 30, () => {
      playSound('splash');
      animarCaida(() => {
        catEl.style.visibility = 'hidden'; // Bug 2: ocultar antes del reposicionado
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
            catEl.style.visibility = ''; // Bug 2: mostrar tras reposicionado
            mostrarPregunta();
          }, 400);
        }
      });
    });
  }
}

// ── HUNDIMIENTO DE ROCAS MALAS ────────────────────────────
function hundirRocasMalas(indiceCorrecta) {
  const duracion  = 900;
  const sumergirY = 60;

  rockGroups.forEach((group, i) => {
    if (i === indiceCorrecta) return;

    let startTime = null;
    const match = group.getAttribute('transform').match(/translate\(([^,]+),([^)]+)\)/);
    const tx = match ? parseFloat(match[1]) : 0;
    const ty = match ? parseFloat(match[2]) : 0;

    function frame(now) {
      if (startTime === null) startTime = now;
      const t    = Math.min((now - startTime) / duracion, 1);
      const ease = t * t;

      group.setAttribute('transform', `translate(${tx},${ty + ease * sumergirY})`);
      group.setAttribute('opacity', (1 - ease).toFixed(3));

      if (t < 1) requestAnimationFrame(frame);
      else group.style.visibility = 'hidden';
    }

    requestAnimationFrame(frame);
  });
}


function scrollAndNextRound() {
  state.rondaEnCurso++;
  state.worldOffset = state.rondaEnCurso * ROUND_WIDTH;
  state.catWorldX   = state.worldOffset + CAT_START_LOCAL;
  state.catWorldY   = CAT_Y_STAND;

  const camXActual  = getCamXActual();
  const camXDestino = camXParaRonda();

  animarCamara(camXActual, camXDestino, catEl, () => {
    resetWorldLayout();
    setCatState('idle');
    actualizarHUD();
    mostrarPregunta();
  });
}

// ── FEEDBACK ──────────────────────────────────────────────
function mostrarFeedback(msg, ok) {
  feedbackMsg.textContent = msg;
  feedbackMsg.className   = 'show ' + (ok ? 'correct-msg' : 'wrong-msg');
}
function ocultarFeedback() { feedbackMsg.className = ''; }

// ── FIN DE PARTIDA ────────────────────────────────────────
function victoria() {
  ocultarFeedback();
  setCatState('fanfare');
  playSound('fanfare');
  $('victory-text').textContent =
    `¡Has superado los ${state.perifericos.length} periféricos!`;
  const irAMenu = () => {
    screens.game.removeEventListener('click', irAMenu);
    stopFireworks();
    stopAllSounds();
    showScreen('menu');
  };
  setTimeout(() => {
    screens.game.addEventListener('click', irAMenu);
  }, 600);
}

function gameOver() {
  $('gameover-text').textContent = 'El gato se ha caído. ¡Inténtalo de nuevo!';
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
