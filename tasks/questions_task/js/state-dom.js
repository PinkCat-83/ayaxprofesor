/* ═══════════════════════════════════════════════════════════
   GATO SALTARÍN – state-dom.js
   Estado global del juego y referencias al DOM.
═══════════════════════════════════════════════════════════ */
import { CAT_START_LOCAL, CAT_Y_STAND } from './constants.js';

// ── ESTADO ───────────────────────────────────────────────
export const state = {
  niveles: [],        // array de objetos de nivel cargados desde los JSON
  nivelActual: null,  // objeto del nivel en juego
  perifericos: [],    // lista de periféricos del nivel en juego
  orden: [],
  indexActual: 0,
  vidas: 1, vidasMax: 1,
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
export const catRot         = $('cat-rot');
export const catImgs        = {
  idle:    $('cat-img-idle'),
  sjump:   $('cat-img-sjump'),
  fanfare: $('cat-img-fanfare'),
  water:   $('cat-img-water'),
};
export const worldGroup      = $('world-group');
export const fireworksLayer  = $('fireworks-layer');
export const questionImgPanel = $('question-img-panel');
export const questionImg      = $('question-img');

// Sets de rocas A (ronda actual) y B (siguiente ronda, precargada durante el scroll)
export const rockGroupsA = [$('rock0'), $('rock1'), $('rock2')];
export const rockGroupsB = [$('rock3'), $('rock4'), $('rock5')];
export const rockLabelsA = rockGroupsA.map(g => g.querySelector('.rock-label'));
export const rockLabelsB = rockGroupsB.map(g => g.querySelector('.rock-label'));

// Arrays mutables: todos los módulos importan la misma referencia de objeto,
// así que mutar en lugar de reasignar hace que el cambio sea visible en todos.
export const rockGroups = [...rockGroupsA];
export const rockLabels = [...rockLabelsA];

// Intercambia el set activo en el sitio (sin crear nuevas referencias)
export function swapRockSets() {
  const isA      = rockGroups[0] === rockGroupsA[0];
  const nxGroups = isA ? rockGroupsB : rockGroupsA;
  const nxLabels = isA ? rockLabelsB : rockLabelsA;
  for (let i = 0; i < 3; i++) {
    rockGroups[i] = nxGroups[i];
    rockLabels[i] = nxLabels[i];
  }
}

// Devuelve el set que no está activo (el que se usará como siguiente)
export function getNextRockSets() {
  const isA = rockGroups[0] === rockGroupsA[0];
  return { groups: isA ? rockGroupsB : rockGroupsA,
           labels: isA ? rockLabelsB : rockLabelsA };
}

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
