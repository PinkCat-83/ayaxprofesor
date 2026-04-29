/**
 * mobile-warning.js
 *
 * Muestra un overlay de aviso cuando la pantalla es inferior a BREAKPOINT px.
 * Si el usuario elige "entrar igualmente", se guarda en sessionStorage
 * para no volver a molestar durante esa sesión.
 *
 * Uso: incluir el <link> al CSS y este <script> en cualquier página.
 * El overlay se inyecta automáticamente; no hace falta HTML extra.
 */

(function () {
  const BREAKPOINT = 1024; // px — pantalla considerada "pequeña"
  const SESSION_KEY = 'mw_dismissed';

  // Si el usuario ya lo descartó en esta sesión, no hacer nada
  if (sessionStorage.getItem(SESSION_KEY)) return;

  // Solo actuar si la pantalla es pequeña
  if (window.innerWidth >= BREAKPOINT) return;

  // ── Inyectar el HTML del overlay ──────────────────────────────
  const overlay = document.createElement('div');
  overlay.id = 'mobile-warning-overlay';
  overlay.innerHTML = `
    <div class="mw-box">
      <span class="mw-icon">🐱</span>
      <h2 class="mw-title">Pantalla pequeña detectada</h2>
      <p class="mw-text">
        Esta página está diseñada para usarse en un
        <strong>ordenador o pantalla grande</strong>.<br><br>
        En pantallas pequeñas algunas actividades pueden no
        mostrarse correctamente o ser difíciles de usar.
      </p>
      <div class="mw-actions">
        <button class="mw-btn-enter" id="mw-btn-enter">
          Entrar igualmente →
        </button>
      </div>
      <p class="mw-note">Esta advertencia no volverá a aparecer en esta sesión.</p>
    </div>
  `;

  // Añadir al DOM en cuanto el body esté disponible
  function mount() {
    document.body.appendChild(overlay);
    // Forzar reflow antes de añadir .active para que la animación funcione
    requestAnimationFrame(() => overlay.classList.add('active'));

    // Botón: entrar igualmente
    document.getElementById('mw-btn-enter').addEventListener('click', function () {
      sessionStorage.setItem(SESSION_KEY, '1');
      overlay.classList.remove('active');
      // Pequeño delay para que se vea la transición de cierre
      setTimeout(() => overlay.remove(), 300);
    });
  }

  if (document.body) {
    mount();
  } else {
    document.addEventListener('DOMContentLoaded', mount);
  }
})();
