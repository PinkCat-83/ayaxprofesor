/* ═══════════════════════════════════════════════════════════
   DROP IMAGES – clouds.js
   Generador de nubes SVG vectoriales animadas.
   Las nubes se crean dinámicamente y cruzan el escenario
   de izquierda a derecha (o derecha a izquierda) a
   diferentes velocidades, alturas y tamaños.
═══════════════════════════════════════════════════════════ */

// ── CONFIGURACIÓN ─────────────────────────────────────────
const CLOUD_CONFIG = {
  minY:  4,
  maxY: 35,
  count: 8,   // aumentado de 6 a 8
  minSpeed: 30,
  maxSpeed: 70,
  minOpacity: 0.55,
  maxOpacity: 0.88,
};

// ── FORMAS DE NUBE ────────────────────────────────────────
// Cada forma es una función que recibe (cx, cy, scale) y devuelve
// el atributo `d` de un path SVG con fondo blanco.
// Se usan múltiples círculos superpuestos para formas orgánicas.

const CLOUD_SHAPES = [
  // Nube clásica — tres cúpulas
  (cx, cy, s) => `
    M${cx - 60*s},${cy}
    a${30*s},${22*s} 0 0,1 ${60*s},${-8*s}
    a${25*s},${28*s} 0 0,1 ${50*s},${-2*s}
    a${22*s},${20*s} 0 0,1 ${30*s},${12*s}
    z
  `,
  // Nube alargada — cuatro cúpulas más suaves
  (cx, cy, s) => `
    M${cx - 80*s},${cy}
    a${28*s},${18*s} 0 0,1 ${55*s},${-10*s}
    a${30*s},${25*s} 0 0,1 ${55*s},${-4*s}
    a${28*s},${22*s} 0 0,1 ${45*s},${0*s}
    a${20*s},${16*s} 0 0,1 ${20*s},${14*s}
    z
  `,
  // Nube pequeña y esponjosa
  (cx, cy, s) => `
    M${cx - 35*s},${cy}
    a${20*s},${16*s} 0 0,1 ${35*s},${-12*s}
    a${22*s},${20*s} 0 0,1 ${35*s},${4*s}
    a${16*s},${14*s} 0 0,1 ${10*s},${10*s}
    z
  `,
  // Nube grande y plana
  (cx, cy, s) => `
    M${cx - 90*s},${cy}
    a${35*s},${16*s} 0 0,1 ${60*s},${-8*s}
    a${28*s},${24*s} 0 0,1 ${60*s},${-6*s}
    a${30*s},${20*s} 0 0,1 ${55*s},${2*s}
    a${25*s},${14*s} 0 0,1 ${15*s},${14*s}
    z
  `,
  // Nube muy grande — imponente, con múltiples torres y base ancha
  (cx, cy, s) => `
    M${cx - 130*s},${cy}
    a${40*s},${20*s} 0 0,1 ${70*s},${-12*s}
    a${35*s},${38*s} 0 0,1 ${55*s},${-20*s}
    a${30*s},${42*s} 0 0,1 ${60*s},${-8*s}
    a${35*s},${35*s} 0 0,1 ${65*s},${10*s}
    a${28*s},${22*s} 0 0,1 ${40*s},${18*s}
    a${45*s},${16*s} 0 0,1 ${-60*s},${14*s}
    a${50*s},${12*s} 0 0,1 ${-110*s},${4*s}
    a${40*s},${14*s} 0 0,1 ${-120*s},${-6*s}
    z
  `,
];

// ── ESTADO ───────────────────────────────────────────────
let cloudsLayer = null;
let stageFrame  = null;
let clouds      = [];

// ── INICIALIZACIÓN ────────────────────────────────────────
export function initClouds() {
  cloudsLayer = document.getElementById('clouds-layer');
  stageFrame  = document.getElementById('stage-frame');
  if (!cloudsLayer || !stageFrame) return;

  for (let i = 0; i < CLOUD_CONFIG.count; i++) {
    // Todas empiezan dentro de pantalla en posición aleatoria
    spawnCloud(true);
  }
}

// ── CREAR NUBE ────────────────────────────────────────────
function spawnCloud(startInside = false) {
  const W = stageFrame.offsetWidth  || 900;
  const H = stageFrame.offsetHeight || 360;

  const goLeft    = Math.random() > 0.5;
  const speed     = rand(CLOUD_CONFIG.minSpeed, CLOUD_CONFIG.maxSpeed);
  const scale     = rand(0.4, 1.4);
  const opacity   = rand(CLOUD_CONFIG.minOpacity, CLOUD_CONFIG.maxOpacity);
  const yPct      = rand(CLOUD_CONFIG.minY, CLOUD_CONFIG.maxY);
  const y         = H * yPct / 100;
  const shapeIdx  = Math.floor(Math.random() * CLOUD_SHAPES.length);

  // Si empieza dentro, posición X aleatoria en pantalla
  // Si empieza fuera, desde el borde correspondiente a su dirección
  const startX = startInside
    ? rand(-100, W + 100)
    : goLeft ? W + 120 : -200;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.style.cssText = `
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    overflow: visible;
    z-index: 1;
  `;

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', CLOUD_SHAPES[shapeIdx](startX, y, scale));
  path.setAttribute('fill', 'white');
  path.setAttribute('opacity', opacity);

  svg.appendChild(path);
  cloudsLayer.appendChild(svg);

  const cloud = { svg, path, x: startX, y, scale, shapeIdx, speed, opacity, goLeft };
  clouds.push(cloud);

  animateCloud(cloud);
}

// ── ANIMAR NUBE ───────────────────────────────────────────
function animateCloud(cloud) {
  const W        = stageFrame?.offsetWidth || 900;
  const duration = cloud.speed * 1000;

  // Posición inicial y final
  const xStart = cloud.x;
  const xEnd   = cloud.goLeft ? -200 : W + 120;

  let start = null;

  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);

    const currentX = xStart + (xEnd - xStart) * progress;

    cloud.path.setAttribute('d',
      CLOUD_SHAPES[cloud.shapeIdx](currentX, cloud.y, cloud.scale)
    );

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      // Reciclar sin pausa — aparece desde el borde contrario
      const H      = stageFrame?.offsetHeight || 360;
      cloud.goLeft = !cloud.goLeft;
      cloud.x      = cloud.goLeft ? W + 120 : -200;
      cloud.y      = H * rand(CLOUD_CONFIG.minY, CLOUD_CONFIG.maxY) / 100;
      cloud.scale  = rand(0.4, 1.1);
      cloud.opacity = rand(CLOUD_CONFIG.minOpacity, CLOUD_CONFIG.maxOpacity);
      cloud.speed  = rand(CLOUD_CONFIG.minSpeed, CLOUD_CONFIG.maxSpeed);
      cloud.path.setAttribute('opacity', cloud.opacity);
      animateCloud(cloud);
    }
  }
  requestAnimationFrame(step);
}

// ── UTILIDADES ────────────────────────────────────────────
function rand(min, max) {
  return min + Math.random() * (max - min);
}

// ── LIMPIEZA ──────────────────────────────────────────────
export function destroyClouds() {
  clouds.forEach(c => c.svg?.remove());
  clouds = [];
}
