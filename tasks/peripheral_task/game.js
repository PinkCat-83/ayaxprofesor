/* ═══════════════════════════════════════════════════════════
   GATO SALTARÍN – game.js  (versión PNG + efectos)
═══════════════════════════════════════════════════════════ */
'use strict';

// ── CONSTANTES DEL ESCENARIO ─────────────────────────────
const VW = 800, VH = 320;

const PLATFORM_W      = 90;
const PLATFORM_Y      = 210;   // Y donde los pies del gato tocan (techo visual de plataforma)
const ROUND_WIDTH     = 660;   // distancia entre inicio plat-izq e inicio plat-der

const ROCK_CX_LOCAL   = [205, 375, 545];  // centros X centrados entre las dos plataformas
const ROCK_CY         = 240;              // base Y de las rocas (más metidas en el agua)

// Imágenes del gato con sus dimensiones de display (más pequeñas)
// Todas aterrizan con la base en y=210 (techo de plataforma)
const CAT_IMAGES = {
  idle:    { src: 'img/pinkcat_idle.png',    w: 50,  h: 70  },
  sjump:   { src: 'img/pinkcat_sjump.png',   w: 89,  h: 63  },
  fjump:   { src: 'img/pinkcat_fjump.png',   w: 88,  h: 63  },
  fanfare: { src: 'img/pinkcat_fanfare.png', w: 70,  h: 81  },
  water:   { src: 'img/pinkcat_water.png',   w: 54,  h: 70  },
};

// Y del transform del gato (esquina superior): pies en PLATFORM_Y=210
const CAT_Y_STAND = PLATFORM_Y - CAT_IMAGES.idle.h;  // 140

// Y del gato parado sobre la cima de una roca
// Roca: base en ROCK_CY=240, imagen arranca en y=-48 → cima en 240-48=192
// +15 extra para que el gato quede bien posado visualmente sobre la roca
// +7% de la altura del gato extra → simula que "pisa" la roca al aterrizar
const CAT_Y_ROCK  = 192 - CAT_IMAGES.idle.h + 15 + Math.round(CAT_IMAGES.idle.h * 0.07);   // ~142

// X del gato centrado sobre una plataforma de ancho PLATFORM_W
function catXforImage(imgKey) {
  return Math.round((PLATFORM_W - CAT_IMAGES[imgKey].w) / 2);
}

const CAT_START_LOCAL = catXforImage('idle');   // X local sobre plat-izq
const CAT_GOAL_LOCAL  = catXforImage('idle');   // X local sobre plat-der

// ── ESTADO ───────────────────────────────────────────────
const state = {
  perifericos: [],
  orden: [],
  indexActual: 0,
  vidas: 1, vidasMax: 1, nivel: 1,
  bloqueado: false,
  worldOffset: 0,
  catWorldX: CAT_START_LOCAL,
  catWorldY: CAT_Y_STAND,
  catImgKey: 'idle',
  respuestaCorrecta: '',
  opcionesActuales: [],
  rondaEnCurso: 0,
  animEnabled: true,
  soundEnabled: true,
};

// ── DOM REFS ─────────────────────────────────────────────
const $ = id => document.getElementById(id);
const screens = {
  menu:     $('screen-menu'),
  game:     $('screen-game'),
  victory:  $('screen-victory'),
  gameover: $('screen-gameover'),
};
const hudLives      = $('hud-lives');
const hudProgress   = $('hud-progress');
const peripheralLbl = $('peripheral-label');
const feedbackMsg   = $('feedback-msg');
const catEl         = $('cat');
const catMirror     = $('cat-mirror');
const catImg        = $('cat-img');
const worldGroup    = $('world-group');
const fireworksLayer = $('fireworks-layer');

const rockGroups = [$('rock0'), $('rock1'), $('rock2')];
const rockLabels = rockGroups.map(g => g.querySelector('.rock-label'));

// ── AUDIO ─────────────────────────────────────────────────
const audio = {
  jump:     $('snd-jump'),
  victory:  $('snd-victory'),
  splash:   $('snd-splash'),
  gameover: $('snd-gameover'),
  fanfare:  $('snd-fanfare'),
};
function playSound(k) {
  if (!state.soundEnabled) return;
  try {
    const a = audio[k];
    if (!a) return;
    a.currentTime = 0;
    a.play().catch(() => {});
  } catch(e) {}
}
function stopSound(k) {
  try { const a = audio[k]; if (a) { a.pause(); a.currentTime = 0; } } catch(e) {}
}

// ── TOGGLES ───────────────────────────────────────────────

