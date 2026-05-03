// ──────────────────────────────────────────────
//  CONFIGURACIÓN — edita solo estas dos líneas
// ──────────────────────────────────────────────
const CURSO_CLAVE = '8899';
const CURSO_URL   = 'https://drive.google.com/drive/folders/1XmBDyVt6MMgj75spFR2Y_phSeZZJadm4?usp=sharing';
// ──────────────────────────────────────────────

let countTimer = null;

function abrirCurso() {
  document.getElementById('curso-overlay').classList.add('active');
  document.getElementById('curso-form').style.display = 'block';
  document.getElementById('curso-redirect').classList.remove('active');
  document.getElementById('curso-error').textContent = '';
  document.getElementById('curso-password').value = '';
  setTimeout(() => document.getElementById('curso-password').focus(), 80);
}

function cerrarCurso() {
  document.getElementById('curso-overlay').classList.remove('active');
  clearInterval(countTimer);
}

function cerrarSiOverlay(e) {
  if (e.target === document.getElementById('curso-overlay')) cerrarCurso();
}

function verificarClave() {
  const input = document.getElementById('curso-password').value.trim().toLowerCase();
  const clave = CURSO_CLAVE.toLowerCase();

  if (input === clave) {
    document.getElementById('curso-form').style.display = 'none';
    document.getElementById('curso-redirect').classList.add('active');
    iniciarCuentaAtras();
  } else {
    const err = document.getElementById('curso-error');
    err.textContent = '❌ Clave incorrecta. Inténtalo de nuevo.';
    document.getElementById('curso-password').value = '';
    document.getElementById('curso-password').focus();
    setTimeout(() => { err.textContent = ''; }, 3000);
  }
}

function iniciarCuentaAtras() {
  let n = 5;
  document.getElementById('curso-count').textContent = n;
  countTimer = setInterval(() => {
    n--;
    document.getElementById('curso-count').textContent = n;
    if (n <= 0) {
      clearInterval(countTimer);
      window.location.href = CURSO_URL;  // misma pestaña — no requiere gesto del usuario
    }
  }, 1000);
}

function irAhora() {
  clearInterval(countTimer);
  window.open(CURSO_URL, '_blank');  // nueva pestaña — sí es un click directo
  cerrarCurso();
}
