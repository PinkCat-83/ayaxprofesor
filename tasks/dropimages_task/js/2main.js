/* ═══════════════════════════════════════════════════════════
   DROP IMAGES – main.js
   Punto de entrada: arranca el juego cuando el DOM está listo.
═══════════════════════════════════════════════════════════ */

import { cargarNiveles, cablearBotones } from './engine.js';
import { initDrag }                      from './drag.js';

document.addEventListener('DOMContentLoaded', async () => {
  await cargarNiveles();   // carga JSON y construye el menú
  cablearBotones();        // listeners de HUD, explicación, victoria, gameover
  initDrag();              // listeners de drag & drop de la tarjeta
});
