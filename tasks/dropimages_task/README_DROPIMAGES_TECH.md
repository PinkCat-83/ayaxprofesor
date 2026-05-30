# 🔧 Technical README — Drop Images Task

> Internal reference for development, debugging, and AI-assisted work.  
> → [Task README](./README_DROPIMAGES_TASK.md) · [Design System](../../DESIGN_SYSTEM.md)

---

## 🤖 AI Instructions

- Wait for the author to specify what needs to be done before proceeding.
- Ask for the relevant files before making any modifications.
- Always follow `DESIGN_SYSTEM.md` for visual consistency.
- CSS is split into 6 partials — always edit the correct file for the section being changed:

| File | Covers |
|---|---|
| `variables-base.css` | CSS variables, reset, base styles |
| `screens.css` | Menu, level buttons, end screens, loading overlay |
| `hud.css` | Top bar, volume slider, Menu button |
| `stage.css` | Stage, background layers, drag card, lives, drop zones |
| `components.css` | Progress bar, feedback overlay, modal, fireworks |
| `animations.css` | All `@keyframes` |

---

## 1. Architecture

The engine is fully data-driven. `dropimages.html` reads a JSON config from the URL parameter `?config=` and builds the entire game from it. Entry point HTMLs are thin redirects — they never contain game logic.

**Load flow:**
1. Entry HTML (`browser_game.html`) redirects to `dropimages.html?config=browser.json`
2. `main.js` initializes DOM references (`state-dom.js`), starts static image preload (Phase 1), and hands control to `engine.js`
3. `engine.js` renders the menu and waits for level selection
4. On level start: Phase 2 image preload (`Promise.allSettled`) → loading overlay → first question

---

## 2. Stage Layer Order (z-index)

| z-index | Element | Description |
|---|---|---|
| 0 | `#sky-layer` | Solid sky `#7ec8e3` |
| 1 | `#clouds-layer` | 8 SVG vector clouds (`clouds.js`) |
| 2 | `#stage-bg` | `background.webp`, no zoom/blur, anchored to top |
| 4 | `#seagulls-layer` | 5 SVG seagulls (`seagulls.js`) |
| 10 | `#drop-zones-row` | `dest_*` images floating over the sea |
| 20 | `#hud-lives`, `#drag-card`, `#btn-explain-game`, `#progress-bar-wrapper` | Foreground |
| 50 | `#feedback-overlay` | Feedback inside the board |
| 9999 | `#loading-overlay` | Black loading screen |

---

## 3. Key Systems

### Drag card

- Dimensions: `154 × 56px`, semi-transparent pink background `rgba(190, 24, 93, 0.35)`
- Icon always anchored left (`flex-start`), text centered in remaining space (`flex: 1`)
- Text max 2 lines (`max-height: 2.4em`), no shadow
- While dragging: clone with more opaque pink background (`0.85`), same padding and layout
- On drop outside zone: returns to position with `transform: translateX(-50%)`

### Feedback & end screens

`#feedback-overlay` lives inside `#stage-frame` (`position: absolute`). Image is the frame's `background-image`. Lasts **2.4 seconds** or until user click. On wrong answer, only the incorrect zone is highlighted in red.

| State | CSS class | Image | Sound |
|---|---|---|---|
| Correct | `correct-fb` | `ok.png` | `correct.mp3` |
| Incorrect | `incorrect-fb` | `wrong.png` | `wrong.mp3` |
| Victory | `victory-fb` | `fanfare.png` | `fanfare.mp3` + fireworks |
| Game over | `gameover-fb` | `gameover.png` | `gameover.mp3` |

Click on victory or game over returns to main menu.

### Image preloading

**Phase 1 — on startup** (`main.js`): static images in parallel, non-blocking.  
**Phase 2 — on level start** (`engine.js`): level logos via `Promise.allSettled()`. Black loading screen until all are ready.

### Progress bar

- `#progress-track` — semi-transparent pink rail
- `#progress-fill` — fill that advances with each correct answer
- `#progress-marker` (`progressbar_icon.png`) — floats ±4px (`progressBob`), advances with `left: X%`

Bar reaches 100% before showing the victory screen.

### Clouds (`clouds.js`)

8 SVG vector clouds with 5 distinct shapes (classic, elongated, fluffy, large flat, and very large multi-tower). All start inside the stage at a random position — no blank entry period. Recycled immediately on reaching the edge without pause. Parameters in `CLOUD_CONFIG`.

### Seagulls (`seagulls.js`)

5 SVG seagulls formed by two `<line>` elements. Sinusoidal flapping (`Math.sin`) and movement unified in a single `requestAnimationFrame`. Shrinking effect: final size is 30% of initial. Recycled without pause from the opposite side.

### Drop zone animations

| Element | Animation |
|---|---|
| Ship (`#drop-navigator`) | Gentle ±3° rotation (`animSail`, 4s, `transform-origin: bottom center`) |
| Map (`#drop-search`) | ±12px float (`animMapFloat`, 3s) + synchronized elliptical black shadow (`animMapShadow`) |
| Dock (`#drop-webpage`) | No animation (design decision) |

### Available animation classes (`animations.css`)

| Class | Effect |
|---|---|
| `anim-float` | Vertical float ±8px |
| `anim-shadow` | Synchronized elliptical shadow |
| `anim-sway` / `anim-sway-mid` / `anim-sway-strong` | Sway ±3° / ±6° / ±12° |
| `anim-calm` | Calm waters |
| `anim-surge` | Pronounced swell |
| `anim-sail` | ±3° rotation from base |

---

## 4. Pending Tasks

- [ ] Add mobile warning (shared component from root `js/mobile-warning.js`)

---

## 5. Completed

- [x] Card with icon anchored left, centered text, semi-transparent pink background
- [x] Drag clone with same layout and more opaque background
- [x] Feedback lasts 2.4s or until click
- [x] Victory and game over via overlay inside the board
- [x] Progress bar with floating marker
- [x] Two-phase preload with loading screen
- [x] SVG vector clouds (8 clouds, 5 shapes)
- [x] SVG seagulls with sinusoidal flapping and shrinking effect
- [x] Ship with gentle rotation, map with float and shadow
- [x] Multi-layer drag halo, no green hint on wrong answer
- [x] CSS split into 6 partials
- [x] `dest_*` position and size adjusted with final images
