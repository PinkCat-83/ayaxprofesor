/* ═══════════════════════════════════════════════════════════
   GATO SALTARÍN – main.js
   Punto de entrada único. Importa todo y registra eventos.

   En el HTML basta con:
     <script type="module" src="js/main.js"></script>
═══════════════════════════════════════════════════════════ */
import { state, $, rockGroups, stopAllSounds } from './state-dom.js';
import {
  showScreen, cargarPerifericos, iniciarJuego, manejarClick,
} from './engine.js';
import { stopFireworks } from './fireworks.js';

// ── CLICKS EN ROCAS ───────────────────────────────────────
rockGroups.forEach((g, i) => g.addEventListener('click', () => manejarClick(i)));

// ── BOTONES ───────────────────────────────────────────────
$('btn-nivel1').addEventListener('click', () => iniciarJuego(1));
$('btn-nivel2').addEventListener('click', () => iniciarJuego(2));
$('btn-menu-hud').addEventListener('click', () => {
  stopFireworks();
  stopAllSounds();
  showScreen('menu');
});
$('btn-play-again').addEventListener('click', () => iniciarJuego(state.nivel));
$('btn-menu-victory').addEventListener('click', () => {
  stopFireworks();
  stopAllSounds();
  showScreen('menu');
});
$('btn-retry').addEventListener('click', () => iniciarJuego(state.nivel));
$('btn-menu-gameover').addEventListener('click', () => {
  stopAllSounds();
  showScreen('menu');
});

// ── ARRANQUE ──────────────────────────────────────────────
await cargarPerifericos();
showScreen('menu');
