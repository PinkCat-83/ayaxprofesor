/**
 * glitch.js — Efecto de hackeo con cortes horizontales
 * Uso: <script src="js/glitch.js"></script>
 *
 * Configura el comportamiento con window.GLITCH_CONFIG antes de cargar el script:
 *   window.GLITCH_CONFIG = { minInterval: 30000, maxInterval: 60000, duration: 600 }
 */

(function () {

  const CONFIG = Object.assign({
    minInterval: 20000,   // ms mínimo entre glitches
    maxInterval: 40000,   // ms máximo entre glitches
    duration:    800,     // ms que dura el efecto completo
    slices:      10,       // número de cortes horizontales
  }, window.GLITCH_CONFIG || {});

  /* ── Inyectar estilos ────────────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = `
    .glitch-overlay {
      position: fixed;
      inset: 0;
      z-index: 99998;
      pointer-events: none;
      overflow: hidden;
    }

    .glitch-slice {
      position: absolute;
      left: 0; right: 0;
      overflow: hidden;
      will-change: transform;
    }

    .glitch-slice-inner {
      position: absolute;
      inset: 0;
      background: inherit;
    }

    /* Barra de ruido estático semi-transparente */
    .glitch-noise {
      position: fixed;
      inset: 0;
      z-index: 99997;
      pointer-events: none;
      opacity: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E");
      background-size: 200px 200px;
      mix-blend-mode: overlay;
    }

    /* Línea de escáner */
    .glitch-scanbar {
      position: fixed;
      left: 0; right: 0;
      height: 3px;
      z-index: 99999;
      pointer-events: none;
      background: linear-gradient(90deg,
        transparent 0%,
        rgba(255, 45, 155, 0.9) 30%,
        rgba(0, 255, 255, 0.9) 60%,
        transparent 100%
      );
      box-shadow: 0 0 12px rgba(255,45,155,0.8), 0 0 24px rgba(0,255,255,0.5);
      opacity: 0;
      top: 0;
      will-change: top, opacity;
    }

    @keyframes glitch-scanbar-run {
      0%   { top: -4px; opacity: 0; }
      5%   { opacity: 1; }
      95%  { opacity: 1; }
      100% { top: 100%; opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  /* ── Elementos DOM ───────────────────────────────────────── */
  const overlay  = document.createElement('div');
  overlay.className = 'glitch-overlay';
  overlay.style.display = 'none';

  const noise = document.createElement('div');
  noise.className = 'glitch-noise';

  const scanbar = document.createElement('div');
  scanbar.className = 'glitch-scanbar';

  document.body.appendChild(overlay);
  document.body.appendChild(noise);
  document.body.appendChild(scanbar);

  /* ── Utilidades ──────────────────────────────────────────── */
  const rand = (min, max) => Math.random() * (max - min) + min;
  const randInt = (min, max) => Math.floor(rand(min, max));

  function captureScreen() {
    // Snapshot visual usando outline de color de fondo clonado
    return document.body.style.backgroundColor || '#0a0a0f';
  }

  /* ── Función principal de glitch ─────────────────────────── */
  function runGlitch() {
    const sliceCount = CONFIG.slices;
    const viewH = window.innerHeight;
    const sliceH = Math.floor(viewH / sliceCount);

    overlay.innerHTML = '';
    overlay.style.display = 'block';

    // Crear slices
    const slices = [];
    for (let i = 0; i < sliceCount; i++) {
      const top    = i * sliceH;
      const height = (i === sliceCount - 1) ? viewH - top : sliceH;

      const slice = document.createElement('div');
      slice.className = 'glitch-slice';
      slice.style.cssText = `
        top: ${top}px;
        height: ${height}px;
        background: transparent;
      `;
      overlay.appendChild(slice);
      slices.push(slice);
    }

    // Animar en frames rápidos
    const totalFrames = Math.floor(CONFIG.duration / 50);
    let frame = 0;

    const tick = setInterval(() => {
      frame++;

      const intensity = frame < totalFrames * 0.2 ? frame / (totalFrames * 0.2)   // fade in
                      : frame > totalFrames * 0.7 ? 1 - (frame - totalFrames * 0.7) / (totalFrames * 0.3) // fade out
                      : 1;

      slices.forEach((slice, i) => {
        const shouldGlitch = Math.random() < (0.4 + intensity * 0.4);
        if (shouldGlitch) {
          const offsetX = rand(-30, 30) * intensity;
          const skew    = rand(-2, 2) * intensity;
          const color   = Math.random() < 0.3
            ? `rgba(255,45,155,${rand(0.05, 0.15) * intensity})`
            : Math.random() < 0.5
              ? `rgba(0,255,255,${rand(0.03, 0.1) * intensity})`
              : 'transparent';

          slice.style.transform   = `translateX(${offsetX}px) skewY(${skew}deg)`;
          slice.style.background  = color;
          slice.style.opacity     = String(rand(0.7, 1));
        } else {
          slice.style.transform  = 'none';
          slice.style.background = 'transparent';
          slice.style.opacity    = '1';
        }
      });

      // Ruido
      noise.style.opacity = String(rand(0, 0.4) * intensity);

      if (frame >= totalFrames) {
        clearInterval(tick);
        overlay.style.display = 'none';
        overlay.innerHTML     = '';
        noise.style.opacity   = '0';
      }
    }, 50);

    // Barra de escáner
    scanbar.style.animation = 'none';
    scanbar.style.opacity   = '0';
    void scanbar.offsetWidth; // reflow
    scanbar.style.animation = `glitch-scanbar-run ${CONFIG.duration}ms linear forwards`;
  }

  /* ── Scheduler ───────────────────────────────────────────── */
  function schedule() {
    const delay = randInt(CONFIG.minInterval, CONFIG.maxInterval);
    setTimeout(() => {
      runGlitch();
      schedule();
    }, delay);
  }

  // Arrancar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else {
    schedule();
  }

  // API pública por si quieres lanzarlo manualmente
  window.triggerGlitch = runGlitch;

})();
