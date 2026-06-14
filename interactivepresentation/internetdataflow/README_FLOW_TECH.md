# 🔧 Technical README — Internet Flow

> Internal reference for development, debugging, and AI-assisted work.  
> → [Presentation README](./README_FLOW_PRES.md) · [Design System](../../DESIGN_SYSTEM.md)

---

## 🤖 AI Instructions

- Wait for the author to specify what needs to be done before proceeding.
- Ask for the relevant files before making any modifications.
- Follow `DESIGN_SYSTEM.md` for all visual work.
- Node positions and topology live in `js/config.js` — prefer data changes over code changes when adjusting the layout.
- Global state lives in `js/state.js` — never declare new persistent state outside of it.
- Each JS module has a single responsibility; do not merge concerns across files.

---

## 1. Architecture

Vanilla JS, no dependencies, no build step. Pure canvas animation + absolute-positioned DOM nodes over a `<div id="scene">`. Two `<canvas>` layers: one for static lines (`line-canvas`, z-index 3) and one for animated particles (`anim-canvas`, z-index 4).

### JS load order (matters — no module system)

```
config.js   → state.js   → path.js   → canvas.js  → phone.js
nodes.js    → steps.js   → modes.js  → variants.js → drag.js → main.js
```

Dependencies flow strictly left-to-right. No file may import from a file that loads after it.

---

## 2. File Responsibilities

| File | Responsibility |
|---|---|
| `config.js` | Static data: `ROUTERS`, `YT`, `HOP_GROUPS`, `SAT_NODES`, `LEFT_XP`, `getLeftColPositions()` |
| `state.js` | All mutable global variables (`vpnActive`, `path`, `currentStep`, `visitedLines`, etc.) |
| `path.js` | `getSceneSize()`, `getNodePos()`, `buildOnePath()`, `buildPath()` |
| `canvas.js` | `resizeCanvases()`, `renderLines()`, `animLoop()`, `addStream()`, `clearStreams()` |
| `phone.js` | "Flujo de información" panel — chain sentence builder, color palette, line rendering |
| `nodes.js` | `init()`, `positionDeviceNodes()`, `highlightNode()`, `revealNode()`, `setVPNExitRouter()`, `createSatNode()` |
| `steps.js` | `nextStep()`, `doIntroStep()`, `doVpnSetup()`, `doSatSetup()`, `startReverse()`, `showFinish()`, `updateHopCounter()`, stage messages |
| `modes.js` | `setMode()`, `toggleVPN()`, `revealAll()`, `resetAll()` |
| `variants.js` | `toggle5G()`, `toggleSat()` |
| `drag.js` | Drag-and-drop via event delegation — `getDragConfig()`, `ensureDragLabels()`, mousedown/mousemove/mouseup listeners |
| `main.js` | `window.load`, `resize`, `keydown` listeners — entry point only |

---

## 3. Node System

### Node types

| Type | DOM selector | ID pattern | Example |
|---|---|---|---|
| Device node (left column) | `.device-node` | `dnode-{id}` | `dnode-pc`, `dnode-vpn` |
| Router triangle | `.r-node` | `rnode-{id}` | `rnode-r3` |
| YouTube node | `.yt-node` | `rnode-yt` | — |
| Satellite node | `.r-node` (dynamic) | `snode-{id}` | `snode-satelite` |

### Left-column layout

Positions are computed dynamically by `getLeftColPositions()` based on `vpnActive`:

| VPN off | VPN on |
|---|---|
| pc=20%, router=50%, isp=80% | pc=12%, vpn=35%, router=58%, isp=81% |

All percentages are relative to scene height (`yp`). Horizontal position is fixed at `LEFT_XP = 8%`.

### Highlight states

| CSS class | Meaning |
|---|---|
| `active` | Currently reached on the forward pass (blue) |
| `active-return` | Reached on the return pass (green) |
| `visited` | Reached in a prior step and kept lit |

