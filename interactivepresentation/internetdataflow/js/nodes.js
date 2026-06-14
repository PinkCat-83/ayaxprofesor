// ─── INIT ─────────────────────────────────────────────────────────────────────
function init() {
  const scene = document.getElementById('scene');
  scene.innerHTML = '';

  const devDefs = [
    { id:'pc',     emoji:'💻', vpnStyle: false },
    { id:'vpn',    emoji:'🛡', vpnStyle: true  },
    { id:'router', emoji:'📡', vpnStyle: false },
    { id:'isp',    emoji:'',   vpnStyle: false, extraStyle:'background:#003366;border-color:#1a5499;padding:2px' },
  ];

  devDefs.forEach(d => {
    const el = document.createElement('div');
    el.className = 'device-node';
    el.id = 'dnode-' + d.id;
    el.style.left = LEFT_XP + '%';
    el.style.top  = '50%';
    el.style.display = (d.id === 'vpn') ? 'none' : 'flex';

    const iconEl = document.createElement('div');
    iconEl.id = 'dicon-' + d.id;
    iconEl.className = 'device-icon' + (d.vpnStyle ? ' vpn-style' : '');
    if (d.extraStyle) iconEl.setAttribute('style', d.extraStyle);

    if (d.vpnStyle) {
      iconEl.innerHTML = `${d.emoji}<span class="vpn-lbl">VPN</span>`;
    } else if (d.id === 'pc') {
      iconEl.innerHTML = `<img src="img/pc.png" style="width:52px;height:auto;display:block;">`;
    } else if (d.id === 'router') {
      iconEl.innerHTML = `
        <div class="router-img-wrap">
          <img src="img/router.png" alt="router">
        </div>`;
    } else if (d.id === 'isp') {
      iconEl.innerHTML = `<img src="img/isp.png" style="width:56px;height:auto;display:block;">`;
    } else {
      iconEl.textContent = d.emoji;
    }
    el.appendChild(iconEl);
    scene.appendChild(el);
  });

  // Router triangles — start hidden
  ROUTERS.forEach(r => {
    const el = document.createElement('div');
    el.className = 'r-node node-hidden';
    el.id = 'rnode-' + r.id;
    el.style.left = r.xp + '%';
    el.style.top  = r.yp + '%';
    el.innerHTML = `
      <div class="router-triangle" id="rtri-${r.id}"></div>
      <div class="vpn-exit-shield" id="vshield-${r.id}">🛡<span class="vpn-label-inside">VPN</span></div>`;
    scene.appendChild(el);
  });

  // YouTube — start hidden
  const ytEl = document.createElement('div');
  ytEl.className = 'yt-node node-hidden';
  ytEl.id = 'rnode-yt';
  ytEl.style.left = YT.xp + '%';
  ytEl.style.top  = YT.yp + '%';
  ytEl.innerHTML = `<div class="yt-icon" id="rtri-yt"><img src="img/youtube.png" alt="YouTube"></div>`;
  scene.appendChild(ytEl);

  positionDeviceNodes(false);

  ['router','isp'].forEach(id => {
    const el = document.getElementById('dnode-' + id);
    if (el) el.classList.add('node-hidden');
  });

  requestAnimationFrame(() => {
    revealNode('dnode-pc');
    revealNode('rnode-yt');
    visitedNodes.add('pc');
    highlightNode('pc', 'active');
  });

  buildPath();
  resizeCanvases();
  renderLines();
  updateHopCounter();
  startAnimLoop();
  setIntroButtons();
}

// ─── DEVICE NODE POSITIONING ──────────────────────────────────────────────────
function positionDeviceNodes(animate) {
  const positions = getLeftColPositions();

  const vpnNode = document.getElementById('dnode-vpn');
  if (vpnNode) vpnNode.style.display = vpnActive ? 'flex' : 'none';

  Object.entries(positions).forEach(([id, pos]) => {
    const el = document.getElementById('dnode-' + id);
    if (!el) return;
    el.style.left = pos.xp + '%';
    if (!animate) {
      el.style.transition = 'none';
      el.style.top = pos.yp + '%';
      requestAnimationFrame(() => el.style.transition = '');
    } else {
      el.style.top = pos.yp + '%';
    }
  });
}

// ─── NODE HIGHLIGHT ───────────────────────────────────────────────────────────
function highlightNode(id, mode) {
  const dicon = document.getElementById('dicon-' + id);
  if (dicon) {
    const base = dicon.classList.contains('vpn-style') ? 'device-icon vpn-style' : 'device-icon';
    if (mode === 'active' && !dicon.classList.contains('active')) {
      dicon.className = base + ' active';
    } else if (mode === 'return' && !dicon.classList.contains('active-return')) {
      dicon.className = base + ' active-return';
    } else if (mode === 'active' || mode === 'return') {
      // already set
    } else {
      dicon.className = base;
    }
    return;
  }

  const shield = document.getElementById('vshield-' + id);
  if (shield && shield.style.display !== 'none') {
    if (mode === 'active' || mode === 'return') shield.classList.add('active');
    return;
  }
  const tri = document.getElementById('rtri-' + id);
  if (tri && id !== 'yt') {
    if (mode === 'active')        tri.classList.add('active-now');
    else if (mode === 'return')   tri.classList.add('active-return');
    return;
  }

  const sicon = document.getElementById('sicon-' + id);
  if (sicon) {
    if (mode === 'active')       sicon.classList.add('active');
    else if (mode === 'return')  { sicon.classList.remove('active'); sicon.classList.add('active-return'); }
    return;
  }

  if (id === 'yt') {
    const yt = document.getElementById('rtri-yt');
    if (yt) {
      if (mode === 'active')       yt.classList.add('active');
      else if (mode === 'return')  { yt.classList.remove('active'); yt.classList.add('active-return'); }
      else if (mode === 'visited') yt.classList.add('visited');
    }
  }
}

function setVPNExitRouter(routerId, on) {
  const tri    = document.getElementById('rtri-' + routerId);
  const shield = document.getElementById('vshield-' + routerId);
  if (!tri || !shield) return;
  tri.style.display    = on ? 'none' : '';
  shield.style.display = on ? 'flex' : 'none';
}

function revealNode(elId) {
  const el = document.getElementById(elId);
  if (el) { el.classList.add('revealed'); el.classList.remove('node-hidden'); }
}

// ─── SATELLITE NODE CREATION ──────────────────────────────────────────────────
function createSatNode(id) {
  const el = document.createElement('div');
  el.id = 'snode-' + id;
  el.className = 'r-node node-hidden revealed';
  el.style.position = 'absolute';
  el.style.transform = 'translate(-50%,-50%)';
  el.style.zIndex = '10';
  el.style.display = 'flex';
  el.style.flexDirection = 'column';
  el.style.alignItems = 'center';

  const pos = SAT_NODES[id];
  el.style.left = pos.xp + '%';
  el.style.top  = pos.yp + '%';

  const imgSrc = id === 'satelite' ? 'img/satelite.png' : 'img/parabolica.png';
  el.innerHTML = `<div class="sat-icon" id="sicon-${id}"><img src="${imgSrc}" alt="${id}"></div>`;

  el.addEventListener('mousedown', () => {});
  return el;
}