$('btn-toggle-sound').addEventListener('click', () => {
  state.soundEnabled = !state.soundEnabled;
  $('btn-toggle-sound').classList.toggle('active', state.soundEnabled);
  if (!state.soundEnabled) stopSound('fanfare');
});

// ── PANTALLAS ─────────────────────────────────────────────
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

// ── CARGA DE DATOS ────────────────────────────────────────
async function cargarPerifericos() {
  try {
    const r = await fetch('perifericos.json');
    if (!r.ok) throw new Error('HTTP ' + r.status);
    state.perifericos = await r.json();
  } catch(e) {
    document.body.innerHTML = `
      <div style="
        display:flex; flex-direction:column; align-items:center; justify-content:center;
        height:100vh; font-family:'Nunito',sans-serif; background:#fce7f3; gap:1rem;
        text-align:center; padding:2rem;">
        <div style="font-size:3rem">😿</div>
        <h2 style="font-size:1.6rem; color:#be185d; margin:0">No se pudo cargar el juego</h2>
        <p style="color:#4c1d95; font-weight:600; max-width:360px; margin:0">
          No se encontró el archivo <code>perifericos.json</code>.<br>
          Asegúrate de que existe en la misma carpeta que este HTML.
        </p>
        <p style="color:#78716c; font-size:0.85rem; margin:0">Error: ${e.message}</p>
        <button onclick="location.reload()" style="
          margin-top:0.5rem; padding:0.6rem 1.8rem; border:none; border-radius:50px;
          background:#be185d; color:white; font-family:'Nunito',sans-serif;
          font-weight:800; font-size:1rem; cursor:pointer;">
          Reintentar
        </button>
      </div>`;
  }
}

// ── INICIO DEL JUEGO ──────────────────────────────────────
function iniciarJuego(nivel) {
  stopFireworks();
  stopSound('fanfare');
  state.nivel        = nivel;
  state.vidasMax     = nivel === 1 ? 1 : 3;
  state.vidas        = state.vidasMax;
  state.indexActual  = 0;
  state.bloqueado    = false;
  state.rondaEnCurso = 0;
  state.worldOffset  = 0;
  state.catWorldX    = CAT_START_LOCAL;
  state.catWorldY    = CAT_Y_STAND;

  state.orden = mezclar([...Array(state.perifericos.length).keys()]);

  resetWorldLayout();
  aplicarCamara(0);
  // ╔══════════════════════════════════════════╗
  // ║  GATO: idle — espera en plataforma izq.  ║
  // ╚══════════════════════════════════════════╝
  setCatState('idle');
  mostrarPregunta();
  actualizarHUD();
  showScreen('game');
}

// ── IMAGEN Y ANIMACIÓN DEL GATO ───────────────────────────
// delay (opcional): si se indica, ejecuta el cambio después de ese tiempo en ms.
//   setCatState('idle')        → instantáneo
//   setCatState('fjump', 400)  → cambia tras 400ms
function setCatState(key, delay) {
  if (delay) {
    setTimeout(() => setCatState(key), delay);
    return;
  }
  state.catImgKey = key;
  const img = CAT_IMAGES[key];
  catImg.setAttribute('href', img.src);
  catImg.setAttribute('width',  img.w);
  catImg.setAttribute('height', img.h);
  catImg.setAttribute('x', 0);
  catImg.setAttribute('y', 0);
  applyCatAnimClasses();
  setCatSVG();
}

function applyCatAnimClasses() {
  const key = state.catImgKey;
  // Quitar clases primero, cambiar src de imagen, luego reflow, luego añadir clases nuevas
  // Así el navegador no hereda el estado de animación anterior
  catEl.classList.remove('breathe', 'mirror', 'sinking');
  catMirror.classList.remove('sinking-mirror');
  // Reflow forzado: interrumpe cualquier animación CSS en curso
  void catEl.offsetHeight;
  if (!state.animEnabled) return;
  if (key === 'idle') catEl.classList.add('breathe');
  if (key === 'fanfare') { catEl.classList.add('breathe'); catEl.classList.add('mirror'); }
  if (key === 'water') {
    catEl.classList.add('sinking');
    catMirror.classList.add('sinking-mirror');
  }
}

// ── LAYOUT DEL MUNDO ──────────────────────────────────────
function resetWorldLayout() {
  const off = state.worldOffset;

  $('plat-left').setAttribute('transform',  `translate(${off},0)`);
  $('plat-right').setAttribute('transform', `translate(${off + ROUND_WIDTH},0)`);

  rockGroups.forEach((g, i) => {
    g.setAttribute('transform',
      `translate(${off + ROCK_CX_LOCAL[i]},${ROCK_CY})`);
    g.classList.remove('correct', 'incorrect');
    g.style.visibility = '';   // ← siempre restaurar visibilidad
  });

}

