// ─── 5G MODE ──────────────────────────────────────────────────────────────────
function toggle5G() {
  is5G = !is5G;
  const btn = document.getElementById('btn-5g');
  btn.classList.toggle('active-mode', is5G);

  const routerImg = document.querySelector('#dnode-router .router-img-wrap img');
  if (routerImg) routerImg.src = is5G ? 'img/5g.png' : 'img/router.png';

  const pcIcon = document.getElementById('dicon-pc');
  if (pcIcon) {
    if (is5G) {
      pcIcon.innerHTML = '<img src="img/movil.png" alt="móvil" style="width:44px;height:auto;">';
    } else {
      pcIcon.innerHTML = '<img src="img/pc.png" alt="PC" style="width:44px;height:auto;">';
    }
  }
}

// ─── SATELLITE MODE ───────────────────────────────────────────────────────────
function toggleSat() {
  isSat = !isSat;
  document.getElementById('btn-sat').classList.toggle('active-mode', isSat);

  const ispImg = document.querySelector('#dicon-isp img');
  if (ispImg) ispImg.src = isSat ? 'img/genericisp.png' : 'img/isp.png';

  if (isSat) {
    satSetupPending = true;
    ['parabolica_tx','satelite','parabolica_rx'].forEach(id => {
      const el = document.getElementById('snode-' + id);
      if (el) el.style.display = 'none';
    });
    const savedVpnActive = vpnActive;
    const savedVpnPending = vpnSetupPending;
    const savedVpnRouter = window._vpnRouter;
    const savedVpnRouterPending = window._vpnRouterPending;
    const savedVpnExitIdx = window._vpnExitIdx;
    revealAll(vpnActive);
    vpnActive = savedVpnActive;
    vpnSetupPending = savedVpnPending;
    window._vpnRouter = savedVpnRouter;
    window._vpnRouterPending = savedVpnRouterPending;
    window._vpnExitIdx = savedVpnExitIdx;
    if (vpnActive || vpnSetupPending) {
      document.getElementById('enc-badge').classList.toggle('visible', vpnActive);
      document.getElementById('btn-mode-vpn').classList.add('active-mode');
    }
  } else {
    satSetupPending = false;
    ['parabolica_tx','satelite','parabolica_rx'].forEach(id => {
      const el = document.getElementById('snode-' + id);
      if (!el) return;
      el.classList.add('node-hidden');
      el.classList.remove('revealed');
      setTimeout(() => { el.style.display = 'none'; }, 400);
    });
    buildPath();
    renderLines();
  }
}
