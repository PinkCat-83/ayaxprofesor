// ─── Datos ────────────────────────────────────────────────────────────────────
let extensionsData = {};
let wikipediaLinks = {};
let levelConfig    = {};

// ─── Estado del juego ─────────────────────────────────────────────────────────
let currentLevel   = 1;
let lives          = 3;
let currentPairs   = {};
let newLevelExts   = [];

// ─── Estado del arrastre ──────────────────────────────────────────────────────
let dragState = null;
/*  dragState = {
      sourceBox   : HTMLElement,   // caja de origen
      sourceKey   : string,        // ext o desc según el lado
      sourceType  : 'ext'|'desc',
      startX, startY : number,     // centro del origen (coords del canvas)
      currentX, currentY : number  // punta de la flecha (sigue al ratón)
    }
*/

// Flechas permanentes de aciertos [ { x1,y1,x2,y2 } ]
let permanentArrows = [];

// ─── Canvas ───────────────────────────────────────────────────────────────────
let canvas, ctx;

// ─── Sonido ───────────────────────────────────────────────────────────────────
const audioCtx  = new (window.AudioContext || window.webkitAudioContext)();
let soundEnabled = true;

// ─── Carga inicial ────────────────────────────────────────────────────────────
fetch('json/data.json')
  .then(res => {
    if (!res.ok) throw new Error('No se pudo cargar data.json');
    return res.json();
  })
  .then(data => {
    extensionsData = data.levels;
    wikipediaLinks = data.links;
    levelConfig    = data.config;
    buildMenu();
  })
  .catch(err => {
    console.error('Error cargando data.json:', err);
    document.body.innerHTML =
      '<p style="color:white;text-align:center;padding:2em">Error al cargar los datos. Comprueba que data.json existe y es accesible.</p>';
  });

// ─── Menú dinámico ────────────────────────────────────────────────────────────
function buildMenu() {
  const selector = document.querySelector('.difficulty-selector');
  selector.innerHTML = '<h2>Selecciona la Dificultad</h2>';

  const levelNames = {
    1: 'Básico', 2: 'Intermedio', 3: 'Avanzado',
    4: 'Power User', 5: 'Developer', 6: 'Legado Retro'
  };

  Object.keys(extensionsData).forEach(level => {
    const btn = document.createElement('button');
    btn.className   = 'difficulty-btn';
    btn.textContent = `Nivel ${level}: ${levelNames[level] || 'Nivel ' + level}`;
    btn.onclick     = () => startGame(Number(level));
    selector.appendChild(btn);
  });
}

// ─── Sonido ───────────────────────────────────────────────────────────────────
function toggleSound() {
  soundEnabled = !soundEnabled;
  document.getElementById('soundToggle').textContent = soundEnabled ? '🔊' : '🔇';
}

