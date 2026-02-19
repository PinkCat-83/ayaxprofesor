/**
 * textfit.js — Ajusta automáticamente el tamaño de fuente
 * para que el texto quepa sin solapar otros elementos.
 */

(function () {

  const MIN_SIZE = 8;
  const MAX_SIZE = 13;

  function fitText(el, availablePx) {
    el.style.whiteSpace = 'nowrap';
    el.style.overflow   = 'visible';
    el.style.fontSize   = MAX_SIZE - 1 + 'px';

    let size = MAX_SIZE - 1;

    while (el.getBoundingClientRect().width > availablePx && size > MIN_SIZE) {
      size -= 0.5;
      el.style.fontSize = size + 'px';
    }

    if (el.getBoundingClientRect().width > availablePx) {
      el.style.overflow     = 'hidden';
      el.style.textOverflow = 'ellipsis';
    }
  }

  function getWidth(el) {
    return el ? el.getBoundingClientRect().width : 0;
  }

  function fitTriggers() {
    document.querySelectorAll('.group-trigger').forEach(trigger => {
      const title = trigger.querySelector('.group-title');
      const arrow = trigger.querySelector('.group-arrow');
      if (!title) return;

      const style     = getComputedStyle(trigger);
      const padding   = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      const gap       = parseFloat(style.gap) || 10;
      const available = trigger.getBoundingClientRect().width - padding - getWidth(arrow) - gap;

      fitText(title, available);
    });
  }

  function fitPanelButtons() {
    document.querySelectorAll('.group-panel .btn').forEach(btn => {
      const label = btn.querySelector('.btn-label');
      const icon  = btn.querySelector('.btn-icon');
      const arrow = btn.querySelector('.btn-arrow');
      if (!label) return;

      // Solo medir si el botón ya es visible
      if (btn.getBoundingClientRect().width === 0) return;

      const style     = getComputedStyle(btn);
      const padding   = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      const gap       = (parseFloat(style.gap) || 16) * 2;
      const available = btn.getBoundingClientRect().width - padding - getWidth(icon) - getWidth(arrow) - gap;

      fitText(label, available);
    });
  }

  function fitAll() {
    fitTriggers();
    fitPanelButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fitAll);
  } else {
    fitAll();
  }

  window.addEventListener('resize', fitAll);

  // Al abrir un grupo: los triggers ya están bien, solo hay que ajustar
  // los botones del panel una vez termine la animación (400ms en el CSS)
  document.addEventListener('click', function (e) {
    if (e.target.closest('.group-trigger')) setTimeout(fitPanelButtons, 420);
  });

})();
