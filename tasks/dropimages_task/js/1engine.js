/* ═══════════════════════════════════════════════════════════
   DROP IMAGES – engine.js
   Flujo del juego: carga JSON, menú, preguntas, feedback,
   victoria y game over.
   ─ Sin gato, rocas, cámara ni scroll lateral.
   ─ La validación de drop viene de drag.js → manejarDrop().
═══════════════════════════════════════════════════════════ */
import {
  state,
  screens,
  pageTitle, pageSubtitle, levelsContainer,
  hudLives, hudProgress,
  dragCard, dragImg, dragLabel,
  dropZones,
  progressBarFill, progressMarker,
  feedbackOverlay, feedbackMsgText,
  explainModal, explainClose,
  btnMenuHud,
  btnExplain,
  fireworksGif,
  playSound, stopSound, stopAllSounds,
} from './state-dom.js';
import { startFireworks, stopFireworks } from './fireworks.js';

// ── PANTALLAS ─────────────────────────────────────────────
export function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

// ── CARGA DE NIVELES Y JSON ───────────────────────────────
export async function cargarNiveles() {
  try {
    const params = new URLSearchParams(window.location.search);
    const config = params.get('config') ?? 'browser.json';
    const r      = await fetch(`json/${config}`);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const data = await r.json();

    state.config  = data;
    state.niveles = data.niveles;

    // Título y subtítulo
    if (pageTitle)    pageTitle.textContent    = data.pageTitle    ?? '¿Navegador o Buscador?';
    if (pageSubtitle) pageSubtitle.textContent = data.pageSubtitle ?? '';
    document.title = data.pageTitle ?? '¿Navegador o Buscador?';

    // Botones de nivel en el menú
    construirMenuNiveles();

  } catch (e) {
    document.body.innerHTML = `
      <div style="
        display:flex; flex-direction:column; align-items:center; justify-content:center;
        height:100vh; font-family:'Nunito',sans-serif; background:#e0f2fe; gap:1rem;
        text-align:center; padding:2rem;">
        <div style="font-size:3rem">🌊</div>
        <h2 style="font-size:1.6rem; color:#0369a1; margin:0">No se pudo cargar el juego</h2>
        <p style="color:#075985; font-weight:600; max-width:360px; margin:0">
          No se encontró el archivo de configuración.<br>
          Comprueba que la URL incluye <code>?config=tu-archivo.json</code>
          y que existe en la carpeta <code>json/</code>.
        </p>
        <p style="color:#78716c; font-size:0.85rem; margin:0">Error: ${e.message}</p>
        <button onclick="location.reload()" style="
          margin-top:0.5rem; padding:0.6rem 1.8rem; border:none; border-radius:50px;
          background:#0369a1; color:white; font-family:'Nunito',sans-serif;
          font-weight:800; font-size:1rem; cursor:pointer;">
          Reintentar
        </button>
      </div>`;
  }
}

// ── MENÚ: BOTONES DE NIVEL ────────────────────────────────
function construirMenuNiveles() {
  if (!levelsContainer) return;
  levelsContainer.innerHTML = '';
  state.niveles.forEach(nivel => {
    const btn = document.createElement('button');
    // 'level-btn' → 'btn-diff' para que coincida con el CSS de screens-hud.css
    btn.className = 'btn-diff';
    btn.innerHTML = `<span class="diff-icon">${nivel.icono ?? '⚓'}</span>
                     <span class="diff-name">${nivel.nombre}</span>
                     <span class="diff-lives">${nivel.vidas} ${nivel.vidas === 1 ? 'vida' : 'vidas'}</span>`;
    btn.addEventListener('click', () => iniciarJuego(nivel));
    levelsContainer.appendChild(btn);
  });
}

// ── PRECARGA DE IMÁGENES ──────────────────────────────────
/**
 * Precarga todas las imágenes del nivel en paralelo.
 * Devuelve una promesa que resuelve cuando todas están listas
 * (o han fallado — nunca bloquea el juego).
 */
function precargarImagenes(nivelObj) {
  if (!state.config?.imgfolder) return Promise.resolve();

  const srcs = nivelObj.preguntas
    .filter(p => p.img)
    .map(p => `${state.config.imgfolder}/${p.img}`);

  const unicas = [...new Set(srcs)];

  return Promise.allSettled(
    unicas.map(src => new Promise(resolve => {
      const img = new Image();
      img.onload  = resolve;
      img.onerror = resolve;
      img.src     = src;
    }))
  );
}

