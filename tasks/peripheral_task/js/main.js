/* ═══════════════════════════════════════════════════════════
   GATO SALTARÍN – main.js
   Punto de entrada único. Importa todo y registra eventos.

   En el HTML basta con:
     <script type="module" src="js/main.js"></script>
═══════════════════════════════════════════════════════════ */
import { state, $, rockGroups, stopSound } from './state-dom.js';
import {
  showScreen, cargarPerifericos, iniciarJuego,
  manejarClick, stopFireworks,
} from './engine.js';

// ── TOGGLES ───────────────────────────────────────────────
$('btn-toggle-sound').addEventListener('click', () => {
  state.soundEnabled = !state.soundEnabled;
  $('btn-toggle-sound').classList.toggle('active', state.soundEnabled);
  if (!state.soundEnabled) stopSound('fanfare');
});

// ── CLICKS EN ROCAS ───────────────────────────────────────
rockGroups.forEach((g, i) => g.addEventListener('click', () => manejarClick(i)));

// ── BOTONES ───────────────────────────────────────────────
$('btn-nivel1').addEventListener('click', () => iniciarJuego(1));
$('btn-nivel2').addEventListener('click', () => iniciarJuego(2));
$('btn-menu-hud').addEventListener('click', () => {
  stopFireworks();
  stopSound('fanfare');
  showScreen('menu');
});
$('btn-play-again').addEventListener('click', () => iniciarJuego(state.nivel));
$('btn-menu-victory').addEventListener('click', () => {
  stopFireworks();
  stopSound('fanfare');
  showScreen('menu');
});
$('btn-retry').addEventListener('click', () => iniciarJuego(state.nivel));
$('btn-menu-gameover').addEventListener('click', () => showScreen('menu'));

// ── ARRANQUE ──────────────────────────────────────────────
await cargarPerifericos();
showScreen('menu');
