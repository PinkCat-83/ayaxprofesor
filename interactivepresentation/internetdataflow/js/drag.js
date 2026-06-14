// ─── DRAG & DROP ──────────────────────────────────────────────────────────────
let dragState = null;

function getDragConfig(el) {
  const node = el.closest('.r-node, .yt-node, .device-node, [id^="snode-"]');
  if (!node) return null;

  const id = node.id;

  if (id && id.startsWith('snode-')) {
    const sid = id.replace('snode-', '');
    return {
      el: node, label: sid,
      getPos: () => {
        if (window._devOverrides && window._devOverrides[sid]) return window._devOverrides[sid];
        return SAT_NODES[sid] || { xp: 50, yp: 50 };
      },
      setPos: (x, y) => {
        if (!window._devOverrides) window._devOverrides = {};
        window._devOverrides[sid] = { xp: x, yp: y };
        const el2 = document.getElementById('snode-' + sid);
        if (el2) { el2.style.left = x + '%'; el2.style.top = y + '%'; }
      },
    };
  }

  if (id && id.startsWith('rnode-')) {
    const rid = id.replace('rnode-', '');
    if (rid === 'yt') {
      return {
        el: node, label: 'yt',
        getPos: () => ({ xp: YT.xp, yp: YT.yp }),
        setPos: (x, y) => { YT.xp = x; YT.yp = y; },
      };
    }
    const r = ROUTERS.find(r => r.id === rid);
    if (r) return {
      el: node, label: r.id,
      getPos: () => ({ xp: r.xp, yp: r.yp }),
      setPos: (x, y) => { r.xp = x; r.yp = y; },
    };
  }

  if (id && id.startsWith('dnode-')) {
    const did = id.replace('dnode-', '');
    return {
      el: node, label: did,
      getPos: () => {
        if (window._devOverrides && window._devOverrides[did]) return window._devOverrides[did];
        const pos = getLeftColPositions();
        return pos[did] || { xp: LEFT_XP, yp: 50 };
      },
      setPos: (x, y) => {
        if (!window._devOverrides) window._devOverrides = {};
        window._devOverrides[did] = { xp: x, yp: y };
      },
    };
  }
  return null;
}

function ensureDragLabels() {
  [...document.querySelectorAll('.r-node, .yt-node, .device-node')].forEach(node => {
    if (node.querySelector('.drag-label')) return;
    const id = node.id || '';
    let label = '';
    if (id.startsWith('rnode-')) label = id.replace('rnode-', '');
    else if (id.startsWith('dnode-')) label = id.replace('dnode-', '');
    if (!label) return;
    node.classList.add('draggable');
    const lbl = document.createElement('div');
    lbl.className = 'drag-label';
    lbl.textContent = label;
    node.appendChild(lbl);
  });
}

document.addEventListener('mousedown', e => {
  if (e.button !== 0) return;
  const cfg = getDragConfig(e.target);
  if (!cfg) return;
  e.preventDefault(); e.stopPropagation();
  const scene = document.getElementById('scene-wrapper').getBoundingClientRect();
  const pos = cfg.getPos();
  dragState = {
    ...cfg, scene,
    offX: e.clientX - (scene.left + scene.width  * pos.xp / 100),
    offY: e.clientY - (scene.top  + scene.height * pos.yp / 100),
  };
  cfg.el.style.transition = 'none';
  cfg.el.style.zIndex = 99;
});

document.addEventListener('mousemove', e => {
  if (!dragState) return;
  const { el, scene, offX, offY, setPos } = dragState;
  const xp = Math.min(99, Math.max(1, (e.clientX - offX - scene.left) / scene.width  * 100));
  const yp = Math.min(99, Math.max(1, (e.clientY - offY - scene.top)  / scene.height * 100));
  el.style.left = xp + '%';
  el.style.top  = yp + '%';
  setPos(xp, yp);
  renderLines();
});

document.addEventListener('mouseup', e => {
  if (!dragState) return;
  const { el, label, scene, offX, offY, setPos } = dragState;
  const xp = Math.min(99, Math.max(1, (e.clientX - offX - scene.left) / scene.width  * 100));
  const yp = Math.min(99, Math.max(1, (e.clientY - offY - scene.top)  / scene.height * 100));
  setPos(xp, yp);
  el.style.zIndex = '';
  el.style.transition = '';
  renderLines();
  console.log(`{ id:'${label}', xp:${Math.round(xp)}, yp:${Math.round(yp)} }`);
  dragState = null;
});

function initDrag() {
  ensureDragLabels();
}
