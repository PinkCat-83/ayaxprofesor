// ─── STAGE MESSAGES ───────────────────────────────────────────────────────────
const stageMsgs = {
  pc:     { title:'💻 Tu ordenador',     desc:'Generas una petición HTTP GET a youtube.com' },
  vpn:    { title:'🛡 Túnel VPN activo', desc:'Los datos se cifran antes de salir de tu red' },
  router: { title: is5G ? '📶 Torre 5G' : '📡 Router Wi-Fi', desc: is5G ? 'Tu dispositivo conecta con la torre 5G más cercana' : 'Asigna IP local y enruta el paquete hacia internet' },
  isp:    { title: isSat ? '🔷 ISP' : '🔷 Movistar (ISP)', desc: isSat ? 'El ISP receptor gestiona tu conexión y la dirige hacia la red troncal' : 'Tu proveedor dirige el tráfico hacia la red troncal' },
  parabolica_tx: { title:'📡 Antena parabólica', desc:'La señal sale del router y sube en microondas hacia el satélite (~550 km)' },
  satelite:      { title:'🛸 Satélite',           desc:'El satélite recibe la señal y la retransmite hacia la estación en tierra' },
  parabolica_rx: { title:'📡 Estación receptora', desc:'La señal llega a tierra y se entrega al ISP que gestiona la conexión a internet' },
  yt:     { title:'▶ YouTube',           desc:'¡Solicitud recibida! El servidor prepara la respuesta' },
};

function getStageMsg(id, hopIdx, totalHops) {
  if (stageMsgs[id]) return stageMsgs[id];
  if (vpnActive && window._vpnRouter === id)
    return { title:'🛡 Servidor VPN exit', desc:'Aquí se descifra el paquete antes de continuar' };
  const vpnSidebarIdx = vpnActive ? path.indexOf('vpn') : -1;
  const enc = vpnActive && window._vpnExitIdx > 0 && hopIdx > vpnSidebarIdx && hopIdx <= window._vpnExitIdx;
  return {
    title: `🔺 Router intermediario (salto ${hopIdx})`,
    desc:  enc ? '❓ Paquete cifrado — los routers no pueden leer el contenido'
               : 'El paquete salta de router en router buscando la ruta óptima',
  };
}

const introMessages = [
  { title: '💻 Tu ordenador', desc: 'Desde aquí sale la petición. YouTube está al otro lado de internet.' },
  { title: '📡 Router Wi-Fi', desc: 'El router de casa conecta tu red local con el proveedor de internet.' },
  { title: '🔷 Movistar (ISP)', desc: 'Tu proveedor de internet dirige el tráfico hacia la red troncal.' },
  { title: '🔺 Servidores intermedios', desc: 'Los paquetes saltan por múltiples routers hasta llegar a destino.' },
];

// ─── INTRO STEPS ──────────────────────────────────────────────────────────────
function doIntroStep() {
  if (animating) return;
  animating = true;
  document.getElementById('btn-next').disabled = true;

  introStep++;

  const msg = introMessages[Math.min(introStep, introMessages.length - 1)];
  document.getElementById('stage-title').textContent = msg.title;
  document.getElementById('stage-desc').textContent  = msg.desc;

  if (introStep === 1) {
    const el = document.getElementById('dnode-router');
    if (el) el.classList.remove('node-hidden');
    setTimeout(() => revealNode('dnode-router'), 20);
    setTimeout(() => { animating = false; document.getElementById('btn-next').disabled = false; }, 400);

  } else if (introStep === 2) {
    const el = document.getElementById('dnode-isp');
    if (el) el.classList.remove('node-hidden');
    setTimeout(() => revealNode('dnode-isp'), 20);
    setTimeout(() => { animating = false; document.getElementById('btn-next').disabled = false; }, 400);

  } else if (introStep === 3) {
    const routerIds = ROUTERS.map(r => 'rnode-' + r.id);
    for (let i = routerIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [routerIds[i], routerIds[j]] = [routerIds[j], routerIds[i]];
    }
    routerIds.forEach((id, i) => {
      setTimeout(() => revealNode(id), i * 120);
    });
    const totalTime = routerIds.length * 120 + 200;
    setTimeout(() => {
      introPhase = false;
      animating  = false;
      document.getElementById('stage-title').textContent = 'Listo para enviar';
      document.getElementById('stage-desc').textContent  = 'Pulsa "Siguiente salto" para iniciar la transmisión';
      document.getElementById('btn-next').disabled = false;
      setIntroButtons();
    }, totalTime);
  }
}

