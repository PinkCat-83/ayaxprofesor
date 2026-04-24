/* ═══════════════════════════════════════════════════════════
   GATO SALTARÍN – constants.js
   Constantes globales del escenario y del gato.
═══════════════════════════════════════════════════════════ */

// ── CONSTANTES DEL ESCENARIO ─────────────────────────────
export const VW = 800, VH = 320;

export const PLATFORM_W  = 90;
export const PLATFORM_Y  = 210;   // Y donde los pies del gato tocan (techo visual de plataforma)
export const ROUND_WIDTH = 720;   // distancia entre inicio plat-izq e inicio plat-der

export const ROCK_CX_LOCAL = [220, 400, 580];  // centros X redistribuidos entre las dos plataformas
export const ROCK_CY       = 240;              // base Y de las rocas (más metidas en el agua)

// Imágenes del gato con sus dimensiones de display
// Todas las imágenes son 800×700 px (ratio ≈ 1.143)
// Tamaño de display unificado: w=96, h=84 (+20% respecto a la versión anterior)
export const CAT_IMAGES = {
  idle:    { src: 'img/pinkcat_idle.png',    w: 96, h: 84 },
  sjump:   { src: 'img/pinkcat_sjump.png',   w: 96, h: 84 },
  fjump:   { src: 'img/pinkcat_fjump.png',   w: 96, h: 84 },
  fanfare: { src: 'img/pinkcat_fanfare.png', w: 96, h: 84 },
  water:   { src: 'img/pinkcat_water.png',   w: 96, h: 84 },
};

// Y del transform del gato (esquina superior): pies en PLATFORM_Y=210
export const CAT_Y_STAND = PLATFORM_Y - CAT_IMAGES.idle.h;  // 126

// Y del gato parado sobre la cima de una roca
// Roca: base en ROCK_CY=240, imagen arranca en y=-48 → cima en 240-48=192
// +15 extra para que el gato quede bien posado visualmente sobre la roca
// +7% de la altura del gato extra → simula que "pisa" la roca al aterrizar
export const CAT_Y_ROCK = 192 - CAT_IMAGES.idle.h + 15 + Math.round(CAT_IMAGES.idle.h * 0.07);  // ~129

// X del gato centrado sobre una plataforma de ancho PLATFORM_W
export function catXforImage(imgKey) {
  return Math.round((PLATFORM_W - CAT_IMAGES[imgKey].w) / 2);
}

export const CAT_START_LOCAL = catXforImage('idle');  // X local sobre plat-izq
export const CAT_GOAL_LOCAL  = catXforImage('idle');  // X local sobre plat-der
