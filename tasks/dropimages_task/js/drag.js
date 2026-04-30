/* ═══════════════════════════════════════════════════════════
   DROP IMAGES – drag.js
   Lógica de arrastrar la tarjeta y soltarla en una zona destino.

   ── Soporta:
      • Drag & Drop nativo (desktop)
      • Touch events (móvil / tablet)

   ── Flujo:
      1. El usuario pulsa/toca la tarjeta (#drag-card).
      2. Mueve la tarjeta libremente; al pasar sobre una zona
         de drop se añade la clase .halo a esa zona.
      3. Al soltar encima de una zona válida se llama a
         manejarDrop(answerId) en engine.js.
      4. Si se suelta fuera de toda zona, la tarjeta vuelve
         a su posición inicial con una animación suave.
═══════════════════════════════════════════════════════════ */

import { state, dragCard, dropZones } from './state-dom.js';
import { manejarDrop }                from './engine.js';

// ── ESTADO INTERNO DE ARRASTRE ───────────────────────────
const drag = {
  active:   false,   // hay arrastre en curso
  clone:    null,    // elemento visual que sigue al cursor/dedo
  offsetX:  0,       // offset del puntero respecto al origen de la tarjeta
  offsetY:  0,
  overZone: null,    // zona actualmente resaltada (o null)
};

// ── INICIALIZACIÓN ───────────────────────────────────────
export function initDrag() {
  // ─ Eventos de ratón ─────────────────────────────────
  dragCard.addEventListener('mousedown',  onPointerDown);
  document.addEventListener('mousemove',  onPointerMove);
  document.addEventListener('mouseup',    onPointerUp);

  // ─ Eventos táctiles ──────────────────────────────────
  dragCard.addEventListener('touchstart', onTouchStart, { passive: false });
  document.addEventListener('touchmove',  onTouchMove,  { passive: false });
  document.addEventListener('touchend',   onTouchEnd);

  // ─ Evitar drag nativo del navegador en la tarjeta ────
  dragCard.addEventListener('dragstart', e => e.preventDefault());
}

// ── HELPERS DE POSICIÓN ──────────────────────────────────
function clientPos(e) {
  // Devuelve {x, y} tanto para mouse como para touch
  if (e.touches && e.touches.length > 0) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  return { x: e.clientX, y: e.clientY };
}

// ── INICIO DEL ARRASTRE ──────────────────────────────────
function startDrag(e) {
  if (state.bloqueado) return;
  if (!dragCard.draggable) return;

  drag.active = true;

  const rect = dragCard.getBoundingClientRect();
  const pos  = clientPos(e);

  drag.offsetX = pos.x - rect.left - rect.width  / 2;
  drag.offsetY = pos.y - rect.top  - rect.height / 2;

  // Clonar la tarjeta como elemento flotante
  drag.clone = dragCard.cloneNode(true);
  drag.clone.id = 'drag-clone';
  drag.clone.style.cssText = `
    position:   fixed;
    width:      ${rect.width}px;
    height:     ${rect.height}px;
    left:       ${rect.left}px;
    top:        ${rect.top}px;
    margin:     0;
    z-index:    9999;
    pointer-events: none;
    transition: none;
    transform:  scale(1.06) rotate(2deg);
    box-shadow: 0 12px 40px rgba(14,66,114,0.35);
    opacity:    0.95;
  `;
  document.body.appendChild(drag.clone);

  // Ocultar la tarjeta original (queda como "hueco")
  dragCard.style.opacity = '0.25';
  dragCard.setAttribute('aria-grabbed', 'true');
}

function onPointerDown(e) {
  if (e.button !== 0) return; // solo clic izquierdo
  e.preventDefault();
  startDrag(e);
}

function onTouchStart(e) {
  e.preventDefault();
  startDrag(e);
}

// ── MOVIMIENTO ───────────────────────────────────────────
function moveDrag(e) {
  if (!drag.active || !drag.clone) return;

  const pos = clientPos(e);
  const rect = drag.clone.getBoundingClientRect();

  drag.clone.style.left = `${pos.x - drag.offsetX - rect.width  / 2}px`;
  drag.clone.style.top  = `${pos.y - drag.offsetY - rect.height / 2}px`;

  // Detectar sobre qué zona estamos
  const zonaActual = getZoneBelowPointer(pos.x, pos.y);
  updateHalo(zonaActual);
}

function onPointerMove(e) {
  if (!drag.active) return;
  moveDrag(e);
}

function onTouchMove(e) {
  if (!drag.active) return;
  e.preventDefault();
  moveDrag(e);
}

// ── FIN DEL ARRASTRE ─────────────────────────────────────
function endDrag(e) {
  if (!drag.active) return;
  drag.active = false;

  const pos  = clientPos(e.changedTouches ? e : e);
  // Para touchend usamos changedTouches
  const finalPos = (e.changedTouches && e.changedTouches.length > 0)
    ? { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }
    : { x: e.clientX, y: e.clientY };

  const zona = getZoneBelowPointer(finalPos.x, finalPos.y);

  // Limpiar el clon flotante
  if (drag.clone) {
    drag.clone.remove();
    drag.clone = null;
  }

  clearHalo();
  dragCard.setAttribute('aria-grabbed', 'false');

  if (zona) {
    // ── Soltar en zona válida ──
    dragCard.style.opacity = '1';
    manejarDrop(zona.dataset.answer);
  } else {
    // ── Soltar fuera: devolver la tarjeta a su sitio ──
    returnCard();
  }
}

function onPointerUp(e) {
  if (!drag.active) return;
  endDrag(e);
}

function onTouchEnd(e) {
  if (!drag.active) return;
  endDrag(e);
}

// ── DETECCIÓN DE ZONA ────────────────────────────────────
/**
 * Devuelve el elemento de zona que está bajo el punto {x, y},
 * o null si el puntero no está sobre ninguna zona válida.
 */
function getZoneBelowPointer(x, y) {
  for (const zona of dropZones) {
    const r = zona.getBoundingClientRect();
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
      return zona;
    }
  }
  return null;
}

// ── HALO ─────────────────────────────────────────────────
function updateHalo(zonaActual) {
  if (zonaActual === drag.overZone) return; // sin cambio

  // Quitar halo de la zona anterior
  if (drag.overZone) drag.overZone.classList.remove('halo');

  // Poner halo en la nueva zona
  if (zonaActual) zonaActual.classList.add('halo');

  drag.overZone = zonaActual;
}

function clearHalo() {
  if (drag.overZone) {
    drag.overZone.classList.remove('halo');
    drag.overZone = null;
  }
}

// ── RETORNO DE TARJETA ───────────────────────────────────
/**
 * Anima la tarjeta de vuelta a su posición original.
 * Restaura el transform completo (translateX(-50%) + scale(1))
 * para no perder el centrado absoluto de la tarjeta.
 */
function returnCard() {
  dragCard.style.transition = 'opacity 0.3s, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)';
  dragCard.style.opacity    = '1';
  dragCard.style.transform  = 'translateX(-50%) scale(1)';

  dragCard.addEventListener('transitionend', () => {
    dragCard.style.transition = '';
    dragCard.style.transform  = ''; // dejar que el CSS tome el control
  }, { once: true });
}
