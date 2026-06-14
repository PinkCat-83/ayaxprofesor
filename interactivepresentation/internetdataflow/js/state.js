// ─── GLOBAL STATE ─────────────────────────────────────────────────────────────
let vpnActive       = false;
let currentMode     = 'empty';
let is5G            = false;
let isSat           = false;
let path            = [];
let currentStep     = 0;
let isReturn        = false;
let animating       = false;
let visitedLines    = [];
let visitedNodes    = new Set();
let activeStreams    = [];
let speedMs         = 350;
let introPhase      = true;
let introStep       = 0;
let vpnSetupPending = false;
let satSetupPending = false;
let returnPath      = [];