// ── CÁMARA ────────────────────────────────────────────────
function aplicarCamara(camX) {
  worldGroup.setAttribute('transform', `translate(${-camX},0)`);
}

function getCamXActual() {
  const t = worldGroup.getAttribute('transform') || 'translate(0,0)';
  const m = t.match(/translate\(([^,]+)/);
  return m ? -parseFloat(m[1]) : 0;
}

function camXParaRonda() {
  return state.worldOffset;
}

// ── POSICIÓN GATO SVG ─────────────────────────────────────
// catWorldX = X del borde izquierdo de la imagen del gato en coords de mundo.
// La imagen tiene ancho variable según el estado.
function setCatSVG() {
  const camX = getCamXActual();
  const sx = state.catWorldX - camX;
  catEl.setAttribute('transform',
    `translate(${sx.toFixed(1)},${state.catWorldY.toFixed(1)})`);
}

// ── HUD ───────────────────────────────────────────────────
function actualizarHUD() {
  hudLives.innerHTML = '';
  for (let i = 0; i < state.vidasMax; i++) {
    const s = document.createElement('span');
    s.textContent = i < state.vidas ? '🐱' : '💀';
    hudLives.appendChild(s);
  }
  hudProgress.textContent =
    `Periférico ${state.indexActual + 1} / ${state.perifericos.length}`;
}

// ── MOSTRAR PREGUNTA ──────────────────────────────────────
function mostrarPregunta() {
  state.bloqueado = false;
  const p = state.perifericos[state.orden[state.indexActual]];

  peripheralLbl.style.animation = 'none';
  peripheralLbl.offsetHeight;
  peripheralLbl.style.animation = '';
  peripheralLbl.textContent = p.nombre;

  const opciones = mezclar(['Entrada', 'Salida', 'Ambas']);

  rockGroups.forEach((g, i) => {
    g.classList.remove('correct', 'incorrect');
    g.style.visibility = '';          // ← siempre restaurar aquí
    rockLabels[i].textContent = opciones[i];
  });

  state.respuestaCorrecta = p.respuesta;
  state.opcionesActuales  = opciones;
}

// ── CLICK EN ROCA ─────────────────────────────────────────
rockGroups.forEach((g, i) => g.addEventListener('click', () => manejarClick(i)));

function manejarClick(indiceRoca) {
  if (state.bloqueado) return;
  state.bloqueado = true;

  const elegida = state.opcionesActuales[indiceRoca];
  const correcta = elegida === state.respuestaCorrecta;
  const indiceCorrectoRoca = state.opcionesActuales.indexOf(state.respuestaCorrecta);

  if (correcta) {
    rockGroups[indiceRoca].classList.add('correct');
    mostrarFeedback('✓ ¡Correcto!', true);
    playSound('jump');

    const rocaWorldX = state.worldOffset + ROCK_CX_LOCAL[indiceCorrectoRoca];
    const goalWorldX = state.worldOffset + ROUND_WIDTH + CAT_GOAL_LOCAL;
    const rocaLandX  = rocaWorldX - Math.round(CAT_IMAGES.fjump.w / 2);

    // Salto 1: plataforma → roca (sjump/fjump controlado por animarSalto)
    setCatState('sjump');  // frame inicial antes del primer tick
    animarSalto(rocaLandX, CAT_Y_ROCK, () => {

      // Salto 2: roca → plataforma derecha
      setTimeout(() => {
        animarSalto(goalWorldX, CAT_Y_STAND, () => {
          setTimeout(() => {
            // ╔══════════════════════════════════════════════════════════╗
            // ║  GATO: idle — reposa en plat. derecha, avanza ronda    ║
            // ╚══════════════════════════════════════════════════════════╝
            setCatState('idle');
            ocultarFeedback();
            state.indexActual++;
            if (state.indexActual >= state.perifericos.length) {
              setTimeout(() => victoria(), 400);
            } else {
              setTimeout(() => scrollAndNextRound(), 300);
            }
          }, 300);
        });
      }, 350);
    });

  } else {
    rockGroups[indiceRoca].classList.add('incorrect');
    rockGroups[indiceCorrectoRoca].classList.add('correct');
    mostrarFeedback('✗ ¡Al agua!', false);
    playSound('splash');

    const rocaEquivocadaWorldX = state.worldOffset + ROCK_CX_LOCAL[indiceRoca];
    const rocaLandX = rocaEquivocadaWorldX - Math.round(CAT_IMAGES.fjump.w / 2);

    // Salto hacia la roca equivocada (sjump/fjump controlado por animarSalto)
    setCatState('sjump');  // frame inicial antes del primer tick
    animarSalto(rocaLandX, CAT_Y_ROCK, () => {
      // La roca equivocada desaparece bajo el gato
      setTimeout(() => {
        rockGroups[indiceRoca].style.visibility = 'hidden';
        // ╔══════════════════════════════════════════════════════════╗
        // ║  GATO: water — cae al agua, animación de hundimiento   ║
        // ╚══════════════════════════════════════════════════════════╝
        setCatState('water');
        setTimeout(() => {
          ocultarFeedback();
          state.vidas--;
          actualizarHUD();
          if (state.vidas <= 0) {
            playSound('gameover');
            setTimeout(() => gameOver(), 800);
          } else {
            setTimeout(() => {
              state.catWorldX = state.worldOffset + CAT_START_LOCAL;
              state.catWorldY = CAT_Y_STAND;
              aplicarCamara(camXParaRonda());
              // ╔══════════════════════════════════════════════════════════╗
              // ║  GATO: idle — vuelve a plataforma izq. tras caer       ║
              // ╚══════════════════════════════════════════════════════════╝
              setCatState('idle');
              mostrarPregunta();  // ← restaura visibilidad de rocas aquí
            }, 1200);
          }
        }, 1800);  // esperar a que la animación CSS de hundimiento termine
      }, 250);
    });
  }
}

// ── SCROLL Y NUEVA RONDA ──────────────────────────────────
function scrollAndNextRound() {
  state.rondaEnCurso++;
  state.worldOffset = state.rondaEnCurso * ROUND_WIDTH;

  resetWorldLayout();

  state.catWorldX = state.worldOffset + CAT_START_LOCAL;
  state.catWorldY = CAT_Y_STAND;

  const camXActual  = getCamXActual();
  const camXDestino = camXParaRonda();

  animarCamara(camXActual, camXDestino, () => {
    // ╔═════════════════════════════════════════════════════╗
    // ║  GATO: idle — scroll terminado, nueva plataforma   ║
    // ╚═════════════════════════════════════════════════════╝
    setCatState('idle');
    actualizarHUD();
    mostrarPregunta();
  });
}

// ── ANIMACIÓN DE CÁMARA ───────────────────────────────────
function animarCamara(startCamX, targetCamX, onComplete) {
  const duracion  = 600;
  const pasos     = 40;
  const intervalo = duracion / pasos;
  let paso = 0;

  const timer = setInterval(() => {
    paso++;
    const t    = easeInOut(paso / pasos);
    const camX = startCamX + (targetCamX - startCamX) * t;
    aplicarCamara(camX);

    const sx = state.catWorldX - camX;
    catEl.setAttribute('transform',
      `translate(${sx.toFixed(1)},${state.catWorldY.toFixed(1)})`);

    if (paso >= pasos) {
      clearInterval(timer);
      aplicarCamara(targetCamX);
      if (onComplete) onComplete();
    }
  }, intervalo);
}

// ── ANIMACIÓN DE SALTO ────────────────────────────────────
// El propio salto controla el PNG: sjump mientras sube (t<0.5), fjump mientras baja (t>=0.5)
function animarSalto(destWorldX, destWorldY, onComplete) {
  const duracion  = 480;
  const pasos     = 28;
  const intervalo = duracion / pasos;
  const startX    = state.catWorldX;
  const startY    = state.catWorldY;
  let paso = 0;

  const timer = setInterval(() => {
    paso++;
    const t = paso / pasos;

    // El propio salto controla el PNG
    if (t < 0.5) setCatState('sjump');
    else          setCatState('fjump');

    state.catWorldX = startX + (destWorldX - startX) * t;
    const arcH = Math.abs(destWorldX - startX) * 0.35;
    state.catWorldY = startY - Math.sin(t * Math.PI) * Math.min(arcH, 90);
    setCatSVG();

    if (paso >= pasos) {
      clearInterval(timer);
      state.catWorldX = destWorldX;
      state.catWorldY = destWorldY;
      setCatSVG();
      if (onComplete) onComplete();
    }
  }, intervalo);
}

// ── ANIMACIÓN CAÍDA AL AGUA ───────────────────────────────
// Solo lleva al gato hasta la superficie del agua con una pequeña caída;
// el grueso del hundimiento lo hace CSS (.sinking) sobre la <image>.
function animarCaida(onComplete) {
  const duracion  = 350;
  const pasos     = 20;
  const intervalo = duracion / pasos;
  const startX    = state.catWorldX;
  const startY    = state.catWorldY;
  const targetY   = ROCK_CY - CAT_IMAGES.water.h + 10; // justo en la línea del agua
  let paso = 0;

  const timer = setInterval(() => {
    paso++;
    const t = paso / pasos;
    // easeIn: empieza despacio, acelera
    const ease = t * t;
    state.catWorldX = startX + ease * 8;
    state.catWorldY = startY + ease * (targetY - startY);
    setCatSVG();
    if (paso >= pasos) {
      clearInterval(timer);
      if (onComplete) onComplete();
    }
  }, intervalo);
}



// ── FUEGOS ARTIFICIALES ───────────────────────────────────
let fireworkInterval = null;

function startFireworks() {
  if (!state.animEnabled) return;
  spawnFirework();
  fireworkInterval = setInterval(spawnFirework, 800);
}

function stopFireworks() {
  if (fireworkInterval) { clearInterval(fireworkInterval); fireworkInterval = null; }
  fireworksLayer.innerHTML = '';
}

function spawnFirework() {
  const cx = 80 + Math.random() * 640;
  const cy = 30 + Math.random() * 120;
  const colors = ['#fcd34d','#f9a8d4','#86efac','#93c5fd','#fb7185','#c4b5fd'];
  const color  = colors[Math.floor(Math.random() * colors.length)];
  const count  = 12 + Math.floor(Math.random() * 8);

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const dist  = 20 + Math.random() * 30;
    const ex    = cx + Math.cos(angle) * dist;
    const ey    = cy + Math.sin(angle) * dist;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', cx);
    line.setAttribute('y1', cy);
    line.setAttribute('x2', ex.toFixed(1));
    line.setAttribute('y2', ey.toFixed(1));
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', '2.5');
    line.setAttribute('stroke-linecap', 'round');
    line.classList.add('firework-particle');
    fireworksLayer.appendChild(line);
    setTimeout(() => line.remove(), 950);
  }

  // Núcleo brillante
  const core = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  core.setAttribute('cx', cx);
  core.setAttribute('cy', cy);
  core.setAttribute('r', '4');
  core.setAttribute('fill', 'white');
  core.classList.add('firework-particle');
  fireworksLayer.appendChild(core);
  setTimeout(() => core.remove(), 950);
}