`highlightNode(id, mode)` dispatches across device icons, router triangles, VPN shields, satellite icons, and the YouTube icon via a chain of `getElementById` checks.

---

## 4. Path System

`buildOnePath()` constructs a single forward path array:

```
["pc"] → (vpn?) → ["router"] → (sat? parabolica_tx, satelite, parabolica_rx) → ["isp"] → [r_group1] → [r_group2] → [r_group3] → [r_group4] → ["yt"]
```

`buildPath()` calls `buildOnePath()` twice (ensuring the return path differs), sets `returnPath` as the reversed second attempt, and computes `_vpnExitIdx` and `_vpnExitIdxRev` for encryption boundary detection.

### Encryption boundaries

A segment is encrypted if:
- `vpnActive === true`
- The hop index is **after** the `vpn` sidebar node
- The hop index is **at or before** `_vpnExitIdx` (the VPN exit router)

Encrypted segments use dashed lines and render `?` glyphs instead of dots on the animation canvas.

---

## 5. Animation System

Two canvas layers, both redrawn on every `requestAnimationFrame`:

- **`line-canvas`** — static visited lines, redrawn by `renderLines()` on every state change.
- **`anim-canvas`** — moving particles, driven by `animLoop()` which runs continuously.

### Stream object

```javascript
{
  from: 'pc',           // source node id
  to:   'router',       // destination node id
  color: '#58a6ff',     // particle color
  encrypted: false,     // renders '?' glyph if true
  wave: false,          // renders expanding rings (satellite segments)
  speed: 70,            // px/s
  startTime: DOMHighResTimeStamp
}
```

Particles fade in and out at the start and end of each segment (`FADE = 0.08` of total travel fraction).

---

## 6. Drag & Drop

Uses a single `mousedown` delegation on `document`. `getDragConfig(el)` walks up from the clicked element with `.closest()` to find a draggable node, then returns a `{ el, label, getPos, setPos }` config object.

Position overrides are stored in `window._devOverrides` (keyed by node id) and checked first by `getNodePos()`. This means dragged positions survive mode changes but reset on `resetAll()` (`window._devOverrides = {}`).

Logging: on `mouseup`, the new position is logged to the console as a copy-pasteable config object:
```
{ id:'r3', xp:48, yp:22 }
```

---

## 7. CSS Architecture

| File | Covers |
|---|---|
| `variables.css` | `:root` design tokens (colors, font imports), `* { box-sizing }` reset |
| `layout.css` | `body`, `h1`, `.subtitle`, `.stage-banner`, `.canvas-row`, `.scene-wrapper`, canvas positioning, legend |
| `nodes.css` | `.device-node`, `.device-icon`, `.r-node`, `.router-triangle`, `.vpn-exit-shield`, `.yt-node`, `.yt-icon`, `.sat-icon`, reveal animations, `@keyframes vpn-pulse` |
| `ui.css` | `.hop-info`, `.enc-badge`, `.finish-badge`, `.btn-panel`, `.btn`, `.btn-divider`, `.speed-vertical`, `.phone-panel`, `.phone-line`, mode button variants, `.drag-label` |

Do not add dark backgrounds, neon effects, or glassmorphism — those are reserved for the parent project's `index.html`.

---

## 8. Pending Tasks

- [ ] **Mobile warning** — add shared component (`/css/mobile-warning.css` + `/js/mobile-warning.js`).
- [ ] **`tinyfoot` integration** — add small footer once hosted under `ayaxprofesor.es`.
- [ ] **Touch / pointer events** — drag currently uses mouse events only; add `pointerdown/move/up` for tablet use.
- [ ] **Satellite drag labels** — `ensureDragLabels()` skips `snode-*` nodes; extend to cover them.
- [ ] **`stageMsgs` reactivity** — `router` and `isp` messages reference `is5G` and `isSat` at parse time (not reactive). Refactor `getStageMsg()` to read current state dynamically for those two entries.

- [ ] **CDN** - Add CDN node, to explain what CDN does
- [ ] The flow of information should be completely erased when the reverse starts.
