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
  victory:  $('snd-victory'),
  splash:   $('snd-splash'),
  gameover: $('snd-gameover'),
  fanfare:  $('snd-fanfare'),
};

export function playSound(k) {
  if (!state.soundEnabled) return;
  try {
    const a = audio[k];
    if (!a) return;
    a.currentTime = 0;
    a.play().catch(() => {});
  } catch(e) {}
}

export function stopSound(k) {
  try { const a = audio[k]; if (a) { a.pause(); a.currentTime = 0; } } catch(e) {}
}