function playSound(type) {
  if (!soundEnabled) return;
  const osc  = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  const t = audioCtx.currentTime;

  switch (type) {
    case 'click':
      osc.frequency.value = 800;
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
      osc.start(t); osc.stop(t + 0.1);
      break;
    case 'success':
      osc.frequency.value = 523.25;
      gain.gain.setValueAtTime(0.2, t);
      osc.frequency.exponentialRampToValueAtTime(783.99, t + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
      osc.start(t); osc.stop(t + 0.3);
      break;
    case 'error':
      osc.frequency.value = 200;
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
      osc.start(t); osc.stop(t + 0.2);
      break;
  }
}

// ─── Juego ────────────────────────────────────────────────────────────────────
function startGame(level) {
  playSound('click');
  currentLevel   = level;
  lives          = levelConfig[level].lives;
  permanentArrows = [];

  document.getElementById('menu').style.display = 'none';
  document.getElementById('game').style.display = 'block';
  document.getElementById('level').textContent        = level;
  document.getElementById('lives').textContent        = lives;

  generatePairs();
}

function generatePairs() {
  const config = levelConfig[currentLevel];
  let pool = {};
  newLevelExts = [];

  let previousLevelExts = [];
  for (let i = 1; i < currentLevel; i++)
    previousLevelExts = previousLevelExts.concat(Object.keys(extensionsData[i]));

  const selectedNew = shuffle(Object.keys(extensionsData[currentLevel])).slice(0, config.minNew);
  selectedNew.forEach(ext => { pool[ext] = extensionsData[currentLevel][ext]; newLevelExts.push(ext); });

  const remainingSlots   = config.pairs - config.minNew;
  const shuffledPrevious = shuffle(previousLevelExts).slice(0, remainingSlots);
  shuffledPrevious.forEach(ext => {
    for (let i = 1; i < currentLevel; i++) {
      if (extensionsData[i][ext]) { pool[ext] = extensionsData[i][ext]; break; }
    }
  });

  currentPairs = pool;
  displayPairs();
}

function displayPairs() {
  permanentArrows = [];

  const extsDiv  = document.getElementById('extensions');
  const descsDiv = document.getElementById('descriptions');
  extsDiv.innerHTML  = '';
  descsDiv.innerHTML = '';

  const exts  = shuffle(Object.keys(currentPairs));
  const descs = shuffle(Object.values(currentPairs));

  exts.forEach(ext => {
    const box = document.createElement('div');
    box.className    = 'extension-box' + (newLevelExts.includes(ext) ? ' new-level' : '');
    box.textContent  = '.' + ext;
    box.dataset.ext  = ext;
    box.dataset.side = 'ext';
    attachDragHandlers(box);
    extsDiv.appendChild(box);
  });

  descs.forEach(desc => {
    const box = document.createElement('div');
    box.className     = 'description-box';
    box.textContent   = desc;
    box.dataset.desc  = desc;
    box.dataset.side  = 'desc';
    attachDragHandlers(box);
    descsDiv.appendChild(box);
  });

  // Configurar canvas
  initCanvas();
}

// ─── Canvas ───────────────────────────────────────────────────────────────────
function initCanvas() {
  canvas = document.getElementById('arrowCanvas');
  ctx    = canvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  redraw();
}

function resizeCanvas() {
  const area  = document.getElementById('gameArea');
  const rect  = area.getBoundingClientRect();
  canvas.width  = rect.width;
  canvas.height = rect.height;
  redraw();
}

/** Convierte coordenadas de página a coordenadas del canvas */
function toCanvas(pageX, pageY) {
  const rect = canvas.getBoundingClientRect();
  return { x: pageX - rect.left, y: pageY - rect.top };
}

/** Centro de una caja en coordenadas de canvas.
 *  side: 'right' dibuja desde el borde derecho, 'left' desde el borde izquierdo. */
function boxAnchor(box, side) {
  const boxRect    = box.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();
  const y = boxRect.top + boxRect.height / 2 - canvasRect.top;
  if (side === 'right') return { x: boxRect.right  - canvasRect.left, y };
  if (side === 'left')  return { x: boxRect.left   - canvasRect.left, y };
  // centro
  return { x: boxRect.left + boxRect.width / 2 - canvasRect.left, y };
}

function drawArrow(x1, y1, x2, y2, color, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.fillStyle   = color;
  ctx.lineWidth   = 4;
  ctx.lineCap     = 'round';

  // Línea
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  // Punta
  const angle  = Math.atan2(y2 - y1, x2 - x1);
  const tipLen = 14;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - tipLen * Math.cos(angle - 0.4), y2 - tipLen * Math.sin(angle - 0.4));
  ctx.lineTo(x2 - tipLen * Math.cos(angle + 0.4), y2 - tipLen * Math.sin(angle + 0.4));
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function redraw() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Flechas permanentes de aciertos
  permanentArrows.forEach(a => drawArrow(a.x1, a.y1, a.x2, a.y2, '#4CAF50'));

  // Flecha en curso
  if (dragState) {
    drawArrow(dragState.startX, dragState.startY,
              dragState.currentX, dragState.currentY,
              'rgba(0,0,0,0.85)');
  }
}

// ─── Drag handlers ────────────────────────────────────────────────────────────
function attachDragHandlers(box) {
  // Mouse
  box.addEventListener('mousedown', e => onDragStart(e, box, e.clientX, e.clientY));
  // Touch
  box.addEventListener('touchstart', e => {
    e.preventDefault();
    const t = e.touches[0];
    onDragStart(e, box, t.clientX, t.clientY);
  }, { passive: false });
}

