// catwaiting.js — Animación de gato SVG para estados de carga

const CAT_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 180" width="160" height="160" aria-hidden="true">

  <!-- Cola (se mueve con animación) -->
  <g class="cat-tail">
    <path d="M 72 148 Q 30 160 20 140 Q 10 120 35 115" 
          fill="none" stroke="#e8829a" stroke-width="7" stroke-linecap="round"/>
  </g>

  <!-- Cuerpo -->
  <ellipse cx="100" cy="145" rx="45" ry="32" fill="#ffb3c6"/>

  <!-- Cabeza -->
  <ellipse cx="100" cy="95" rx="38" ry="35" fill="#ffb3c6"/>

  <!-- Orejas -->
  <polygon points="68,72 60,48 82,65" fill="#ffb3c6"/>
  <polygon points="132,72 140,48 118,65" fill="#ffb3c6"/>
  <!-- Interior orejas -->
  <polygon points="70,70 64,53 80,66" fill="#ff8fab"/>
  <polygon points="130,70 136,53 120,66" fill="#ff8fab"/>

  <!-- Ojos (parpadean) -->
  <g class="cat-eyes">
    <!-- Ojo izquierdo abierto -->
    <ellipse class="eye-open" cx="87" cy="92" rx="7" ry="7.5" fill="#222"/>
    <circle cx="89" cy="90" r="2" fill="white"/>
    <!-- Ojo derecho abierto -->
    <ellipse class="eye-open" cx="113" cy="92" rx="7" ry="7.5" fill="#222"/>
    <circle cx="115" cy="90" r="2" fill="white"/>

    <!-- Ojo izquierdo cerrado (parpadeo) -->
    <path class="eye-closed" d="M 80 92 Q 87 97 94 92" fill="none" stroke="#222" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Ojo derecho cerrado (parpadeo) -->
    <path class="eye-closed" d="M 106 92 Q 113 97 120 92" fill="none" stroke="#222" stroke-width="2.5" stroke-linecap="round"/>
  </g>

  <!-- Nariz -->
  <polygon points="100,103 96,108 104,108" fill="#ff8fab"/>

  <!-- Boca -->
  <path d="M 96 108 Q 92 114 88 112" fill="none" stroke="#e8829a" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M 104 108 Q 108 114 112 112" fill="none" stroke="#e8829a" stroke-width="1.8" stroke-linecap="round"/>

  <!-- Bigotes izquierda -->
  <line x1="58" y1="104" x2="88" y2="108" stroke="#ffccd5" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="55" y1="110" x2="87" y2="111" stroke="#ffccd5" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="58" y1="116" x2="88" y2="114" stroke="#ffccd5" stroke-width="1.5" stroke-linecap="round"/>

  <!-- Bigotes derecha -->
  <line x1="142" y1="104" x2="112" y2="108" stroke="#ffccd5" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="145" y1="110" x2="113" y2="111" stroke="#ffccd5" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="142" y1="116" x2="112" y2="114" stroke="#ffccd5" stroke-width="1.5" stroke-linecap="round"/>

  <!-- Patitas -->
  <ellipse cx="80" cy="172" rx="14" ry="9" fill="#ff8fab"/>
  <ellipse cx="120" cy="172" rx="14" ry="9" fill="#ff8fab"/>
