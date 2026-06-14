// ─── TELÉFONO ESCACHARRADO ────────────────────────────────────────────────────
const NODE_COLORS = {
  pc:     '#58a6ff',
  vpn:    '#c084fc',
  router: '#f0883e',
  isp:    '#0099ff',
  yt:     '#ff4444',
};
const ROUTER_PALETTE = ['#3fb950','#e3b341','#f78166','#79c0ff','#d2a8ff','#56d364','#ffa657'];

function getNodeColor(id) {
  if (NODE_COLORS[id]) return NODE_COLORS[id];
  const idx = parseInt(id.replace('r','')) % ROUTER_PALETTE.length;
  return ROUTER_PALETTE[idx];
}

let serverCounter = 0;
const serverNames = {};

function getNodeShortName(id) {
  const names = { pc:'Ordenador', vpn:'VPN', router:'Router', isp:'Movistar', yt:'YouTube' };
  if (names[id]) return names[id];
  if (!serverNames[id]) {
    serverCounter++;
    serverNames[id] = 'Servidor ' + serverCounter;
  }
  return serverNames[id];
}

let phoneChain = [];

function phoneReset() {
  phoneChain = [];
  serverCounter = 0;
  for (const k in serverNames) delete serverNames[k];
  document.getElementById('phone-lines').innerHTML = '';
}

function phoneAddNode(toId) {
  if (toId === 'pc') return;

  if (toId === 'yt') {
    const msg = buildChainSentence([...phoneChain], true);
    phoneAddLine('yt', msg);
    return;
  }

  phoneChain.push({ id: toId, name: getNodeShortName(toId), color: getNodeColor(toId) });
  const msg = buildChainSentence(phoneChain, false);
  phoneAddLine(toId, msg);
}

function buildChainSentence(chain, isYT) {
  const pcColor  = getNodeColor('pc');
  const ytColor  = getNodeColor('yt');
  const dim      = '#8b949e';

  let html = '';
  if (isYT) {
    html += `<span class="sender" style="color:${ytColor}">YouTube</span>`;
  } else {
    const receiver = chain[chain.length - 1];
    html += `<span class="sender" style="color:${receiver.color}">${receiver.name}</span>`;
  }
  html += `<span style="color:${dim}"> recibe que </span>`;

  const senders = isYT ? [...chain] : chain.slice(0, -1);
  for (let i = senders.length - 1; i >= 0; i--) {
    const node = senders[i];
    html += `<span class="sender" style="color:${node.color}">${node.name}</span>`;
    html += `<span style="color:${dim}"> le dijo que </span>`;
  }

  html += `<span class="sender" style="color:${pcColor}">Ordenador</span>`;
  html += `<span style="color:${dim}"> quiere ir a YouTube</span>`;

  return html;
}

function phoneAddLine(nodeId, html) {
  if (!html) return;
  const container = document.getElementById('phone-lines');
  const existing = container.querySelector('.phone-line');
  if (existing) {
    existing.style.opacity = '0';
    existing.style.transform = 'translateY(-4px)';
    setTimeout(() => existing.remove(), 320);
  }
  const line = document.createElement('div');
  line.className = 'phone-line';
  line.style.borderLeftColor = getNodeColor(nodeId);
  line.innerHTML = html;
  container.appendChild(line);
  requestAnimationFrame(() => requestAnimationFrame(() => line.classList.add('show')));
}
