// ─── CANVAS ───────────────────────────────────────────────────────────────────
function resizeCanvases() {
  const { W, H } = getSceneSize();
  ['line-canvas','anim-canvas'].forEach(cid => {
    const c = document.getElementById(cid);
    c.width = W; c.height = H;
  });
}

function renderLines() {
  const canvas = document.getElementById('line-canvas');
  resizeCanvases();
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  visitedLines.forEach(line => {
    const a = getNodePos(line.from);
    const b = getNodePos(line.to);
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = line.color; ctx.lineWidth = 1.5;
    ctx.setLineDash(line.dashed ? [4,4] : []);
    ctx.stroke(); ctx.setLineDash([]);
  });
}

// ─── ANIMATED STREAMS ─────────────────────────────────────────────────────────
let animLoopRunning = false;

function startAnimLoop() {
  if (animLoopRunning) return;
  animLoopRunning = true;
  requestAnimationFrame(animLoop);
}

function animLoop() {
  const canvas = document.getElementById('anim-canvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const now = performance.now();

  const EMIT_INTERVAL = 420;
  const DOT_SPEED = 110;

  activeStreams.forEach(s => {
    const elapsed = now - s.startTime;
    const dotsEmitted = Math.floor(elapsed / EMIT_INTERVAL) + 1;

    const a = getNodePos(s.from);
    const b = getNodePos(s.to);
    if (!a || !b) return;
    const dx = b.x - a.x, dy = b.y - a.y;
    const len = Math.sqrt(dx*dx + dy*dy);
    if (len < 1) return;

    const travelTime = len / (s.speed || DOT_SPEED) * 1000;

    for (let i = 0; i < dotsEmitted; i++) {
      const dotAge = elapsed - i * EMIT_INTERVAL;
      if (dotAge < 0) continue;
      const t = dotAge / travelTime;
      if (t > 1) continue;

      const x = a.x + dx * t;
      const y = a.y + dy * t;
      if (x < -20 || x > canvas.width+20 || y < -20 || y > canvas.height+20) continue;

      const FADE = 0.08;
      const alphaIn  = t < FADE       ? t / FADE       : 1;
      const alphaOut = t > (1 - FADE) ? (1 - t) / FADE : 1;
      const alpha = Math.min(alphaIn, alphaOut);

      if (s.wave) {
        const maxR = 18;
        const rings = 3;
        for (let r = 0; r < rings; r++) {
          const phase = ((t * 2) + r / rings) % 1;
          const radius = phase * maxR;
          const ringAlpha = (1 - phase) * alpha * 0.8;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = ringAlpha;
          ctx.shadowColor = s.color; ctx.shadowBlur = 6;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
        if (s.encrypted) {
          ctx.font = 'bold 14px monospace';
          ctx.fillStyle = s.color;
          ctx.globalAlpha = 0.9 * alpha;
          ctx.shadowColor = s.color; ctx.shadowBlur = 8;
          ctx.fillText('?', x - 5, y + 5);
          ctx.shadowBlur = 0;
        }
        ctx.globalAlpha = 1;
      } else if (s.encrypted) {
        ctx.font = 'bold 20px monospace';
        ctx.fillStyle = s.color;
        ctx.globalAlpha = 0.95 * alpha;
        ctx.shadowColor = s.color; ctx.shadowBlur = 10;
        ctx.fillText('?', x - 7, y + 8);
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      } else {
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI*2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = alpha;
        ctx.shadowColor = s.color; ctx.shadowBlur = 8;
        ctx.fill(); ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      }
    }
  });

  requestAnimationFrame(animLoop);
}

function addStream(fromId, toId, color, encrypted, speed, wave) {
  activeStreams.push({ from: fromId, to: toId, color, encrypted, wave: !!wave, speed: speed || 70, startTime: performance.now() });
}

function clearStreams() { activeStreams = []; }