// ── FEEDBACK ──────────────────────────────────────────────
function mostrarFeedback(msg, ok) {
  feedbackMsg.textContent = msg;
  feedbackMsg.className   = 'show ' + (ok ? 'correct-msg' : 'wrong-msg');
}
function ocultarFeedback() { feedbackMsg.className = ''; }

// ── FIN DE PARTIDA ────────────────────────────────────────
function victoria() {
  stopFireworks();
  ocultarFeedback();
  // ╔══════════════════════════════════════════════════════════╗
  // ║  GATO: fanfare — celebración con copa, bucle hasta clic ║
  // ╚══════════════════════════════════════════════════════════╝
  setCatState('fanfare');
  playSound('fanfare');
  startFireworks();
  $('victory-text').textContent =
    `¡Has superado los ${state.perifericos.length} periféricos!`;
  // El clic en cualquier punto de la pantalla de juego lleva a la pantalla de victoria
  const irAVictoria = () => {
    screens.game.removeEventListener('click', irAVictoria);
    stopFireworks();
    stopSound('fanfare');
    showScreen('victory');
  };
  // Pequeño delay para evitar que el clic que disparó la última roca cuente
  setTimeout(() => {
    screens.game.addEventListener('click', irAVictoria);
  }, 600);
}

function gameOver() {
  $('gameover-text').textContent =
    'El gato se ha caído. ¡Inténtalo de nuevo!';
  showScreen('gameover');
}

// ── UTILIDADES ────────────────────────────────────────────
function mezclar(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

// ── BOTONES ───────────────────────────────────────────────
$('btn-nivel1').addEventListener('click', () => iniciarJuego(1));
$('btn-nivel2').addEventListener('click', () => iniciarJuego(2));
$('btn-menu-hud').addEventListener('click', () => { stopFireworks(); stopSound('fanfare'); showScreen('menu'); });
$('btn-play-again').addEventListener('click', () => iniciarJuego(state.nivel));
$('btn-menu-victory').addEventListener('click', () => { stopFireworks(); stopSound('fanfare'); showScreen('menu'); });
$('btn-retry').addEventListener('click', () => iniciarJuego(state.nivel));
$('btn-menu-gameover').addEventListener('click', () => showScreen('menu'));

// ── ARRANQUE ──────────────────────────────────────────────
(async () => {
  await cargarPerifericos();
  showScreen('menu');
})();
