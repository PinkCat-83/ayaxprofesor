/* ═══════════════════════════════════════════════════════════
   GATO SALTARÍN – fireworks.js
   GIF de fuegos artificiales multi-instancia con tintes.
═══════════════════════════════════════════════════════════ */
import { state } from './state-dom.js';

const fireworksContainer = document.getElementById('fireworks-gif');
const GIF_DURATION_MS    = 1800;
const GIF_SPAWN_INTERVAL = 200;

let fwSpawnTimer = null;

const FW_TINTS = [
  'hue-rotate(0deg)',    // original (dorado/naranja)
  'hue-rotate(200deg)',  // azul
  'hue-rotate(100deg)',  // verde
  'hue-rotate(280deg)',  // violeta
  'hue-rotate(320deg)',  // rosa
  'hue-rotate(40deg)',   // amarillo
  'hue-rotate(160deg)',  // cian
];

function spawnGif() {
  if (!fireworksContainer) return;

  const img   = document.createElement('img');
  img.src     = 'img/fireworks.gif?' + Math.random();

  const scale  = 0.3 + Math.random() * 0.7;
  const sizePx = Math.round(280 * scale);
  const left   = Math.random() * 90;
  const top    = Math.random() * 80;
  const tint   = FW_TINTS[Math.floor(Math.random() * FW_TINTS.length)];

  Object.assign(img.style, {
    position:   'absolute',
    width:      sizePx + 'px',
    height:     'auto',
    left:       left + '%',
    top:        top  + '%',
    filter:     tint,
    opacity:    '0',
    transition: 'opacity 0.2s ease',
  });

  fireworksContainer.appendChild(img);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => { img.style.opacity = '1'; });
  });

  setTimeout(() => {
    img.style.opacity = '0';
    setTimeout(() => img.remove(), 250);
  }, GIF_DURATION_MS);
}

export function startFireworks() {
  if (!state.animEnabled) return;
  if (!fireworksContainer) return;
  fireworksContainer.classList.add('active');

  for (let i = 0; i < 6; i++) {
    setTimeout(spawnGif, i * 120);
  }
  fwSpawnTimer = setInterval(spawnGif, GIF_SPAWN_INTERVAL);
}

export function stopFireworks() {
  if (fwSpawnTimer) { clearInterval(fwSpawnTimer); fwSpawnTimer = null; }
  if (fireworksContainer) {
    fireworksContainer.classList.remove('active');
    fireworksContainer.innerHTML = '';
  }
}
