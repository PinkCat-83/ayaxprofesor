/* ═══════════════════════════════════════════════════════════
   DROP IMAGES – main.js
   Punto de entrada: arranca el juego cuando el DOM está listo.
═══════════════════════════════════════════════════════════ */

import { cargarNiveles, cablearBotones } from './engine.js';
import { initDrag }                      from './drag.js';
import { initClouds }                    from './clouds.js';
import { initSeagulls }                  from './seagulls.js';

// Imágenes fijas del juego — se precargan una sola vez al arrancar
const STATIC_IMAGES = [
  'img/ok.png',
  'img/wrong.png',
  'img/fanfare.png',
  'img/gameover.png',
  'img/progressbar_icon.png',
  'img/progressbar_victory.png',
  'img/dest_navigator.png',
  'img/dest_search.png',
  'img/dest_webpage.png',
];

function precargarEstaticas() {
  STATIC_IMAGES.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  precargarEstaticas();
  await cargarNiveles();
  cablearBotones();
  initDrag();
  initClouds();
  initSeagulls();
});
