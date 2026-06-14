// ─── VPN TOGGLE ───────────────────────────────────────────────────────────────
function toggleVPN() {
  const badge = document.getElementById('enc-badge');
  if (vpnActive) {
    badge.classList.add('visible');
  } else {
    badge.classList.remove('visible');
    if (window._vpnRouter) { setVPNExitRouter(window._vpnRouter, false); window._vpnRouter = null; }
    window._vpnExitIdx = -1;
  }
  positionDeviceNodes(true);
  setTimeout(() => { resetAll(true); }, 460);
}

// ─── MODES ────────────────────────────────────────────────────────────────────
function setMode(mode) {
  currentMode = mode;

  if (mode !== 'vpn') {
    ['empty','normal'].forEach(m => {
      document.getElementById('btn-mode-' + m).classList.remove('active-mode');
    });
    document.getElementById('btn-mode-' + mode).classList.add('active-mode');
  }

  if (mode === 'empty' || mode === 'normal') {
    vpnActive = false; vpnSetupPending = false;
    if (window._vpnRouter) { setVPNExitRouter(window._vpnRouter, false); window._vpnRouter = null; }
    window._vpnRouterPending = null; window._vpnExitIdx = -1;
    document.getElementById('enc-badge').classList.remove('visible');
    document.getElementById('btn-mode-vpn').classList.remove('active-mode');

    isSat = false; satSetupPending = false;
    document.getElementById('btn-sat').classList.remove('active-mode');
    ['parabolica_tx','satelite','parabolica_rx'].forEach(id => {
      const el = document.getElementById('snode-' + id);
      if (el) { el.classList.add('node-hidden'); el.classList.remove('revealed'); setTimeout(() => { el.style.display='none'; }, 400); }
    });
    const ispImg = document.querySelector('#dicon-isp img');
    if (ispImg) ispImg.src = 'img/isp.png';
    positionDeviceNodes(true);
    if (mode === 'empty') {
      setTimeout(() => resetAll(), 460);
    } else {
      setTimeout(() => { resetAll(); revealAll(false); }, 460);
    }

  } else if (mode === 'vpn') {
    const vpnWasActive = vpnActive || vpnSetupPending;

    if (vpnWasActive) {
      vpnActive = false; vpnSetupPending = false;
      if (window._vpnRouter) { setVPNExitRouter(window._vpnRouter, false); window._vpnRouter = null; }
      window._vpnRouterPending = null; window._vpnExitIdx = -1;
      document.getElementById('enc-badge').classList.remove('visible');
      document.getElementById('btn-mode-vpn').classList.remove('active-mode');
      const vpnEl = document.getElementById('dnode-vpn');
      if (vpnEl) { vpnEl.classList.add('node-hidden'); vpnEl.classList.remove('revealed'); setTimeout(() => { vpnEl.style.display = 'none'; }, 400); }
      positionDeviceNodes(true);
      setTimeout(() => { buildPath(); renderLines(); }, 460);

    } else {
      document.getElementById('btn-mode-vpn').classList.add('active-mode');
      const eligible = [['r3','r4','r5'],['r6','r7']];
      const g = eligible[Math.floor(Math.random() * eligible.length)];
      window._vpnRouterPending = g[Math.floor(Math.random() * g.length)];

      positionDeviceNodes(false);
      resetAll(false);
      revealAll(false);

      vpnSetupPending = true;
      document.getElementById('stage-title').textContent = '🛡 Modo VPN';
      document.getElementById('stage-desc').textContent  = 'Pulsa ▶️ para instalar el túnel VPN entre el ordenador y el router';
    }
    return;
  }
}