// ── INICIO DEL JUEGO ──────────────────────────────────────
export async function iniciarJuego(nivelObj) {
  stopFireworks();
  stopAllSounds();

  state.nivelActual  = nivelObj;
  state.preguntas    = nivelObj.preguntas;
  state.vidasMax     = nivelObj.vidas;
  state.vidas        = state.vidasMax;
  state.indexActual  = 0;
  state.bloqueado    = true;
  state.rondaEnCurso = 0;
  state.orden        = mezclar([...Array(state.preguntas.length).keys()]);

  // Mostrar pantalla de carga
  const loadingOverlay = document.getElementById('loading-overlay');
  if (loadingOverlay) loadingOverlay.classList.add('active');

  resetDropZones();
  actualizarHUD();
  showScreen('game');

  // Precargar todas las imágenes
  await precargarImagenes(nivelObj);

  // Ocultar pantalla de carga y arrancar
  if (loadingOverlay) loadingOverlay.classList.remove('active');
  state.bloqueado = false;
  mostrarPregunta();
}

// ── HUD ───────────────────────────────────────────────────
function actualizarHUD() {
  // Vidas (emojis dentro de #lives-icons)
  if (hudLives) {
    hudLives.innerHTML = '';
    for (let i = 0; i < state.vidasMax; i++) {
      const s = document.createElement('span');
      s.textContent = i < state.vidas ? '⚓' : '💀';
      hudLives.appendChild(s);
    }
  }

  // Texto de progreso
  if (hudProgress) {
    hudProgress.textContent =
      `Pregunta ${state.indexActual + 1} / ${state.preguntas.length}`;
  }

  // Barra de progreso visual
  const pct = state.preguntas.length > 0
    ? (state.indexActual / state.preguntas.length) * 100
    : 0;
  if (progressBarFill) progressBarFill.style.width = `${pct}%`;
  if (progressMarker)  progressMarker.style.left = `${pct}%`;
}

// ── MOSTRAR PREGUNTA ──────────────────────────────────────
function mostrarPregunta() {
  const p = state.preguntas[state.orden[state.indexActual]];
  state.respuestaCorrecta = String(p.respuesta); // "1", "2" o "3"
  state.bloqueado         = false;

  // Tarjeta: imagen y texto
  if (dragImg) {
    if (state.config?.imgfolder && p.img) {
      dragImg.src           = `${state.config.imgfolder}/${p.img}`;
      dragImg.style.display = '';
    } else {
      dragImg.src           = '';
      dragImg.style.display = 'none';
    }
  }
  if (dragLabel) dragLabel.textContent = p.nombre ?? '';

  // Devolver la tarjeta a su posición inicial
  resetDragCard();
  resetDropZones();
}

// ── RESET VISUAL ──────────────────────────────────────────
function resetDragCard() {
  if (!dragCard) return;
  dragCard.classList.remove('correct', 'incorrect', 'dragging');
  dragCard.style.transform  = '';
  dragCard.style.opacity    = '';
  dragCard.setAttribute('aria-grabbed', 'false');
  dragCard.draggable = true;
}

function resetDropZones() {
  dropZones.forEach(z => {
    if (z) z.classList.remove('halo', 'correct', 'incorrect');
  });
}

// ── MANEJO DE DROP (llamado desde drag.js) ────────────────
/**
 * answerId: string "1", "2" o "3" — el data-answer de la zona donde se soltó la tarjeta.
 */
export function manejarDrop(answerId) {
  if (state.bloqueado) return;
  state.bloqueado = true;
  if (dragCard) dragCard.draggable = false;

  const correcta = answerId === state.respuestaCorrecta;

  const zonaUsada = dropZones.find(z => z && z.dataset.answer === answerId);
  const zonaBuena = dropZones.find(z => z && z.dataset.answer === state.respuestaCorrecta);

  if (zonaUsada)  zonaUsada.classList.add(correcta ? 'correct' : 'incorrect');
  if (dragCard) dragCard.classList.add(correcta ? 'correct' : 'incorrect');

  if (correcta) {
    playSound('correct');
    mostrarFeedback('✓ ¡Correcto!', true);

    const timer = setTimeout(() => avanzar(), FEEDBACK_DELAY);
    feedbackOverlay?.addEventListener('click', () => {
      clearTimeout(timer);
      avanzar();
    }, { once: true });

  } else {
    playSound('wrong');
    mostrarFeedback('✗ Inténtalo de nuevo', false);
    state.vidas--;
    actualizarHUD();

    if (state.vidas <= 0) {
      const timer = setTimeout(() => gameOver(), FEEDBACK_DELAY);
      feedbackOverlay?.addEventListener('click', () => {
        clearTimeout(timer);
        gameOver();
      }, { once: true });

    } else {
      const reanudar = () => {
        ocultarFeedback();
        resetDragCard();
        resetDropZones();
        state.bloqueado = false;
        if (dragCard) dragCard.draggable = true;
      };
      const timer = setTimeout(reanudar, FEEDBACK_DELAY);
      feedbackOverlay?.addEventListener('click', () => {
        clearTimeout(timer);
        reanudar();
      }, { once: true });
    }
  }
}