// ─── VPN SETUP ────────────────────────────────────────────────────────────────
function doVpnSetup() {
  vpnSetupPending = false;
  document.getElementById('btn-next').disabled = true;

  vpnActive = true;
  if (window._vpnRouterPending) {
    window._vpnRouter = window._vpnRouterPending;
    window._vpnRouterPending = null;
  }
  setVPNExitRouter(window._vpnRouter, true);
  document.getElementById('enc-badge').classList.add('visible');
  buildPath();

  const vpnEl = document.getElementById('dnode-vpn');
  if (vpnEl) {
    vpnEl.style.transition = 'none';
    vpnEl.style.top  = '20%';
    vpnEl.style.display = 'flex';
    vpnEl.classList.remove('node-hidden');
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      positionDeviceNodes(true);
      if (vpnEl) {
        vpnEl.style.transition = '';
        vpnEl.classList.add('revealed');
      }
    });
  });

  setTimeout(() => {
    highlightNode('vpn', 'active');
    visitedNodes.add('vpn');
    const shield = document.getElementById('vshield-' + window._vpnRouter);
    if (shield) shield.classList.add('active');
    renderLines();

    document.getElementById('stage-title').textContent = '🔒 Túnel VPN establecido';
    document.getElementById('stage-desc').textContent  = 'El tráfico irá cifrado hasta el servidor VPN. Pulsa ▶️ para iniciar la transmisión';
    document.getElementById('btn-next').disabled = false;
  }, 500);
}

// ─── SAT SETUP ────────────────────────────────────────────────────────────────
function doSatSetup() {
  satSetupPending = false;
  document.getElementById('btn-next').disabled = true;

  document.getElementById('stage-title').textContent = '🛸 Conexión por satélite';
  document.getElementById('stage-desc').textContent  = 'La señal saldrá de tu red hacia el espacio antes de llegar a internet';

  const order = ['parabolica_tx', 'satelite', 'parabolica_rx'];
  order.forEach((id, i) => {
    setTimeout(() => {
      let el = document.getElementById('snode-' + id);
      if (!el) {
        el = createSatNode(id);
        document.getElementById('scene').appendChild(el);
        ensureDragLabels();
      }
      el.style.display = 'flex';
      el.classList.add('node-hidden');
      el.classList.remove('revealed');
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.classList.remove('node-hidden');
        el.classList.add('revealed');
      }));
      setTimeout(() => { buildPath(); renderLines(); }, 120);
    }, i * 400);
  });

  const totalTime = order.length * 400 + 400;
  setTimeout(() => {
    buildPath(); renderLines();
    document.getElementById('stage-title').textContent = '📡 Ruta satelital lista';
    document.getElementById('stage-desc').textContent  = 'Los datos viajarán por el espacio antes de llegar a internet. Pulsa ▶️ para iniciar la transmisión';
    document.getElementById('btn-next').disabled = false;
  }, totalTime);
}

// ─── NEXT STEP ────────────────────────────────────────────────────────────────
function nextStep() {
  if (vpnSetupPending) { doVpnSetup(); return; }
  if (satSetupPending) { doSatSetup(); return; }
  if (window._reverseReady) { window._reverseReady = false; startReverse(); return; }
  if (introPhase) { doIntroStep(); return; }
  if (animating) return;
  if (currentStep >= path.length - 1) return;
  animating = true;
  document.getElementById('btn-next').disabled = true;

  const toIdx  = currentStep + 1;
  const fromId = path[currentStep];
  const toId   = path[toIdx];

  const vpnSidebarIdx = vpnActive ? path.indexOf('vpn') : -1;
  const isEnc = vpnActive && window._vpnExitIdx > 0
    && toIdx > vpnSidebarIdx
    && toIdx <= window._vpnExitIdx;

  if (currentStep >= 0) {
    const msg = getStageMsg(toId, toIdx, path.length);
    document.getElementById('stage-title').textContent = msg.title;
    document.getElementById('stage-desc').textContent  = msg.desc;
  }

  const isSatSeg = isSat && (fromId === 'satelite' || toId === 'satelite');
  const segColor = isSatSeg ? '#f0883e' : (isEnc ? '#c084fc' : '#58a6ff');
  const lineColor = isSatSeg ? 'rgba(240,136,62,0.45)' : (isEnc ? 'rgba(163,113,247,0.55)' : 'rgba(88,166,255,0.45)');
  addStream(fromId, toId, segColor, isEnc, undefined, isSatSeg);
  visitedLines.push({ from: fromId, to: toId, color: lineColor, dashed: isEnc });
  renderLines();

  setTimeout(() => {
    currentStep = toIdx;

    visitedNodes.add(toId);
    visitedNodes.forEach(id => highlightNode(id, 'active'));
    updateHopCounter();
    if (!isReturn) phoneAddNode(toId);
    animating = false;

    if (toId === 'yt') {
      document.getElementById('stage-title').textContent = '✅ ¡Solicitud recibida!';
      document.getElementById('stage-desc').textContent  = 'YouTube ha procesado la petición. Pulsa "Respuesta" para ver la vuelta.';
      showFinish(false);
      window._reverseReady = true;
      document.getElementById('btn-next').disabled = false;
    } else {
      document.getElementById('btn-next').disabled = false;
    }
  }, speedMs);
}

