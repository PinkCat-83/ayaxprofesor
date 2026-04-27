/* ═══════════════════════════════════════════════════════════
   GATO SALTARÍN – engine.js
   Flujo del juego: inicio, preguntas, clicks, HUD, fin.
═══════════════════════════════════════════════════════════ */
import { ROUND_WIDTH, ROCK_CX_LOCAL, CAT_IMAGES, CAT_Y_STAND, CAT_Y_ROCK, CAT_START_LOCAL, CAT_GOAL_LOCAL } from './constants.js';
import { state, $, screens, hudLives, hudProgress, peripheralLbl, feedbackMsg, rockGroups, rockLabels, catEl, playSound, stopSound, stopAllSounds, swapRockSets, questionImgPanel } from './state-dom.js';
import { initParalaje, aplicarCamara, getCamXActual, camXParaRonda, animarCamara, resetWorldLayout, prepararSiguienteRonda } from './camera.js';
import { setCatState, animarSalto, animarCaida } from './cat.js';
import { startFireworks, stopFireworks } from './fireworks.js';

// ── PANTALLAS ─────────────────────────────────────────────
export function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

// ── CARGA DE NIVELES ──────────────────────────────────────
export async function cargarNiveles() {
  try {
    const params = new URLSearchParams(window.location.search);
    const config = params.get('config') ?? 'perifericos.json';
    const r = await fetch(`json/${config}`);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const data = await r.json();

    state.niveles = data.niveles;
    state.imgfolder = data.imgfolder ?? null;   // carpeta opcional de imágenes

    // Título y subtítulo desde el JSON
    const h1  = document.getElementById('page-title');
    const sub = document.getElementById('page-subtitle');
    if (h1)  h1.textContent  = data.pageTitle    ?? 'Gato Saltarín';
    if (sub) sub.textContent = data.pageSubtitle ?? '';
    document.title           = data.pageTitle    ?? 'Gato Saltarín';
  } catch (e) {
    document.body.innerHTML = `
      <div style="
        display:flex; flex-direction:column; align-items:center; justify-content:center;
        height:100vh; font-family:'Nunito',sans-serif; background:#fce7f3; gap:1rem;
        text-align:center; padding:2rem;">
        <div style="font-size:3rem">😿</div>
        <h2 style="font-size:1.6rem; color:#be185d; margin:0">No se pudo cargar el juego</h2>
        <p style="color:#4c1d95; font-weight:600; max-width:360px; margin:0">
          No se encontró el archivo de configuración.<br>
          Comprueba que la URL incluye <code>?config=tu-archivo.json</code>
          y que existe en la carpeta <code>json/</code>.
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
export function iniciarJuego(nivelObj) {
  stopFireworks();
  stopAllSounds();
  state.nivelActual  = nivelObj;
  state.perifericos  = nivelObj.preguntas;
  state.vidasMax     = nivelObj.vidas;
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
    `Pregunta ${state.indexActual + 1} / ${state.perifericos.length}`;
}

// ── MOSTRAR PREGUNTA ──────────────────────────────────────
// Actualiza solo el estado y la etiqueta del periférico.
// Se usa tanto desde mostrarPregunta como desde scrollAndNextRound.
function activarPregunta(p, opciones) {
  state.bloqueado         = false;
  state.respuestaCorrecta = p.respuesta;
  state.opcionesActuales  = opciones;

  peripheralLbl.style.animation = 'none';
  peripheralLbl.offsetHeight;
  peripheralLbl.style.animation = '';
  peripheralLbl.textContent = p.nombre;

  actualizarImagenPregunta(p);
}

// Reinicia las rocas del set activo y activa la pregunta.
// Solo se llama al inicio de partida y en los reintentos tras fallo.
function mostrarPregunta() {
  const p       = state.perifericos[state.orden[state.indexActual]];
  const opciones = mezclar([...p.opciones]);

  rockGroups.forEach((g, i) => {
    g.classList.remove('correct', 'incorrect', 'rock-shaking', 'rock-sinking');
    g.style.visibility = '';
    g.removeAttribute('opacity');
    const match = g.getAttribute('transform').match(/translate\(([^,]+)/);
    const tx = match ? parseFloat(match[1]) : 0;
    g.setAttribute('transform', `translate(${tx},240)`);
    g.querySelectorAll('.rock-crack').forEach(el => el.remove());
    rockLabels[i].textContent = opciones[i];
  });

  activarPregunta(p, opciones);
}

// ── PANEL DE IMAGEN FLOTANTE ──────────────────────────────
// Dos <img> superpuestas: la activa sale con pixel-out, la nueva entra con pixel-in.
// Sin canvas, sin dataURL — solo CSS keyframes.

let _imgActive = 'a';   // qué img es la visible ahora ('a' o 'b')

const imgEls = () => ({
  a: document.getElementById('question-img-a'),
  b: document.getElementById('question-img-b'),
});

function actualizarImagenPregunta(p) {
  if (state.imgfolder && p.img) {
    const src = `${state.imgfolder}/${p.img}`;
    const els = imgEls();

    if (!questionImgPanel.classList.contains('visible')) {
      // Primera vez: mostrar directamente sin transición
      els.a.src = src;
      els.b.src = '';
      els.b.style.opacity = '0';
      _imgActive = 'a';
      questionImgPanel.style.display = 'block';
      requestAnimationFrame(() => questionImgPanel.classList.add('visible'));
      return;
    }

    // Ya visible: transición pixelada entre la activa y la nueva
    const current = _imgActive;           // img que sale
    const next    = current === 'a' ? 'b' : 'a';  // img que entra

    const elOut = els[current];
    const elIn  = els[next];

    // Precargar la nueva imagen
    elIn.src     = src;
    elIn.style.opacity = '0';
    elIn.classList.remove('anim-in', 'anim-out');

    // Limpiar clases anteriores
    elOut.classList.remove('anim-in', 'anim-out');
    elIn.classList.remove('anim-in', 'anim-out');

    // Forzar reflow
    void elOut.offsetWidth;

    // Arrancar animaciones simultáneas
    elOut.classList.add('anim-out');
    elIn.classList.add('anim-in');

    // La imagen que sale: ocultarla y limpiar src en cuanto termina SU animación
    elOut.addEventListener('animationend', () => {
      elOut.classList.remove('anim-out');
      elOut.style.opacity = '0';
      elOut.src = '';          // ← evita que se vea el src anterior en la siguiente vuelta
    }, { once: true });

    // La imagen que entra: marcarla como activa al terminar
    elIn.addEventListener('animationend', () => {
      elIn.classList.remove('anim-in');
      elIn.style.opacity = '1';
      _imgActive = next;
    }, { once: true });

  } else {
    questionImgPanel.classList.remove('visible');
    questionImgPanel.addEventListener('transitionend', () => {
      if (!questionImgPanel.classList.contains('visible')) {
        questionImgPanel.style.display = 'none';
      }
    }, { once: true });
  }
}
// ── CLICK EN ROCA ─────────────────────────────────────────
export function manejarClick(indiceRoca) {
  if (state.bloqueado) return;
  state.bloqueado = true;

  const elegida            = state.opcionesActuales[indiceRoca];
  const correcta           = elegida === state.respuestaCorrecta;
  const indiceCorrectoRoca = state.opcionesActuales.indexOf(state.respuestaCorrecta);

  const rocaWorldX = state.worldOffset + ROCK_CX_LOCAL[indiceRoca];
  const rocaLandX  = rocaWorldX - Math.round(CAT_IMAGES.idle.w / 2);

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

  // Obtener la siguiente pregunta y barajar opciones ANTES del scroll
  const p              = state.perifericos[state.orden[state.indexActual]];
  const opcionesBarajadas = mezclar([...p.opciones]);

  // Posicionar el set inactivo con etiquetas y coordenadas correctas:
  // estarán dentro del world-group cuando empiece el scroll y se deslizarán
  // naturalmente a la vista sin ninguna aparición mágica al terminar.
  prepararSiguienteRonda(state.worldOffset, opcionesBarajadas);

  animarCamara(camXActual, camXDestino, catEl, () => {
    // El set B ya está en pantalla — hacerlo activo
    swapRockSets();

    // Actualizar plataformas (sin tocar las rocas que ya están posicionadas)
    resetWorldLayout({ skipRocks: true });

    setCatState('idle');
    actualizarHUD();
    // Activar pregunta: actualiza estado y etiqueta del periférico
    activarPregunta(p, opcionesBarajadas);
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
    `¡Has superado las ${state.perifericos.length} preguntas!`;
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
