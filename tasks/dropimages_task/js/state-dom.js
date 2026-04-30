/* ═══════════════════════════════════════════════════════════
   DROP IMAGES – state-dom.js
   Estado global del juego y referencias al DOM.
   ─ Sin gato, rocas, cámara ni world offset.
   ─ Nuevo: zonas de drop, tarjeta arrastrable, modal explicación.
═══════════════════════════════════════════════════════════ */

// ── ESTADO ───────────────────────────────────────────────
export const state = {
  // Datos cargados desde el JSON
  config:       null,   // objeto raíz del JSON (pageTitle, pageSubtitle, imgfolder, images, niveles)
  niveles:      [],     // array de niveles disponibles

  // Partida en curso
  nivelActual:  null,   // objeto del nivel seleccionado
  preguntas:    [],     // lista de preguntas del nivel (copia, puede barajarse)
  orden:        [],     // índices barajados de preguntas
  indexActual:  0,      // posición dentro de `orden`

  // Vidas
  vidas:        1,
  vidasMax:     1,

  // Control de flujo
  bloqueado:    false,  // true mientras se muestra feedback o se procesa una respuesta
  rondaEnCurso: 0,      // contador de ronda (útil para cancelar callbacks huérfanos)

  // La respuesta correcta de la pregunta actual: "1", "2" o "3"
  respuestaCorrecta: '',

  // Preferencias
  animEnabled:  true,
  soundEnabled: true,
};

// ── HELPER ───────────────────────────────────────────────
export const $ = id => document.getElementById(id);

// ── PANTALLAS ────────────────────────────────────────────
export const screens = {
  menu: $('screen-menu'),
  game: $('screen-game'),
};

// ── MENÚ ─────────────────────────────────────────────────
export const pageTitle       = $('page-title');
export const pageSubtitle    = $('page-subtitle');
export const levelsContainer = $('levels-container');

// ── HUD SUPERIOR (fuera del escenario) ───────────────────
export const hudProgress  = $('hud-progress');
export const btnMenuHud   = $('btn-menu-hud');

// ── HUD DENTRO DEL ESCENARIO ─────────────────────────────
export const hudLives   = $('lives-icons');   // contenedor de iconos ⚓/💀
export const btnExplain = $('btn-explain-game');

// ── TARJETA ARRASTRABLE ──────────────────────────────────
export const dragCard  = $('drag-card');
export const dragImg   = $('drag-card-img');   // era 'drag-img' → corregido
export const dragLabel = $('drag-card-text');  // era 'drag-label' → corregido

// ── ZONAS DE DROP ────────────────────────────────────────
// Orden: índice 0 → Navegador (answer "1")
//        índice 1 → Buscador  (answer "2")
//        índice 2 → Página web(answer "3")
export const dropZones = [
  $('drop-navigator'),
  $('drop-search'),
  $('drop-webpage'),
];

// ── BARRA DE PROGRESO ────────────────────────────────────
export const progressBarFill = $('progress-fill');    // era 'progress-bar-fill' → corregido
export const progressMarker  = $('progress-marker');

// ── FEEDBACK ─────────────────────────────────────────────
export const feedbackOverlay = $('feedback-overlay'); // overlay completo (para show/clase)
export const feedbackMsgText = $('feedback-msg-text'); // era 'feedback-msg' → corregido

// ── MODAL DE EXPLICACIÓN ─────────────────────────────────
export const explainModal = $('explain-modal');
export const explainClose = $('btn-explain-close');   // era 'explain-close' → corregido

// ── PANTALLAS FINALES ────────────────────────────────────
// Victoria y gameover: ambas usan #feedback-overlay, gestionado en engine.js

// ── EFECTOS ──────────────────────────────────────────────
export const fireworksGif = $('fireworks-gif');

// ── AUDIO ─────────────────────────────────────────────────
export const audio = {
  correct:  $('snd-correct'),
  wrong:    $('snd-wrong'),
  gameover: $('snd-gameover'),
  fanfare:  $('snd-fanfare'),
};

// Volumen maestro (0–1). El slider arranca en 80.
let masterVolume = 0.8;

// Cablear el slider en cuanto el módulo carga
// (los módulos ES se ejecutan diferidos; el DOM ya está disponible).
const _slider = $('volume-slider');
if (_slider) {
  _slider.addEventListener('input', e => {
    masterVolume = e.target.value / 100;
    state.soundEnabled = masterVolume > 0;

    // Actualizar icono
    const icon = document.querySelector('.volume-icon');
    if (icon) {
      icon.textContent = masterVolume === 0 ? '🔇'
                       : masterVolume < 0.5  ? '🔉'
                       :                       '🔊';
    }

    // Aplicar en tiempo real a los sonidos en loop (fanfare)
    Object.values(audio).forEach(a => { if (a) a.volume = masterVolume; });
  });
}

/** Reproduce un sonido por clave ('correct', 'wrong', 'gameover', 'fanfare'). */
export function playSound(k) {
  if (!state.soundEnabled) return;
  try {
    const a = audio[k];
    if (!a) return;
    a.volume = masterVolume;
    a.currentTime = 0;
    a.play().catch(() => {});
  } catch (e) {}
}

/** Para un sonido sin lanzar excepciones. */
export function stopSound(k) {
  try {
    const a = audio[k];
    if (a) { a.pause(); a.currentTime = 0; }
  } catch (e) {}
}

/** Para todos los sonidos a la vez (útil al volver al menú). */
export function stopAllSounds() {
  Object.keys(audio).forEach(k => stopSound(k));
}