// ─── REVERSE ──────────────────────────────────────────────────────────────────
function startReverse() {
  if (animating) return;
  isReturn = true;
  document.getElementById('btn-next').disabled = true;
  document.getElementById('finish-badge').classList.remove('visible');
  document.getElementById('stage-title').textContent = '⟵ Respuesta de YouTube';
  document.getElementById('stage-desc').textContent  = 'Los datos del vídeo viajan de vuelta por la red';
  clearStreams();

  const revVpnExitIdx    = window._vpnExitIdxRev;
  const revVpnSidebarIdx = vpnActive ? returnPath.indexOf('vpn') : -1;

  ROUTERS.forEach(r => {
    const tri = document.getElementById('rtri-' + r.id);
    if (tri) {
      tri.classList.remove('active-now');
      tri.classList.remove('active-return');
      tri.classList.remove('visited');
    }
    const shield = document.getElementById('vshield-' + r.id);
    if (shield) shield.classList.remove('active');
  });

  let step = 0;

  function doReturn() {
    if (step >= returnPath.length - 1) {
      document.getElementById('stage-title').textContent = '💻 ¡Datos recibidos!';
      document.getElementById('stage-desc').textContent  = vpnActive
        ? '🔒 Los datos llegan cifrados y el cliente VPN los descifra'
        : 'El vídeo se almacena en buffer y comienza a reproducirse';
      highlightNode('pc', 'return');
      showFinish(true);
      return;
    }

    const fromId = returnPath[step];
    const toId   = returnPath[step + 1];

    const encSegment = vpnActive && revVpnExitIdx > 0 && revVpnSidebarIdx > 0
      && step >= revVpnExitIdx
      && step < revVpnSidebarIdx;

    const returnStageMsgs = {
      yt:     { title:'▶ YouTube',        desc:'Enviando los datos del vídeo de vuelta…' },
      isp:    { title:'🔷 Movistar (ISP)', desc:'El ISP encamina la respuesta hacia tu red' },
      router: { title: is5G ? '📶 Torre 5G' : '📡 Router Wi-Fi', desc: is5G ? 'Los datos llegan a la torre 5G y a tu dispositivo' : 'Tu router recibe los datos y los envía al PC' },
      parabolica_rx: { title:'📡 Estación receptora', desc:'La estación envía la respuesta al satélite' },
      satelite:      { title:'🛸 Satélite',            desc:'El satélite retransmite la señal de vuelta' },
      parabolica_tx: { title:'📡 Antena parabólica',   desc:'La señal llega a tu antena y de ahí a tu ordenador' },
      vpn:    { title:'🛡 Túnel VPN',      desc:'Los datos llegan cifrados al cliente VPN' },
    };
    const msg = returnStageMsgs[fromId]
      || { title: '🔺 Router intermediario (salto ' + (step + 1) + ')',
           desc: encSegment ? '❓ Paquete cifrado en tránsito' : 'El paquete salta de vuelta hacia el origen' };
    document.getElementById('stage-title').textContent = msg.title;
    document.getElementById('stage-desc').textContent  = msg.desc;

    highlightNode(fromId, 'return');
    visitedNodes.add(fromId);

    const isSatSegRet = isSat && (fromId === 'satelite' || toId === 'satelite');
    const retColor  = isSatSegRet ? '#f0883e' : (encSegment ? '#c084fc' : '#56d364');
    const retLColor = isSatSegRet ? 'rgba(240,136,62,0.4)' : (encSegment ? 'rgba(163,113,247,0.4)' : 'rgba(63,185,80,0.5)');
    addStream(fromId, toId, retColor, encSegment, 200, isSatSegRet);
    visitedLines.push({ from: fromId, to: toId, color: retLColor, dashed: encSegment });
    renderLines();

    const DOT_SPEED_RET = 200;
    const a = getNodePos(fromId);
    const b = getNodePos(toId);
    const dist = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
    const travelMs = (dist / DOT_SPEED_RET) * 1000;

    setTimeout(() => {
      step++;
      doReturn();
    }, travelMs + 30);
  }

  doReturn();
}

// ─── FINISH BADGE ─────────────────────────────────────────────────────────────
function showFinish(ret) {
  const badge = document.getElementById('finish-badge');
  document.getElementById('finish-title').textContent = ret ? '📺 ¡Video cargando!' : '✅ ¡Solicitud recibida!';
  document.getElementById('finish-sub').textContent   = ret ? 'Los datos llegaron correctamente' : 'YouTube ha procesado la petición';
  badge.classList.add('visible');
  setTimeout(() => badge.classList.remove('visible'), 2800);
}

function updateHopCounter() {
  document.getElementById('hop-num').textContent = currentStep;
}

function setIntroButtons() {
  const btnNext = document.getElementById('btn-next');
  const btnVpn  = document.getElementById('btn-vpn');
  if (introPhase) {
    btnNext.disabled    = false;
    btnReverse.disabled = true;
  } else {
    if (btnVpn) btnVpn.disabled = false;
  }
}