</svg>
`;

const STYLE = `
  #cat-waiting-overlay {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    gap: 20px;
    animation: fadeInCat 0.4s ease;
  }

  #cat-waiting-overlay p {
    font-size: 1.1em;
    color: #999;
    min-height: 1.6em;
    transition: opacity 0.4s ease;
  }

  /* Cola */
  .cat-tail {
    transform-origin: 72px 148px;
    animation: tailWag 1.2s ease-in-out infinite alternate;
  }

  /* Ojos: parpadeo */
  .eye-open  { animation: blink 4s ease-in-out infinite; }
  .eye-closed {
    animation: blinkClose 4s ease-in-out infinite;
    opacity: 0;
  }

  @keyframes tailWag {
    from { transform: rotate(-18deg); }
    to   { transform: rotate(18deg); }
  }

  @keyframes blink {
    0%, 90%, 100% { opacity: 1; }
    93%, 97%      { opacity: 0; }
  }

  @keyframes blinkClose {
    0%, 90%, 100% { opacity: 0; }
    93%, 97%      { opacity: 1; }
  }

  @keyframes fadeInCat {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const MESSAGES = [
  'Buscando los archivos...',
  'El gato se distrajo con un ratón...',
  'Revisando los cajones...',
  'Casi está...',
  'El gato promete que ya termina...',
];

let _messageInterval = null;

/**
 * Muestra el gato animado dentro del contenedor indicado.
 * @param {string} containerId - ID del elemento donde se mostrará
 */
export function showCatWaiting(containerId = 'procedures-container') {
  // Inyectar estilos una sola vez
  if (!document.getElementById('cat-waiting-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'cat-waiting-styles';
    styleEl.textContent = STYLE;
    document.head.appendChild(styleEl);
  }

  const container = document.getElementById(containerId);
  if (!container) return;

  const wrapper = document.createElement('div');
  wrapper.id = 'cat-waiting-overlay';
  wrapper.innerHTML = CAT_SVG + `<p>${MESSAGES[0]}</p>`;
  container.innerHTML = '';
  container.appendChild(wrapper);

  // Rotar mensajes
  let i = 1;
  _messageInterval = setInterval(() => {
    const p = wrapper.querySelector('p');
    if (p) p.textContent = MESSAGES[i % MESSAGES.length];
    i++;
  }, 2200);
}

/**
 * Elimina el gato animado del contenedor.
 */
export function hideCatWaiting() {
  clearInterval(_messageInterval);
  _messageInterval = null;
  const overlay = document.getElementById('cat-waiting-overlay');
  if (overlay) overlay.remove();
}

const PDF_MESSAGES = [
  'Procesando, espere por favor...',
  'El gato está preparando el documento...',
  'Maquetando páginas...',
  'Insertando imágenes...',
  'Ya casi está listo...',
];

const OVERLAY_STYLE = `
  #cat-pdf-overlay {
    position: fixed;
    inset: 0;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(3px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    z-index: 9999;
    animation: fadeInCat 0.3s ease;
  }

  #cat-pdf-overlay svg {
    width: 240px;
    height: 240px;
  }

  #cat-pdf-overlay p {
    font-size: 1.25em;
    color: #555;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    min-height: 1.6em;
  }

  .cat-pdf-disclaimer {
    width: min(600px, 80vw);
    text-align: center;
    font-size: 0.88em !important;
    color: #888 !important;
    line-height: 1.8;
    padding: 14px 28px;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    background: #fafafa;
    min-height: unset !important;
    text-wrap: balance;
  }

  .cat-pdf-disclaimer strong {
    display: block;
    margin-top: 6px;
    color: #666;
  }
`;

let _pdfMessageInterval = null;

/**
 * Muestra el gato en overlay a pantalla completa (para procesos largos).
 * @param {string} [disclaimer] - Texto HTML opcional que aparece encima del gato.
 */
export function showCatOverlay(disclaimer = '') {
  if (!document.getElementById('cat-waiting-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'cat-waiting-styles';
    styleEl.textContent = STYLE;
    document.head.appendChild(styleEl);
  }
  if (!document.getElementById('cat-pdf-overlay-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'cat-pdf-overlay-styles';
    styleEl.textContent = OVERLAY_STYLE;
    document.head.appendChild(styleEl);
  }

  const overlay = document.createElement('div');
  overlay.id = 'cat-pdf-overlay';
  const disclaimerHtml = disclaimer
    ? `<p class="cat-pdf-disclaimer">${disclaimer}</p>`
    : '';
  overlay.innerHTML = disclaimerHtml + CAT_SVG + `<p id="cat-pdf-message">${PDF_MESSAGES[0]}</p>`;
  document.body.appendChild(overlay);

  let i = 1;
  _pdfMessageInterval = setInterval(() => {
    const p = document.getElementById('cat-pdf-message');
    if (p) p.textContent = PDF_MESSAGES[i % PDF_MESSAGES.length];
    i++;
  }, 2200);
}

/**
 * Elimina el overlay de pantalla completa.
 */
export function hideCatOverlay() {
  clearInterval(_pdfMessageInterval);
  _pdfMessageInterval = null;
  const overlay = document.getElementById('cat-pdf-overlay');
  if (overlay) overlay.remove();
}