// ── AVANCE A LA SIGUIENTE PREGUNTA ───────────────────────
function avanzar() {
  ocultarFeedback();
  state.indexActual++;

  if (state.indexActual >= state.preguntas.length) {
    // Llevar la barra al 100% antes de la victoria
    if (progressBarFill) progressBarFill.style.width = '100%';
    if (progressMarker)  progressMarker.style.left   = 'calc(100% - 14px)';
    startFireworks();
    setTimeout(() => victoria(), 400);
  } else {
    actualizarHUD();
    mostrarPregunta();
  }
}

// ── FEEDBACK ──────────────────────────────────────────────
const FEEDBACK_DELAY = 2400; // ms que se muestra el feedback

function mostrarFeedback(msg, ok) {
  if (!feedbackOverlay || !feedbackMsgText) return;
  feedbackMsgText.textContent = msg;
  feedbackOverlay.className = 'show ' + (ok ? 'correct-fb' : 'incorrect-fb');

  const wrongImg = `url('img/wrong${Math.ceil(Math.random() * 5)}.png')`;
  const feedbackFrame = document.getElementById('feedback-frame');
  if (feedbackFrame) {
    feedbackFrame.style.backgroundImage = ok
      ? "url('img/ok.png')"
      : wrongImg;
  }
}

function ocultarFeedback() {
  if (feedbackOverlay) feedbackOverlay.className = '';
  const feedbackFrame = document.getElementById('feedback-frame');
  if (feedbackFrame) feedbackFrame.style.backgroundImage = '';
}

// ── MODAL DE EXPLICACIÓN ──────────────────────────────────
// El CSS usa la clase 'active' (no 'open') para mostrar el modal
export function abrirExplicacion() {
  if (!explainModal) return;
  explainModal.setAttribute('aria-hidden', 'false');
  explainModal.classList.add('active');    // ← era .open, CSS usa .active
}

export function cerrarExplicacion() {
  if (!explainModal) return;
  explainModal.setAttribute('aria-hidden', 'true');
  explainModal.classList.remove('active'); // ← era .open, CSS usa .active
}

// ── FIN DE PARTIDA ────────────────────────────────────────
function victoria() {
  ocultarFeedback();
  playSound('fanfare');

  if (feedbackOverlay && feedbackMsgText) {
    feedbackMsgText.textContent = '¡Lo has conseguido!';
    feedbackOverlay.className = 'show victory-fb';
  }

  const feedbackFrame = document.getElementById('feedback-frame');
  if (feedbackFrame) feedbackFrame.style.backgroundImage = "url('img/fanfare.png')";

  // Cualquier clic en el overlay vuelve al menú
  feedbackOverlay?.addEventListener('click', () => {
    stopAllSounds();
    stopFireworks();
    ocultarFeedback();
    showScreen('menu');
  }, { once: true });

  startFireworks();
}

function gameOver() {
  ocultarFeedback();
  playSound('gameover');

  if (feedbackOverlay && feedbackMsgText) {
    feedbackMsgText.textContent = '¡Se han acabado las vidas!';
    feedbackOverlay.className = 'show gameover-fb';
  }

  const feedbackFrame = document.getElementById('feedback-frame');
  if (feedbackFrame) feedbackFrame.style.backgroundImage = "url('img/gameover.png')";

  // Cualquier clic en el overlay vuelve al menú
  feedbackOverlay?.addEventListener('click', () => {
    stopAllSounds();
    ocultarFeedback();
    showScreen('menu');
  }, { once: true });
}

// ── CABLEAR BOTONES GLOBALES ──────────────────────────────
export function cablearBotones() {
  // HUD → volver al menú (también sale de la victoria)
  btnMenuHud?.addEventListener('click', () => {
    stopAllSounds();
    stopFireworks();
    ocultarFeedback();
    showScreen('menu');
  });

  // Explicación
  btnExplain?.addEventListener('click', abrirExplicacion);
  explainClose?.addEventListener('click', cerrarExplicacion);
  explainModal?.addEventListener('click', e => {
    if (e.target === explainModal) cerrarExplicacion();
  });

  // Pantalla de game over
  // → gestionada por el overlay, el clic se cablea en gameOver()
}

// ── UTILIDADES ────────────────────────────────────────────
function mezclar(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
