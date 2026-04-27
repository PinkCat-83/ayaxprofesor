/* ═══════════════════════════════════════════════════════════
   GATO SALTARÍN – main.js
   Punto de entrada único. Importa todo y registra eventos.

   En el HTML basta con:
     <script type="module" src="js/main.js"></script>
═══════════════════════════════════════════════════════════ */
import { state, $, rockGroupsA, rockGroupsB, stopAllSounds } from './state-dom.js';
import {
  showScreen, cargarNiveles, iniciarJuego, manejarClick,
} from './engine.js';
import { stopFireworks } from './fireworks.js';

// ── CLICKS EN ROCAS ───────────────────────────────────────
// Se registran los 6 elementos (sets A y B) desde el inicio.
// manejarClick(i) usa rockGroups (array mutable) para saber cuál
// es el set activo, así el índice 0-2 siempre apunta a la roca correcta.
[...rockGroupsA, ...rockGroupsB].forEach((g, i) =>
  g.addEventListener('click', () => manejarClick(i % 3)));

// ── BOTONES FIJOS ─────────────────────────────────────────
$('btn-menu-hud').addEventListener('click', () => {
  stopFireworks();
  stopAllSounds();
  showScreen('menu');
});
$('btn-play-again').addEventListener('click', () => iniciarJuego(state.nivelActual));
$('btn-menu-victory').addEventListener('click', () => {
  stopFireworks();
  stopAllSounds();
  showScreen('menu');
});
$('btn-retry').addEventListener('click', () => iniciarJuego(state.nivelActual));
$('btn-menu-gameover').addEventListener('click', () => {
  stopAllSounds();
  showScreen('menu');
});

// ── BOTONES DE NIVEL (dinámicos) ──────────────────────────
function generarBotonesNiveles() {
  const container = $('levels-container');
  container.innerHTML = '';
  state.niveles.forEach(nivel => {
    const btn = document.createElement('button');
    btn.className = 'btn-diff';
    btn.innerHTML = `
      <span class="diff-icon">${nivel.icono ?? '🐱'}</span>
      <span class="diff-name">${nivel.nombre}</span>
      <span class="diff-desc">${nivel.vidas} vida${nivel.vidas !== 1 ? 's' : ''}</span>
    `;
    btn.addEventListener('click', () => iniciarJuego(nivel));
    container.appendChild(btn);
  });
}

// ── ARRANQUE ──────────────────────────────────────────────
await cargarNiveles();
generarBotonesNiveles();
showScreen('menu');
