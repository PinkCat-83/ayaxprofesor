/* ═══════════════════════════════════════════════════════════
   DROP IMAGES – main.js
   Punto de entrada: arranca el juego cuando el DOM está listo.
═══════════════════════════════════════════════════════════ */

import { cargarNiveles, cablearBotones } from './engine.js';
import { initDrag }                      from './drag.js';

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
  precargarEstaticas();          // lanza la precarga sin esperar
  await cargarNiveles();         // carga JSON y construye el menú
  cablearBotones();              // listeners de HUD, explicación, victoria, gameover
  initDrag();                    // listeners de drag & drop de la tarjeta
});