// ─── REVEAL ALL ───────────────────────────────────────────────────────────────
function revealAll(vpnMode) {
  ['router','isp'].forEach(id => {
    const el = document.getElementById('dnode-' + id);
    if (el) { el.classList.remove('node-hidden'); el.classList.add('revealed'); }
  });
  if (vpnMode) {
    const vpnEl = document.getElementById('dnode-vpn');
    if (vpnEl) { vpnEl.style.display = 'flex'; vpnEl.classList.remove('node-hidden'); vpnEl.classList.add('revealed'); }
  }
  ROUTERS.forEach(r => {
    const el = document.getElementById('rnode-' + r.id);
    if (el) { el.classList.remove('node-hidden'); el.classList.add('revealed'); }
  });
  ['parabolica_tx','satelite','parabolica_rx'].forEach(id => {
    const el = document.getElementById('snode-' + id);
    if (el) el.style.display = 'none';
  });
  const ytEl = document.getElementById('rnode-yt');
  if (ytEl) { ytEl.classList.remove('node-hidden'); ytEl.classList.add('revealed'); }

  introPhase = false;
  introStep = 99;

  if (vpnMode) {
    vpnSetupPending = true;
    document.getElementById('stage-title').textContent = '🛡 Modo VPN activo';
    document.getElementById('stage-desc').textContent  = 'Pulsa ▶️ para configurar el túnel VPN, luego inicia la transmisión';
  } else {
    vpnSetupPending = false;
    document.getElementById('stage-title').textContent = 'Listo para enviar';
    document.getElementById('stage-desc').textContent  = 'Todos los elementos en pantalla. Pulsa ▶️ para iniciar la transmisión';
  }

  document.getElementById('btn-next').disabled = false;
  renderLines();
}

// ─── RESET ALL ────────────────────────────────────────────────────────────────
function resetAll(keepVPN) {
  currentStep = 0; isReturn = false; animating = false; vpnSetupPending = false; satSetupPending = isSat;
  window._devOverrides = {}; window._reverseReady = false;
  introPhase = (currentMode === 'empty'); introStep = 0;
  phoneReset();
  visitedLines = []; visitedNodes = new Set(); clearStreams();

  document.getElementById('finish-badge').classList.remove('visible');
  document.getElementById('btn-next').disabled = false;
  if (currentMode === 'empty') {
    document.getElementById('stage-title').textContent = '💻 Tu ordenador';
    document.getElementById('stage-desc').textContent  = 'Pulsa ▶️ para ir descubriendo cada elemento de la red';
  } else {
    document.getElementById('stage-title').textContent = 'Listo para enviar';
    document.getElementById('stage-desc').textContent  = 'Pulsa ▶️ para iniciar la transmisión';
  }

  ['pc','vpn','router','isp'].forEach(id => {
    const dicon = document.getElementById('dicon-' + id);
    if (!dicon) return;
    const base = dicon.classList.contains('vpn-style') ? 'device-icon vpn-style' : 'device-icon';
    dicon.className = base;
  });

  ROUTERS.forEach(r => {
    const tri = document.getElementById('rtri-' + r.id);
    const shield = document.getElementById('vshield-' + r.id);
    if (tri)    tri.className = 'router-triangle';
    if (shield) shield.className = 'vpn-exit-shield';
    if (vpnActive && window._vpnRouter === r.id) {
      if (tri)    tri.style.display = 'none';
      if (shield) shield.style.display = 'flex';
    } else {
      if (tri)    tri.style.display = '';
      if (shield) shield.style.display = 'none';
    }
  });

  const yt = document.getElementById('rtri-yt');
  if (yt) yt.className = 'yt-icon';
  ['parabolica_tx','satelite','parabolica_rx'].forEach(id => {
    const si = document.getElementById('sicon-' + id);
    if (si) si.className = 'sat-icon';
    const sn = document.getElementById('snode-' + id);
    if (sn) sn.style.display = 'none';
  });

  const vpnNode = document.getElementById('dnode-vpn');
  if (vpnNode) vpnNode.style.display = vpnActive ? 'flex' : 'none';

  const devToHide = ['router','isp'];
  devToHide.forEach(id => {
    const el = document.getElementById('dnode-' + id);
    if (el) {
      if (currentMode === 'empty') {
        el.classList.add('node-hidden'); el.classList.remove('revealed');
      } else {
        el.classList.remove('node-hidden'); el.classList.add('revealed');
      }
    }
  });
  ROUTERS.forEach(r => {
    const el = document.getElementById('rnode-' + r.id);
    if (el) { el.classList.add('node-hidden'); el.classList.remove('revealed'); }
  });

  buildPath();
  renderLines();
  updateHopCounter();
  highlightNode('pc', 'active');
  document.getElementById('btn-next').disabled = false;
  ensureDragLabels();
}