function onDragStart(e, box, clientX, clientY) {
  if (box.classList.contains('matched')) return;
  playSound('click');

  const side     = box.dataset.side; // 'ext' | 'desc'
  // Anchor: si es ext (izquierda) salimos por la derecha; si es desc (derecha) salimos por la izquierda
  const anchorSide = side === 'ext' ? 'right' : 'left';
  const anchor     = boxAnchor(box, anchorSide);

  dragState = {
    sourceBox:  box,
    sourceKey:  side === 'ext' ? box.dataset.ext : box.dataset.desc,
    sourceType: side,
    startX: anchor.x,
    startY: anchor.y,
    currentX: anchor.x,
    currentY: anchor.y,
  };

  box.classList.add('drag-source');

  // Registrar listeners globales
  document.addEventListener('mousemove', onDragMove);
  document.addEventListener('mouseup',   onDragEnd);
  document.addEventListener('touchmove', onDragMoveTouch, { passive: false });
  document.addEventListener('touchend',  onDragEndTouch);
}

function onDragMove(e) {
  moveDrag(e.clientX, e.clientY);
}
function onDragMoveTouch(e) {
  e.preventDefault();
  moveDrag(e.touches[0].clientX, e.touches[0].clientY);
}

function moveDrag(clientX, clientY) {
  if (!dragState) return;
  const pos = toCanvas(clientX, clientY);
  dragState.currentX = pos.x;
  dragState.currentY = pos.y;

  // Highlight del elemento bajo el cursor
  highlightTarget(clientX, clientY);
  redraw();
}

function onDragEnd(e)      { endDrag(e.clientX, e.clientY); }
function onDragEndTouch(e) {
  const t = e.changedTouches[0];
  endDrag(t.clientX, t.clientY);
}

function endDrag(clientX, clientY) {
  if (!dragState) return;

  clearDragListeners();
  clearHighlights();
  dragState.sourceBox.classList.remove('drag-source');

  const target = getTargetAt(clientX, clientY);

  if (target && !target.classList.contains('matched') && target !== dragState.sourceBox) {
    handleDrop(target);
  } else {
    // Soltar en vacío → animar retroceso de la flecha
    animateRetract();
  }
}

function clearDragListeners() {
  document.removeEventListener('mousemove', onDragMove);
  document.removeEventListener('mouseup',   onDragEnd);
  document.removeEventListener('touchmove', onDragMoveTouch);
  document.removeEventListener('touchend',  onDragEndTouch);
}

// ─── Drop ─────────────────────────────────────────────────────────────────────
function handleDrop(targetBox) {
  const targetType = targetBox.dataset.side;

  // Ambos lados deben ser distintos (ext ↔ desc)
  if (targetType === dragState.sourceType) {
    animateRetract();
    return;
  }

  const extBox  = dragState.sourceType === 'ext' ? dragState.sourceBox : targetBox;
  const descBox = dragState.sourceType === 'ext' ? targetBox : dragState.sourceBox;
  const ext     = extBox.dataset.ext;
  const desc    = descBox.dataset.desc;

  if (currentPairs[ext] === desc) {
    // ✅ Acierto
    playSound('success');

    // Guardar flecha permanente
    const a1 = boxAnchor(extBox,  'right');
    const a2 = boxAnchor(descBox, 'left');
    permanentArrows.push({ x1: a1.x, y1: a1.y, x2: a2.x, y2: a2.y });

    extBox.classList.add('matched');
    descBox.classList.add('matched');

    delete currentPairs[ext];

    dragState = null;
    redraw();

    if (Object.keys(currentPairs).length === 0)
      setTimeout(showVictory, 500);

  } else {
    // ❌ Error: flecha roja breve y desaparece
    playSound('error');
    lives--;
    document.getElementById('lives').textContent = lives;

    const a1 = boxAnchor(dragState.sourceType === 'ext' ? extBox : descBox,
                          dragState.sourceType === 'ext' ? 'right' : 'left');
    const a2 = boxAnchor(dragState.sourceType === 'ext' ? descBox : extBox,
                          dragState.sourceType === 'ext' ? 'left'  : 'right');

    dragState = null;
    animateErrorArrow(a1.x, a1.y, a2.x, a2.y);

    if (lives === 0) setTimeout(showGameOver, 600);
  }
}

// ─── Animaciones de flecha ────────────────────────────────────────────────────

