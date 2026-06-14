// ─── LEFT-COLUMN CONFIG ───────────────────────────────────────────────────────
const LEFT_XP = 8; // % from left edge

function getLeftColPositions() {
  if (!vpnActive) {
    return {
      pc:     { xp: LEFT_XP, yp: 20 },
      router: { xp: LEFT_XP, yp: 50 },
      isp:    { xp: LEFT_XP, yp: 80 },
    };
  } else {
    return {
      pc:     { xp: LEFT_XP, yp: 12 },
      vpn:    { xp: LEFT_XP, yp: 35 },
      router: { xp: LEFT_XP, yp: 58 },
      isp:    { xp: LEFT_XP, yp: 81 },
    };
  }
}

// ─── SCENE ROUTERS ────────────────────────────────────────────────────────────
const ROUTERS = [
  { id:'r0', xp:28, yp:22 }, { id:'r1', xp:28, yp:35 }, { id:'r2', xp:30, yp:68 },
  { id:'r3', xp:48, yp:18 }, { id:'r4', xp:62, yp:52 }, { id:'r5', xp:50, yp:63 },
  { id:'r6', xp:67, yp:26 }, { id:'r7', xp:76, yp:44 },
  { id:'r8', xp:80, yp:20 }, { id:'r9', xp:85, yp:42 },
  { id:'r10', xp:40, yp:80 }, { id:'r11', xp:60, yp:78 }, { id:'r12', xp:75, yp:38 },
];

const YT = { id:'yt', xp:92, yp:50 };

const HOP_GROUPS = [
  ['r0','r1','r2'],
  ['r3','r4','r5','r10'],
  ['r6','r7','r11','r12'],
  ['r8','r9'],
  ['yt'],
];

// ─── SATELLITE NODES ──────────────────────────────────────────────────────────
const SAT_NODES = {
  parabolica_tx: { xp: 22, yp: 14 },
  satelite:      { xp: 50, yp: 6  },
  parabolica_rx: { xp: 78, yp: 14 },
};
