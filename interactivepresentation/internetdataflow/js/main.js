// ─── KEYBOARD / PRESENTER REMOTE ──────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (['ArrowRight','ArrowDown',' '].includes(e.key)) {
    e.preventDefault();
    document.getElementById('btn-next').click();
  } else if (['ArrowLeft','ArrowUp'].includes(e.key)) {
    e.preventDefault();
    setMode(currentMode);
  }
});

// ─── RESIZE ───────────────────────────────────────────────────────────────────
window.addEventListener('resize', () => { resizeCanvases(); renderLines(); });

// ─── START ────────────────────────────────────────────────────────────────────
window.addEventListener('load', () => {
  init();
  initDrag();
  document.getElementById('btn-mode-empty').classList.add('active-mode');
  document.getElementById('stage-title').textContent = introMessages[0].title;
  document.getElementById('stage-desc').textContent  = introMessages[0].desc;
});