/** Retroceso: la punta viaja de vuelta al origen */
function animateRetract() {
  if (!dragState) return;
  const { startX, startY, currentX, currentY } = dragState;
  const duration = 300; // ms
  const start    = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - (1 - progress) ** 3; // ease-out cubic

    const tipX = currentX + (startX - currentX) * eased;
    const tipY = currentY + (startY - currentY) * eased;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    permanentArrows.forEach(a => drawArrow(a.x1, a.y1, a.x2, a.y2, '#4CAF50'));

    if (progress < 1) {
      drawArrow(startX, startY, tipX, tipY, 'rgba(0,0,0,0.85)');
      requestAnimationFrame(step);
    } else {
      dragState = null;
      redraw();
    }
  }
  requestAnimationFrame(step);
}

/** Flecha roja que aparece y se desvanece */
function animateErrorArrow(x1, y1, x2, y2) {
  const duration = 500;
  const start    = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const alpha    = 1 - progress;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    permanentArrows.forEach(a => drawArrow(a.x1, a.y1, a.x2, a.y2, '#4CAF50'));
    drawArrow(x1, y1, x2, y2, `rgba(255,80,80,${alpha})`);

    if (progress < 1) requestAnimationFrame(step);
    else redraw();
  }
  requestAnimationFrame(step);
}

// ─── Helpers de highlight ─────────────────────────────────────────────────────
function getTargetAt(clientX, clientY) {
  const elements = document.elementsFromPoint(clientX, clientY);
  return elements.find(el =>
    (el.classList.contains('extension-box') || el.classList.contains('description-box')) &&
    el !== dragState?.sourceBox
  ) || null;
}

function highlightTarget(clientX, clientY) {
  clearHighlights();
  const target = getTargetAt(clientX, clientY);
  if (target && !target.classList.contains('matched')) target.classList.add('drag-over');
}

function clearHighlights() {
  document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
}

// ─── UI ───────────────────────────────────────────────────────────────────────
function showVictory() {
  playSound('success');
  document.getElementById('victoryModal').style.display = 'flex';
  createFireworks();
}

function showGameOver() {
  playSound('error');
  document.getElementById('gameOverModal').style.display = 'flex';
}

function createFireworks() {
  const container = document.getElementById('fireworks');
  container.innerHTML = '';
  setInterval(() => {
    for (let i = 0; i < 30; i++) {
      const fw = document.createElement('div');
      fw.className = 'firework';
      fw.style.left       = Math.random() * 100 + '%';
      fw.style.top        = Math.random() * 100 + '%';
      fw.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
      fw.style.setProperty('--x', (Math.random() - 0.5) * 200 + 'px');
      fw.style.setProperty('--y', (Math.random() - 0.5) * 200 + 'px');
      container.appendChild(fw);
      setTimeout(() => fw.remove(), 1000);
    }
  }, 200);
}

function backToMenu() {
  playSound('click');
  dragState = null;
  clearDragListeners();
  document.getElementById('game').style.display         = 'none';
  document.getElementById('victoryModal').style.display = 'none';
  document.getElementById('gameOverModal').style.display = 'none';
  document.getElementById('menu').style.display         = 'flex';
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function showLibrary() {
  playSound('click');
  document.getElementById('menu').style.display = 'none';
  const library = document.getElementById('library');
  library.style.display = 'flex';
  const content = document.getElementById('library-content');
  content.innerHTML = '';

  Object.keys(extensionsData).forEach(level => {
    const section = document.createElement('div');
    section.className = 'library-section';
    section.innerHTML = `<h3>Nivel ${level}</h3>`;
    for (const [ext, desc] of Object.entries(extensionsData[level])) {
      const item = document.createElement('a');
      item.className = 'library-item';
      item.href      = wikipediaLinks[ext] || `https://es.wikipedia.org/wiki/${ext}`;
      item.target    = '_blank';
      item.rel       = 'noopener noreferrer';
      item.innerHTML = `<strong>.${ext}</strong> ${desc}`;
      section.appendChild(item);
    }
    content.appendChild(section);
  });
}

function hideLibrary() {
  playSound('click');
  document.getElementById('library').style.display = 'none';
  document.getElementById('menu').style.display    = 'flex';
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// ─── Utils ────────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
