// ─── SCENE SIZE ───────────────────────────────────────────────────────────────
function getSceneSize() {
  const w = document.getElementById('scene-wrapper');
  return { W: w.clientWidth, H: w.clientHeight };
}

// ─── NODE POSITIONS ───────────────────────────────────────────────────────────
function getNodePos(id) {
  const { W, H } = getSceneSize();

  const rd = ROUTERS.find(r => r.id === id);
  if (rd) return { x: W * rd.xp / 100, y: H * rd.yp / 100 };
  if (id === 'yt') return { x: W * YT.xp / 100, y: H * YT.yp / 100 };
  if (SAT_NODES[id]) {
    if (window._devOverrides && window._devOverrides[id]) {
      const o = window._devOverrides[id];
      return { x: W * o.xp / 100, y: H * o.yp / 100 };
    }
    const s = SAT_NODES[id];
    return { x: W * s.xp / 100, y: H * s.yp / 100 };
  }

  if (window._devOverrides && window._devOverrides[id]) {
    const o = window._devOverrides[id];
    return { x: W * o.xp / 100, y: H * o.yp / 100 };
  }
  const el = document.getElementById('dnode-' + id);
  if (!el) return { x: W * 0.05, y: H * 0.5 };
  const pos = getLeftColPositions();
  const p = pos[id];
  if (!p) return { x: W * 0.05, y: H * 0.5 };
  return { x: W * p.xp / 100, y: H * p.yp / 100 };
}

// ─── PATH BUILDER ─────────────────────────────────────────────────────────────
function buildOnePath() {
  const p = ["pc"];
  if (vpnActive) p.push("vpn");
  p.push("router");
  if (isSat) {
    p.push("parabolica_tx");
    p.push("satelite");
    p.push("parabolica_rx");
  }
  p.push("isp");
  HOP_GROUPS.forEach(group => {
    if (vpnActive && window._vpnRouter && group.includes(window._vpnRouter)) {
      p.push(window._vpnRouter);
    } else {
      p.push(group.length === 1 ? group[0] : group[Math.floor(Math.random() * group.length)]);
    }
  });
  return p;
}

function buildPath() {
  path = buildOnePath();
  let attempt, tries = 0;
  do { attempt = buildOnePath(); tries++; } while (tries < 20 && attempt.join() === path.join());
  returnPath = [...attempt].reverse();
  window._vpnExitIdx    = vpnActive && window._vpnRouter ? path.indexOf(window._vpnRouter) : -1;
  window._vpnExitIdxRev = vpnActive && window._vpnRouter ? returnPath.indexOf(window._vpnRouter) : -1;
  document.getElementById("hop-total") && (document.getElementById("hop-total").textContent = path.length - 1);
}
