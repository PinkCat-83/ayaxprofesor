/* ═══════════════════════════════════════════════════════════
   GATO SALTARÍN – state-dom.js
   Estado global del juego y referencias al DOM.
═══════════════════════════════════════════════════════════ */
import { CAT_START_LOCAL, CAT_Y_STAND } from './constants.js';

// ── ESTADO ───────────────────────────────────────────────
export const state = {
  perifericos: [],
  orden: [],
  indexActual: 0,
  vidas: 1, vidasMax: 1, nivel: 1,
  bloqueado: false,
  worldOffset: 0,
  catWorldX: CAT_START_LOCAL,
  catWorldY: CAT_Y_STAND,
  catImgKey: 'idle',
  respuestaCorrecta: '',
  opcionesActuales: [],
  rondaEnCurso: 0,
  jumpCancelar: null,
  animEnabled: true,
  soundEnabled: true,
};

// ── DOM REFS ─────────────────────────────────────────────
export const $ = id => document.getElementById(id);

export const screens = {
  menu:     $('screen-menu'),
  game:     $('screen-game'),
  victory:  $('screen-victory'),
  gameover: $('screen-gameover'),
};

export const hudLives       = $('hud-lives');
export const hudProgress    = $('hud-progress');
export const peripheralLbl  = $('peripheral-label');
export const feedbackMsg    = $('feedback-msg');
export const catEl          = $('cat');
export const catMirror      = $('cat-mirror');
export const catImg         = $('cat-img');
export const worldGroup     = $('world-group');
export const fireworksLayer = $('fireworks-layer');

export const rockGroups = [$('rock0'), $('rock1'), $('rock2')];
export const rockLabels = rockGroups.map(g => g.querySelector('.rock-label'));

// ── AUDIO ─────────────────────────────────────────────────
export const audio = {
  jump:     $('snd-jump'),
  splash:   $('snd-splash'),
  gameover: $('snd-gameover'),
  fanfare:  $('snd-fanfare'),
};

// Volumen maestro (0–1). El slider arranca en 80.
let masterVolume = 0.8;

// Cablear el slider de volumen en cuanto el módulo carga (los módulos ES
// se ejecutan en modo diferido, así que el DOM ya está disponible).
const _slider = $('volume-slider');
if (_slider) {
  _slider.addEventListener('input', e => {
    masterVolume = e.target.value / 100;
    state.soundEnabled = masterVolume > 0;
    // Actualizar el icono según estado
    const icon = document.querySelector('.volume-icon');
    if (icon) icon.textContent = masterVolume === 0 ? '🔇' : masterVolume < 0.5 ? '🔉' : '🔊';
    // Aplicar en tiempo real a los sonidos en loop (fanfare)
    Object.values(audio).forEach(a => { if (a) a.volume = masterVolume; });
  });
}

export function playSound(k) {
  if (!state.soundEnabled) return;
  try {
    const a = audio[k];
    if (!a) return;
    a.volume = masterVolume;
    a.currentTime = 0;
    a.play().catch(() => {});
  } catch(e) {}
}

export function stopSound(k) {
  try { const a = audio[k]; if (a) { a.pause(); a.currentTime = 0; } } catch(e) {}
}

export function stopAllSounds() {
  Object.keys(audio).forEach(k => stopSound(k));
}
